"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import {
  createBatchSchema,
  type BatchFormValues,
} from "@/lib/schema/create-batch-schema";
import { toast } from "sonner";
import { useRole } from "@/lib/context/auth-context";
import { useQuery } from "@tanstack/react-query";

interface EditBatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  onBatchUpdated?: () => void;
}

export function EditBatch({
  open,
  onOpenChange,
  batchId,
  onBatchUpdated,
}: EditBatchModalProps) {
  const { isAdmin } = useRole();

  // Fetch existing batch data
  const { data: batch, isLoading } = useQuery({
    queryKey: ["batch", batchId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.GET_BATCH(batchId));
      return response.data.batch || response.data;
    },
    enabled: open && !!batchId,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    mode: "onChange",
  });

  // Populate form with existing data
  React.useEffect(() => {
    if (batch) {
      reset({
        batchName: batch.batchName || "",
        description: batch.description || "",
        startDate: batch.startDate ? new Date(batch.startDate) : undefined,
        endDate: batch.endDate ? new Date(batch.endDate) : undefined,
        status: batch.status || "",
      });
    }
  }, [batch, reset]);

  // Show toast for validation errors
  React.useEffect(() => {
    if (errors.batchName?.message) {
      toast.error(errors.batchName.message);
    }
    if (errors.description?.message) {
      toast.error(errors.description.message);
    }
    if (errors.status?.message) {
      toast.error(errors.status.message);
    }
  }, [errors.batchName, errors.description, errors.status]);

  const onSubmit = async (data: BatchFormValues) => {
    if (!isAdmin) {
      toast.error("Unauthorized: only admin can update batches.");
      onOpenChange(false);
      return;
    }

    try {
      const payload = {
        batchName: data.batchName,
        startDate: data.startDate.toLocaleDateString("en-CA"),
        endDate: data.endDate.toLocaleDateString("en-CA"),
        description: data.description,
        status: data.status,
      };

      await apiClient.patch(API_ENDPOINTS.UPDATE_BATCH(batchId), payload);

      toast.success("Batch updated successfully!");
      onOpenChange(false);
      if (onBatchUpdated) onBatchUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update batch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
            {/* Batch Name */}
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input {...register("batchName")} />
              {errors.batchName && (
                <p className="text-sm text-red-600">
                  {errors.batchName.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input {...register("description")} />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status">Batch Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Batch"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
