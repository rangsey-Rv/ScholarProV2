import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir =
  process.env.UPLOAD_DIR || path.join(__dirname, "../public/image");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const filename = `${originalName}_${timestamp}${extension}`;
    cb(null, filename);
  },
});


export const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
export const allowedCsvMimeTypes = [
  "text/csv",
  "text/plain",
  "application/vnd.ms-excel",
];

// Multer for images
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      allowedImageMimeTypes.includes(file.mimetype) ||
      file.originalname.endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Multer for CSV import
export const importFile = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      allowedCsvMimeTypes.includes(file.mimetype) ||
      file.originalname.endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Multer for student registration documents (images + PDFs)
export const uploadStudentDocuments = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedStudentDocMimes = [
      ...allowedImageMimeTypes,
      "application/pdf",
    ];
    if (allowedStudentDocMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files and PDFs are allowed for student documents"));
    }
  },
});


