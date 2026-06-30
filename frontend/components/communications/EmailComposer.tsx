"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { EmailComposerSkeleton } from "@/components/communications/EmailSkeletons";
import { sanitizeEmailTemplate } from "@/lib/utils/sanitize";

interface EmailComposerProps {
  selectedTemplateId: string;
  templateNames: string[];
  subject: string;
  content: string;
  isLoadingTemplates: boolean;
  isLoadingTemplate: boolean;
  isSending: boolean;
  recipientCount: number;
  canSend: boolean;
  onTemplateChange: (templateName: string) => void;
  onSendEmail: () => void;
}

export function EmailComposer({
  selectedTemplateId,
  templateNames,
  subject,
  content,
  isLoadingTemplates,
  isLoadingTemplate,
  isSending,
  canSend,
  onTemplateChange,
  onSendEmail,
}: EmailComposerProps) {
  // Show full skeleton if templates are loading on initial render
  if (isLoadingTemplates && templateNames.length === 0) {
    return <EmailComposerSkeleton />;
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Compose</h3>

        {/* Template Selector */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium">
            Template <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedTemplateId}
            onValueChange={onTemplateChange}
            disabled={isLoadingTemplates}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingTemplates ? "Loading..." : "Select template"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {templateNames.length === 0 ? (
                <SelectItem value="_empty" disabled>
                  No templates
                </SelectItem>
              ) : (
                templateNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Subject (Read-only) */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium">Subject</label>
          <Input
            value={subject}
            readOnly
            placeholder="Subject appears here"
            className="bg-muted/30"
          />
        </div>

        {/* Content Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Preview</label>
          {isLoadingTemplate ? (
            <div className="h-[100vh] border rounded-md p-6 flex items-center justify-center bg-muted/30">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-md p-3 max-h-96 overflow-y-auto bg-muted/30">
              {content ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeEmailTemplate(content),
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Select a template
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Send Button */}
      <Button
        onClick={onSendEmail}
        disabled={!canSend || isSending}
        className="w-full bg-[#0F386C] hover:bg-[#0c2d56] text-white"
        size="lg"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending Emails...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </>
        )}
      </Button>
    </Card>
  );
}
