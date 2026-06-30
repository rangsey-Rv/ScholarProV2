"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Mail, User } from "lucide-react";
import { useState } from "react";
import { substituteEmailVariables } from "@/lib/utils/email-variables";
import { sanitizeEmailTemplate } from "@/lib/utils/sanitize";
import type { EmailVariableData } from "@/types/email";

interface EmailPreviewListProps {
  recipients: (Partial<EmailVariableData> & { batchName?: string })[];
  templateContent: string;
  subject: string;
}

export function EmailPreviewList({
  recipients,
  templateContent,
  subject,
}: EmailPreviewListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (recipients.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recipients Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a recipient group to preview emails
          </p>
        </div>
      </Card>
    );
  }

  const currentRecipient = recipients[selectedIndex];

  // Substitute variables using universal engine
  const previewContent = substituteEmailVariables(
    templateContent,
    currentRecipient,
  );
  const previewSubject = substituteEmailVariables(subject, currentRecipient);

  const handlePrevious = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(recipients.length - 1, prev + 1));
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Email Preview</h3>
          <Badge variant="secondary">
            {selectedIndex + 1} of {recipients.length}
          </Badge>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={selectedIndex === recipients.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recipient Info */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {currentRecipient.applicantName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {currentRecipient.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Batch: {currentRecipient.batchName}
            </p>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Subject:</p>
            <p className="font-semibold">{previewSubject}</p>
          </div>

          <Separator />

          {/* Content */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitizeEmailTemplate(previewContent),
            }}
          />
        </div>
      </ScrollArea>

      {/* Recipient List */}
      <div className="border-t">
        <ScrollArea className="h-48">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
              All Recipients
            </p>
            <div className="space-y-1">
              {recipients.map((recipient, index) => (
                <button
                  key={recipient.applicationId || index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                >
                  <p className="font-medium truncate">
                    {recipient.applicantName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {recipient.email}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
