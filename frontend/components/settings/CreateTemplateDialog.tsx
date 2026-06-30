"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import {
  emailTemplateSchema,
  type EmailTemplateFormValues,
} from "@/lib/schema/email-template-schema";
import { emailService } from "@/api/service/email.service";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreated: (templateName: string) => void;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
  onTemplateCreated,
}: CreateTemplateDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      templateName: "",
      subject: "",
      html: "<p>Start writing your email template here...</p>",
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: EmailTemplateFormValues) => {
    try {
      await emailService.createTemplate(data);

      toast.success("Template created successfully");
      onTemplateCreated(data.templateName);
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Error creating template:", error);

      // Type-safe error handling
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 409) {
          toast.error("A template with this name already exists");
        } else {
          toast.error(
            axiosError.response?.data?.message || "Failed to create template",
          );
        }
      } else {
        toast.error("Failed to create template");
      }
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a custom email template. Use {"{{variableName}}"} format for
            dynamic content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="templateName"
                placeholder="e.g., exam_notification"
                {...register("templateName")}
                className={errors.templateName ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.templateName && (
                <p className="text-sm text-red-500">
                  {errors.templateName.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, underscores, or hyphens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Welcome to ScholarPro"
                {...register("subject")}
                className={errors.subject ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="html">
                Email Content <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="html"
                placeholder="Enter HTML content or use TipTap editor after creation"
                {...register("html")}
                className={`flex min-h-[100px] w-full rounded-md border ${errors.html ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isSubmitting}
                rows={4}
              />
              {errors.html && (
                <p className="text-sm text-red-500">{errors.html.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                You can edit with the rich text editor after creating the
                template
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0F386C] hover:bg-[#0c2d56] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Template"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
