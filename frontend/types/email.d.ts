// Local Applicant interface for communications
export interface LocalApplicant {
  id: number;
  nameEn: string;
  email: string;
  status: string;
  batchId?: string;
  batchName?: string;
  scholarshipPercentage?: number;
  major?: string;
  gender?: string;
}

// Email variable substitution data structure
export type EmailVariableData = {
  applicationId: number;
  applicantName: string;
  name?: string; // Added: alias for applicantName
  gender: string;
  email: string;
  status: string;
  scholarshipPercentage: number | null;
  major: string;
  batchName?: string; // Added: batch name for display
  tuitionFee?: string; // Added: tuition fee for display
  mathExamDate: Date | string | null;
  mathStartTime: Date | string | null;
  mathEndTime: Date | string | null;
  mathRoom: string | null;
  englishExamDate: Date | string | null;
  englishStartTime: Date | string | null;
  englishEndTime: Date | string | null;
  englishRoom: string | null;
  interviewExamDate: Date | string | null;
  interviewStartTime: Date | string | null;
  interviewEndTime: Date | string | null;
  interviewRoom: string | null;
  interviewSlotStart: Date | string | null;
  interviewSlotEnd: Date | string | null;
};

// API Request/Response Types

// Create Email Template - POST /email
export type CreateEmailTemplateRequest = {
  templateName: string;
  subject: string;
  html: string;
};

// Update Email Template - PUT /email/{name}
export type UpdateEmailTemplateRequest = {
  subject: string;
  html: string;
};

// List Email Templates - GET /email/template-name
export type EmailTemplateListItem = {
  TemplateName: string;
  CreatedTimestamp: string;
};

export type ListEmailTemplatesResponse = {
  success: boolean;
  data: EmailTemplateListItem[];
};

// Delete Email Template - DELETE /email/{name}
export type DeleteEmailTemplateResponse = {
  success: boolean;
  message: string;
};

// Preview Email Template - GET /email/{name}
export type EmailTemplateContent = {
  Subject: string;
  Text: string;
  Html: string;
};

export type PreviewEmailTemplateResponse = {
  success: boolean;
  message: {
    TemplateName: string;
    TemplateContent: EmailTemplateContent;
  };
};

// Bulk Email Send Request
export type BulkEmailSendRequest = {
  applicationIds: number[];
};

// Frontend Email Template Interface (matches service layer)
export type EmailTemplate = {
  name: string;
  subject: string;
  html: string; // Uses 'html' to match backend API contract
};

// Variable definition for TipTap editor
export interface VariableDefinition {
  id: string;
  label: string;
  description?: string;
  key: string; // Added: the variable key
  display: string; // Added: display text
  example?: string; // Added: example value
  category?: string; // Added: category for grouping
}

// Email substitution type for schedule mapper
export interface EmailVariableSubstitution {
  recipient?: {
    name?: string;
    email?: string;
    [key: string]: string | number | Date | null | undefined;
  };
  system?: {
    current_date?: string;
    [key: string]: string | number | Date | null | undefined;
  };
  context?: {
    exam?: {
      [key: string]: string | number | Date | null | undefined;
    };
    interview?: {
      [key: string]: string | number | Date | null | undefined;
    };
    [key: string]: string | number | Date | null | undefined | object;
  };
  [key: string]: string | number | Date | null | undefined | object;
}
