import { Request, Response } from "express";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { ImportApplicationService } from "@services/application/import-application.service";
import fs from "fs";
import { appLogger, auditLogger } from "@utils/logger";
import validateFileType from "@utils/validate-file-type";
import { allowedCsvMimeTypes } from "@middleware/multer";
export class ImportApplicationController {
  private applicationService: ImportApplicationService;

  constructor() {
    this.applicationService = new ImportApplicationService();
  }
  
  async previewCSV(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      const fileCheck = await validateFileType(
        req.file.path,
        allowedCsvMimeTypes
      );
      if (!fileCheck || fileCheck.success === false){
        return res.status(400).json({
          success: false,
          message: fileCheck?.msg || "Invalid file type.",
        });
      }
      const results: any[] = [];

      // Read from file path (disk storage) or buffer (memory storage)
      const stream = req.file.buffer
        ? Readable.from(req.file.buffer.toString())
        : fs.createReadStream(req.file.path);

      stream
        .pipe(csvParser())
        .on("data", (data: any) => {
          if (results.length < 10) {
            results.push(data);
          }
        })
        .on("end", () => {
          // Clean up the uploaded file if using disk storage
          if (req.file?.path) {
            try {
              fs.unlinkSync(req.file?.path);
            } catch (e) {
              // Ignore cleanup errors
            }
          }

          auditLogger.info({
            message: "CSV preview completed",
            userId: req.user?.id,
            fileName: req.file?.originalname,
            totalPreviewRows: results.length,
          });

          res.status(200).json({
            success: true,
            message: "Preview of first 10 rows",
            totalPreviewRows: results.length,
            data: results,
          });
        })
        .on("error", (error: any) => {
          // Clean up the uploaded file on error
          if (req.file?.path) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (e) {
              // Ignore cleanup errors
            }
          }
          appLogger.error({
            message: "CSV preview failed",
            userId: req.user?.id,
            fileName: req.file?.originalname,
            error: error.message,
          });

          res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    } catch (error: any) {
      // Clean up the uploaded file on error
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      appLogger.error({
        message: "CSV preview failed",
        userId: req.user?.id,
        fileName: req.file?.originalname,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Upload and import full CSV file
   */
  async uploadCSV(req: Request, res: Response) {
    const userId = req.user?.id;
    const fileName = req.file?.originalname;
    const batchId = req.body.batchId || req.query.batchId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileCheck = await validateFileType(
      req.file.path,
      allowedCsvMimeTypes
    );
    if (!fileCheck || fileCheck.success === false) {
      return res.status(400).json({
        success: false,
        message: fileCheck?.msg || "Invalid file type.",
      });
    }
    if (!batchId) {
      return res.status(400).json({
        success: false,
        message: "Batch ID is required",
      });
    }

    const batchIdNum = parseInt(batchId);
    if (isNaN(batchIdNum) || batchIdNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Batch ID. Must be a positive integer.",
      });
    }

    auditLogger.info({
      message: "CSV import started",
      userId,
      batchId: batchIdNum,
      fileName,
      fileSize: req.file.size,
    });

    try {
      const results: any[] = [];
      const stream = req.file.buffer
        ? Readable.from(req.file.buffer.toString())
        : fs.createReadStream(req.file.path);

      stream
        .pipe(csvParser())
        .on("data", (data: any) => results.push(data))
        .on("end", async () => {
          try {
            const importResult = await this.applicationService.importFromCSV(
              results,
              batchIdNum
            );

            // Clean up file if stored on disk
            if (req.file?.path) {
              try {
                fs.unlinkSync(req.file.path);
              } catch (e) {
                // something something 
              }
            }

            auditLogger.info({
              message: "CSV import completed",
              userId,
              batchId: batchIdNum,
              fileName,
              totalRows: results.length,
              successful: importResult.success,
              failed: importResult.failed,
            });
            
            res.json({
              success: importResult.failed > 0 ?false:true,
              message: "CSV import completed",
              totalRows: results.length,
              successfulImports: importResult.success,
              failedImports: importResult.failed,
              errors: importResult.errors,
              warnings: importResult.warnings,
            });
          } catch (error: any) {
            appLogger.error({
              message: "CSV import failed",
              userId,
              batchId: batchIdNum,
              fileName,
              error: error.message,
            });

            res.status(500).json({
              success: false,
              message: error.message,
              stack: process.env.NODE_ENV === "dev" ? error.stack : undefined,
            });
          }
        })
        .on("error", (error: any) => {
          if (req.file?.path) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (e) {
              /// nothing 
            }
          }

          appLogger.error({
            message: "CSV import stream failed",
            userId,
            batchId: batchIdNum,
            fileName,
            error: error.message,
          });

          res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    } catch (error: any) {
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          // nothing 
        }
      }

      appLogger.error({
        message: "CSV import failed",
        userId,
        batchId: batchIdNum,
        fileName,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
