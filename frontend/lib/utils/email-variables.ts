/**
 * Email variable substitution and validation utilities
 * Handles {{variableName}} format matching TipTap editor output
 */

import { EMAIL_VARIABLES } from "@/constants/email-variables";
import type { EmailVariableData } from "@/types/email";

/**
 * List of allowed variable names for validation
 */
const ALLOWED_VARIABLES = [
  "applicantName",
  "gender",
  "email",
  "status",
  "scholarshipPercentage",
  "major",
  "tuitionFee",
  "mathExamDate",
  "mathStartTime",
  "mathEndTime",
  "mathRoom",
  "englishExamDate",
  "englishStartTime",
  "englishEndTime",
  "englishRoom",
  "interviewExamDate",
  "interviewStartTime",
  "interviewEndTime",
  "interviewRoom",
  "interviewSlotStart",
  "interviewSlotEnd",
];

/**
 * Map of variable keys to display names for placeholder fallback
 */
const VARIABLE_DISPLAY_MAP: Record<string, string> = EMAIL_VARIABLES.reduce(
  (acc, variable) => {
    acc[variable.key] = variable.display;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Substitutes email template variables with actual data
 * Uses {{variableName}} format matching TipTap editor output
 * Missing values are replaced with [Variable Name] placeholders for visibility
 *
 * @param template - Email template HTML with {{variables}}
 * @param data - Partial data object with variable values
 * @returns HTML with variables substituted
 *
 * @example
 * substituteEmailVariables(
 *   'Hello {{applicantName}}, scholarship: {{scholarshipPercentage}}%',
 *   { applicantName: 'Bopha Chea', scholarshipPercentage: 75 }
 * )
 * // Returns: 'Hello Bopha Chea, scholarship: 75%'
 *
 * @example
 * // Missing data shows placeholder
 * substituteEmailVariables('Hello {{applicantName}}', {})
 * // Returns: 'Hello [Applicant Name]'
 */
export function substituteEmailVariables(
  template: string,
  data: Partial<EmailVariableData>,
): string {
  if (!template) return template;

  let result = template;

  // Substitute each allowed variable
  ALLOWED_VARIABLES.forEach((variableKey) => {
    const pattern = new RegExp(`\\{\\{${variableKey}\\}\\}`, "g");
    const value = data[variableKey as keyof EmailVariableData];

    // If value exists, use it; otherwise show placeholder
    let displayValue: string;
    if (value !== null && value !== undefined && value !== "") {
      displayValue = String(value);
    } else {
      // Show placeholder for missing data
      const displayName = VARIABLE_DISPLAY_MAP[variableKey] || variableKey;
      displayValue = `[${displayName}]`;
    }

    result = result.replace(pattern, displayValue);
  });

  return result;
}

/**
 * Validates template variables against allowed list
 * Logs warnings to console for unknown variables
 *
 * @param html - Email template HTML
 * @returns Validation result with list of unknown variables
 *
 * @example
 * const result = validateTemplateVariables('Hello {{applicantNam}}')
 * // Console: "Warning: Unknown template variable: applicantNam"
 * // Returns: { valid: false, unknownVariables: ['applicantNam'] }
 */
export function validateTemplateVariables(html: string): {
  valid: boolean;
  unknownVariables: string[];
} {
  if (!html) {
    return { valid: true, unknownVariables: [] };
  }

  // Extract all {{variableName}} patterns
  const variablePattern = /\{\{([a-zA-Z0-9_]+)\}\}/g;
  const matches = html.matchAll(variablePattern);

  const usedVariables = new Set<string>();
  for (const match of matches) {
    usedVariables.add(match[1]);
  }

  // Find variables not in allowed list
  const unknownVariables = Array.from(usedVariables).filter(
    (variable) => !ALLOWED_VARIABLES.includes(variable),
  );

  // Log warnings for unknown variables
  if (unknownVariables.length > 0) {
    unknownVariables.forEach((variable) => {
      console.warn(`Warning: Unknown template variable: ${variable}`);
    });
  }

  return {
    valid: unknownVariables.length === 0,
    unknownVariables,
  };
}

/**
 * Extracts all variable keys used in a template
 *
 * @param html - Email template HTML
 * @returns Array of variable keys found in template
 *
 * @example
 * extractTemplateVariables('Hello {{applicantName}}, {{email}}')
 * // Returns: ['applicantName', 'email']
 */
export function extractTemplateVariables(html: string): string[] {
  if (!html) return [];

  const variablePattern = /\{\{([a-zA-Z0-9_]+)\}\}/g;
  const matches = html.matchAll(variablePattern);

  const variables = new Set<string>();
  for (const match of matches) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * Checks if a template contains any variables
 *
 * @param html - Email template HTML
 * @returns True if template contains {{variables}}
 */
export function hasVariables(html: string): boolean {
  if (!html) return false;
  return /\{\{[a-zA-Z0-9_]+\}\}/.test(html);
}

/**
 * Gets display name for a variable key
 *
 * @param key - Variable key (e.g., 'applicantName')
 * @returns Display name (e.g., 'Applicant Name')
 */
export function getVariableDisplayName(key: string): string {
  return VARIABLE_DISPLAY_MAP[key] || key;
}
