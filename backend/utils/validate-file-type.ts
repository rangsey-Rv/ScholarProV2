import { fileTypeFromFile } from "file-type";

const validateFileType = async (
  filePath: string,
  allowedMimeTypes: string[]
) => {
  const type = await fileTypeFromFile(filePath);
  
  if (type) {
    if (!allowedMimeTypes.includes(type.mime)) {
      return {
        success: false,
        msg: `Invalid file type detected: ${type.mime}`,
      };
    }
    return { success: true };
  }

  const expectsTextFiles = allowedMimeTypes.some(
    (mime) => mime.startsWith("text/") || mime === "application/vnd.ms-excel"
  );

  if (expectsTextFiles) {
    return { success: true };
  }

  return {
    success: false,
    msg: "Unable to determine file type",
  };
};

export default validateFileType;
