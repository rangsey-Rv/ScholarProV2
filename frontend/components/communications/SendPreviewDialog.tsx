"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocalApplicant } from "@/types/email.d";
import { Mail, Users } from "lucide-react";

interface SendPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  subject: string;
  recipients: LocalApplicant[];
  totalCount: number;
  onConfirm: () => void;
  isSending: boolean;
}

const capitalizeStatus = (status: string): string => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function SendPreviewDialog({
  open,
  onOpenChange,
  templateName,
  subject,
  recipients,
  onConfirm,
  isSending,
}: SendPreviewDialogProps) {
  const previewRecipients = recipients.slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Email Send</DialogTitle>
          <DialogDescription>
            Review the email details before sending to all recipients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Template: {templateName}</p>
                <p className="text-sm text-muted-foreground">
                  Subject: {subject}
                </p>
              </div>
            </div>
          </div>

          {/* Recipients Count */}
          <div className="p-4 border rounded-lg bg-primary/5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Emails will be sent to all matching recipients
                </p>
              </div>
            </div>
          </div>

          {/* Preview Recipients */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview Recipients:</p>
            <ScrollArea className="h-[200px] border rounded-lg p-3">
              <div className="space-y-2">
                {previewRecipients.map((recipient, index) => (
                  <div
                    key={`preview-${recipient.id}-${index}`}
                    className="p-2 border rounded bg-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {recipient.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {recipient.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {capitalizeStatus(recipient.status)}
                        </span>
                        {recipient.scholarshipPercentage && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            {recipient.scholarshipPercentage}% Scholarship
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="text-white"
            onClick={onConfirm}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
