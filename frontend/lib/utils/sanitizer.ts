import DOMPurify from "dompurify";

const sanitizeHtml = (value: string) =>
  DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [], // ❗ No HTML allowed
    ALLOWED_ATTR: [], // ❗ No attributes allowed
  });
export { sanitizeHtml };
