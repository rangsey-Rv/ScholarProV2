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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import {
  createBatchSchema,
  type BatchFormValues,
} from "@/lib/schema/create-batch-schema";
import { toast } from "sonner";
import { useRole } from "@/lib/context/auth-context";

interface CreateBatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchCreated?: (batchId: string) => void;
}

export function NewBatch({
  open,
  onOpenChange,
  onBatchCreated,
}: CreateBatchModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    mode: "onChange",
    defaultValues: {
      batchName: "",
      description: "",
    },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const { isAdmin } = useRole();

  // Optional: also alert user via toast when XSS-related errors occur
  React.useEffect(() => {
    if (errors.batchName?.message) {
      toast.error(errors.batchName.message);
    }
    if (errors.description?.message) {
      toast.error(errors.description.message);
    }
  }, [errors.batchName, errors.description]);

  const onSubmit = async (data: BatchFormValues) => {
    if (!isAdmin) {
      toast.error("Unauthorized: only admin can create batches.");
      onOpenChange(false);
      return;
    }
    try {
      const payload = {
        batchName: data.batchName,
        startDate: data.startDate.toLocaleDateString("en-CA"),
        endDate: data.endDate.toLocaleDateString("en-CA"),
        description: data.description,
      };

      const res = await apiClient.post(API_ENDPOINTS.BATCH, payload);

      const createdBatchId = res?.data?.data?.id || res?.data?.id;
      if (onBatchCreated) onBatchCreated(createdBatchId);

      toast.success("Batch created successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create batch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
          {/* Batch Name */}
          <div className="space-y-2">
            <Label>Batch Name</Label>
            <Input {...register("batchName")} />
            {errors.batchName && (
              <p className="text-sm text-red-600">{errors.batchName.message}</p>
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
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Select date"}
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
              <p className="text-sm text-red-600">{errors.startDate.message}</p>
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
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Select date"}
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

          <Button type="submit" className="w-full text-white">
            Create Batch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
