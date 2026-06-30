import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes a string by replacing HTML angle brackets with their entities.
 * This prevents the string from being interpreted as HTML.
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


