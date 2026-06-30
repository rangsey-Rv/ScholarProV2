export function sanitizeEmailTemplate(html: string): string {
  if (!html) return html;

  // Extract all {{variableName}} patterns
  const variablePattern = /\{\{[a-zA-Z0-9_]+\}\}/g;
  const variables: string[] = [];

  let htmlWithPlaceholders = html.replace(variablePattern, (match) => {
    variables.push(match);
    return `__VAR_PLACEHOLDER_${variables.length - 1}__`;
  });

  // Apply basic HTML sanitization (remove dangerous elements/attributes)
  htmlWithPlaceholders = sanitizeHtml(htmlWithPlaceholders);

  // Restore variables
  variables.forEach((variable, index) => {
    const placeholder = `__VAR_PLACEHOLDER_${index}__`;
    htmlWithPlaceholders = htmlWithPlaceholders.replace(placeholder, variable);
  });

  return htmlWithPlaceholders;
}

/**
 * Basic HTML sanitization using regex
 * Removes script tags, event handlers, and dangerous protocols
 *
 * @param html - Raw HTML string
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return html;

  let sanitized = html;

  // Remove script tags and their content
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers (onclick, onload, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: protocol from href/src attributes
  sanitized = sanitized.replace(
    /(href|src)\s*=\s*["']?\s*javascript:/gi,
    '$1="about:blank"',
  );

  // Remove data: protocol (can contain embedded scripts)
  sanitized = sanitized.replace(
    /(href|src)\s*=\s*["']?\s*data:/gi,
    '$1="about:blank"',
  );

  // Remove vbscript: protocol
  sanitized = sanitized.replace(
    /(href|src)\s*=\s*["']?\s*vbscript:/gi,
    '$1="about:blank"',
  );

  return sanitized;
}

/**
 * Sanitizes plain text by escaping HTML entities
 * Use for user inputs like names, descriptions that should be displayed as text
 *
 * @param text - Plain text string
 * @returns Text with HTML entities escaped
 */
export function sanitizeText(text: string): string {
  if (!text) return text;

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Strips all HTML tags from a string
 * Use to convert HTML content to plain text
 *
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return html;

  return html.replace(/<[^>]*>/g, "");
}

/**
 * Validates and sanitizes URL
 * Blocks dangerous protocols like javascript:, data:, vbscript:
 *
 * @param url - URL string to validate
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];

  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${protocol}`);
      return "";
    }
  }

  return url;
}
