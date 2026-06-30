"use client";

import React, { Suspense, useState, useEffect } from "react";
import { toast } from "sonner";
import { useHeader } from "@/components/header/header-context";
import { emailService, type Batch } from "@/api/service/email.service";
import { LocalApplicant } from "@/types/email.d";
import { FilterPanel } from "@/components/communications/FilterPanel";
import { RecipientList } from "@/components/communications/RecipientList";
import { EmailComposer } from "@/components/communications/EmailComposer";
import { SendPreviewDialog } from "@/components/communications/SendPreviewDialog";
import { EMAIL_VARIABLES } from "@/constants/email-variables";

function CommunicationsPageContent() {
  const { setTitle } = useHeader();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  // Recipient group removed; rely on explicit filters only
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedScholarshipPercentage, setSelectedScholarshipPercentage] =
    useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isBatchesLoading, setIsBatchesLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [applicants, setApplicants] = useState<LocalApplicant[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Recipient group mapping removed; using explicit filters only

  // Set page title
  useEffect(() => {
    setTitle("Send Email");
  }, [setTitle]);

  // Manual search trigger based on filters (Option A)
  const handleSearchRecipients = async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch first");
      return;
    }
    const batchNum = parseInt(selectedBatchId, 10);
    if (Number.isNaN(batchNum) || batchNum <= 0) {
      toast.error("Invalid batch selected");
      return;
    }

    try {
      setIsLoadingApplicants(true);
      setSearchError("");
      setHasSearched(false);

      // Use explicit Status + Scholarship filters from UI only
      const status = (selectedStatus || "").trim();
      const scholarshipPercentage =
        selectedScholarshipPercentage !== null &&
        selectedScholarshipPercentage !== undefined
          ? selectedScholarshipPercentage
          : undefined;

      const recipientsResponse = await emailService.listRecipients(
        batchNum,
        status || undefined,
        scholarshipPercentage || undefined,
        selectedMajor || undefined,
      );

      if (recipientsResponse.success && recipientsResponse.data) {
        const mappedApplicants = recipientsResponse.data
          .map((recipient, index) => {
            const rawId =
              recipient.id || recipient.applicationId || recipient.applicantId;
            const numericId = Number(rawId);

            const emailStr = String(recipient.email || "");
            const fallbackId = emailStr
              ? Math.abs(
                  emailStr
                    .split("")
                    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0),
                )
              : Date.now() + index;

            const finalId =
              !isNaN(numericId) && numericId > 0 ? numericId : fallbackId;

            const appName =
              recipient.applicantName?.trim() ||
              recipient.applicationName?.trim();
            const nameEn = recipient.nameEn?.trim();
            const name = recipient.name?.trim();
            const displayName = appName || nameEn || name || "Unknown";

            return {
              id: finalId,
              nameEn: displayName,
              email: recipient.email,
              status: recipient.status || "unknown",
              batchId: recipient.batchId?.toString(),
              batchName: recipient.batchName,
              scholarshipPercentage: recipient.scholarshipPercentage,
              major: recipient.major,
              gender: recipient.gender,
            } as LocalApplicant;
          })
          .filter((applicant) => !!applicant.email);

        setApplicants(mappedApplicants);
        setHasSearched(true);

        if (mappedApplicants.length === 0) {
          toast.info("No recipients found matching the selected filters");
        } else {
          toast.success(
            `Found ${mappedApplicants.length} recipient${mappedApplicants.length > 1 ? "s" : ""}`,
          );
        }
      }
    } catch (error: unknown) {
      console.error("Error searching recipients:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 404) {
          setSearchError(
            "Recipients endpoint not found. Please contact support.",
          );
        } else if (axiosError.response?.status === 400) {
          setSearchError(
            axiosError.response.data?.message || "Invalid search parameters",
          );
        } else {
          setSearchError("Failed to load recipients. Please try again.");
        }
      } else {
        setSearchError("Network error. Please check your connection.");
      }
      setApplicants([]);
      setHasSearched(true);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  // Load batches on mount
  useEffect(() => {
    const loadBatches = async () => {
      try {
        setIsBatchesLoading(true);
        const batches = await emailService.listBatches();
        setBatches(batches);
      } catch (error) {
        console.error("Error loading batches:", error);
        toast.error("Failed to load batches");
      } finally {
        setIsBatchesLoading(false);
      }
    };

    loadBatches();
  }, []);

  // Load template names on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        const names = await emailService.listTemplates();
        setTemplateNames(names);
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Failed to load templates");
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, []);

  // The applicants list is the current search result
  const filteredApplicants = applicants;

  // Validate template variables
  const validateTemplateVariables = (htmlContent: string) => {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = htmlContent.matchAll(variableRegex);
    const usedVariables = Array.from(matches, (m) => m[1]);
    const availableVariables = EMAIL_VARIABLES.map((v) => v.key);
    const unavailableVariables = usedVariables.filter(
      (v) => !availableVariables.includes(v),
    );

    if (unavailableVariables.length > 0) {
      const uniqueUnavailable = [...new Set(unavailableVariables)];
      toast.warning(
        `Template uses unavailable variables: ${uniqueUnavailable.join(", ")}`,
        {
          description:
            "These variables may not be replaced correctly when sending emails.",
        },
      );
    }
  };

  // Handle template selection
  const handleTemplateChange = async (templateName: string) => {
    setSelectedTemplateId(templateName);

    try {
      setIsLoadingTemplate(true);
      const template = await emailService.getTemplate(templateName);
      setSubject(template.subject);
      setContent(template.html);

      // Validate variables in template
      validateTemplateVariables(template.html);
    } catch (error) {
      console.error("Error loading template:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load template";
      toast.error(errorMessage);
      // Clear content on error
      setSubject("");
      setContent("");
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  // Handle send email button click - show preview dialog
  const handleSendEmailClick = () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }

    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }

    if (filteredApplicants.length === 0) {
      toast.error("No recipients match the selected filters");
      return;
    }

    setShowPreview(true);
  };

  // Handle confirmed send from preview dialog
  const handleConfirmSend = async () => {
    try {
      setIsSending(true);

      await emailService.bulkSend(
        selectedTemplateId,
        parseInt(selectedBatchId),
        selectedStatus || undefined,
        selectedScholarshipPercentage || undefined,
        selectedMajor || undefined,
      );

      toast.success(`Email sent successfully!`);
      setShowPreview(false);
    } catch (error: unknown) {
      console.error("Error sending email:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send email";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // Handler functions for child components
  const handleBatchChange = (batchName: string, batchId: string) => {
    setSelectedBatch(batchName);
    setSelectedBatchId(batchId);
    setHasSearched(false);
    setSearchError("");
  };

  // Recipient group handler removed

  const handleMajorChange = (major: string) => {
    setSelectedMajor(major);
    setHasSearched(false);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <FilterPanel
        selectedBatch={selectedBatch}
        selectedBatchId={selectedBatchId}
        selectedMajor={selectedMajor}
        selectedStatus={selectedStatus}
        selectedScholarshipPercentage={selectedScholarshipPercentage}
        batches={batches}
        isBatchesLoading={isBatchesLoading}
        isSearching={isLoadingApplicants}
        onBatchChange={handleBatchChange}
        onMajorChange={handleMajorChange}
        onStatusChange={setSelectedStatus}
        onScholarshipChange={setSelectedScholarshipPercentage}
        onSearchClick={handleSearchRecipients}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <RecipientList
            applicants={filteredApplicants}
            isLoadingApplicants={isLoadingApplicants}
            selectedBatch={selectedBatch}
            hasSearched={hasSearched}
            searchError={searchError}
          />
        </div>

        <div className="lg:col-span-1">
          <EmailComposer
            selectedTemplateId={selectedTemplateId}
            templateNames={templateNames}
            subject={subject}
            content={content}
            isLoadingTemplates={isLoadingTemplates}
            isLoadingTemplate={isLoadingTemplate}
            isSending={isSending}
            recipientCount={filteredApplicants.length}
            canSend={
              filteredApplicants.length > 0 &&
              !!selectedTemplateId &&
              !!selectedBatchId
            }
            onTemplateChange={handleTemplateChange}
            onSendEmail={handleSendEmailClick}
          />
        </div>
      </div>

      <SendPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        templateName={selectedTemplateId}
        subject={subject}
        recipients={filteredApplicants}
        totalCount={filteredApplicants.length}
        onConfirm={handleConfirmSend}
        isSending={isSending}
      />
    </div>
  );
}

export default function CommunicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <CommunicationsPageContent />
    </Suspense>
  );
}
