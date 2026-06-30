export const validateGoogleDriveUrl = (
  url: string,
  fieldName: string
): void => {
  if (!url || url.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  const trimmedUrl = url.trim();

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch (error) {
    throw new Error(`${fieldName} is not a valid URL: '${url}'`);
  }

  // Check HTTPS
  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      `${fieldName} must use HTTPS protocol. Got: ${parsedUrl.protocol}`
    );
  }

  // Allowed Google Drive domains
  const allowedDomains = [
    "drive.google.com",
    "docs.google.com",
    "www.googleapis.com",
  ];

  const hostname = parsedUrl.hostname.toLowerCase();

  const isAllowed = allowedDomains.some((domain) => hostname === domain);

  if (!isAllowed) {
    throw new Error(
      `${fieldName} must be from Google Drive. Allowed domains: ${allowedDomains.join(
        ", "
      )}. Got: ${hostname}`
    );
  }

  const isValidPattern =
    parsedUrl.href.includes("/file/d/") ||
    parsedUrl.href.includes("/uc?") ||
    parsedUrl.href.includes("/document/d/") ||
    parsedUrl.href.includes("/spreadsheets/d/") ||
    parsedUrl.href.includes("/presentation/d/") ||
    parsedUrl.href.includes("googleapis.com/drive/");

  if (!isValidPattern) {
    throw new Error(
      `${fieldName} does not match expected Google Drive URL pattern: '${url}'`
    );
  }
};
