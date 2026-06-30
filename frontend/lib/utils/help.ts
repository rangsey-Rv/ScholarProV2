import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
///test
export const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const cleanedValue = value.replace(/\D/g, ""); // Remove non-digits
  const length = cleanedValue.length;

  if (length < 4) {
    return cleanedValue;
  } else if (length < 7) {
    return `${cleanedValue.slice(0, 3)} ${cleanedValue.slice(3)}`;
  } else {
    return `${cleanedValue.slice(0, 3)} ${cleanedValue.slice(3, 6)} ${cleanedValue.slice(6, 10)}`;
  }
};

export function getAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  const trimmed = path.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = process.env.NEXT_PUBLIC_API_URL as string | undefined;
  if (!base) return trimmed; // fallback to given path

  try {
    const origin = new URL(base).origin;
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${origin}${normalized}`;
  } catch {
    return trimmed;
  }
}

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File must be <= 10MB",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
    {
      message: "File must be JPG, PNG, or PDF",
    },
  );

// Return a canonical display name from different shapes of user/employee objects.
export function getDisplayName(source?: unknown): string {
  if (!source) return "-";

  try {
    // If it's a simple string
    if (typeof source === "string") {
      const trimmed = source.trim();
      return trimmed || "-";
    }

    // If it has firstNameEn / lastNameEn
    const s = source as Record<string, unknown>;
    const get = (k: string) => {
      const v = s[k];
      return v === undefined || v === null ? "" : String(v).trim();
    };

    // Prefer first name only
    const first = get("firstNameEn") || get("firstName");
    if (first) return first || "-";

    // If it has nested user object
    const userObj = s["user"];
    if (userObj && typeof userObj === "object") {
      const u = userObj as Record<string, unknown>;
      const name = (u["name"] || u["fullName"] || "").toString().trim();
      if (name) return name;
    }

    // If it has name / fullName directly, normalize and return it.
    // We preserve multi-word first names (e.g. "Mary Ann") instead of splitting on spaces.
    const direct = (s["name"] || s["fullName"] || "").toString().trim();
    let result = direct || "-";

    // Normalize whitespace and remove literal 'null'
    result = result
      .replace(/\bnull\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // Collapse exact duplicate halves like "John Doe John Doe" -> "John Doe"
    const dup = result.match(/^(.*?)\s+\1$/i);
    if (dup && dup[1]) result = dup[1].trim();

    if (result && result !== "-") return result;

    return "-";
  } catch {
    return "-";
  }
}
