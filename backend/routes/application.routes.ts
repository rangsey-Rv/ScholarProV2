import express from "express";
import { ImportApplicationController , GetApplicants, ExportApplicationController, ExportApplicationToCSVController } from "@controllers/application";
import { ViewApplicationDetailController } from "@controllers/application/view-application-detail.controller";
import { asyncHandler } from "@utils/async-handler";
import { importFile} from "@middleware/multer";
import { authorizeRole } from "@middleware/authorize-role";
import { authenticateUser  } from "@middleware/authenticate-user";
import {ApplicationController} from "@controllers/application/update-application-status.controller";
import countAvailableApplicantController from "@controllers/application/count-available-applicant.controller";
const router = express.Router();

const importController = new ImportApplicationController();
const viewDetailController = new ViewApplicationDetailController();
const exportController = new ExportApplicationController();
const exportCSVController = new ExportApplicationToCSVController();
const applicationController = new ApplicationController();

// Export routes (must be before dynamic routes)
router.get('/export',authenticateUser, authorizeRole("admin"), asyncHandler(exportController.exportApplications.bind(exportController)));
router.get('/export/csv', authenticateUser, authorizeRole("admin"), asyncHandler(exportCSVController.exportToCSV.bind(exportCSVController)));
router.get("/available/:batchId", authenticateUser, authorizeRole("admin"), asyncHandler(countAvailableApplicantController));
// Update application status
router.patch("/:id", authenticateUser, authorizeRole("admin"), applicationController.update.bind(applicationController));
// Get all applications (list view)
router.get('/', authenticateUser, authorizeRole("admin", "committee"), GetApplicants);

// Get single application detail (must be after /applicants to avoid route conflict)
router.get('/:id', authenticateUser, authorizeRole("admin", "committee"),  asyncHandler(viewDetailController.getApplicationDetail.bind(viewDetailController)));



// CSV routes router.post('/preview',authenticateUser, authorizeRole("admin"), upload.single('file'), importController.previewCSV.bind(importController));
router.post('/preview', authenticateUser, authorizeRole("admin"), importFile.single('file'), importController.previewCSV.bind(importController)); 
router.post('/import', authenticateUser, authorizeRole("admin"), importFile.single('file'), importController.uploadCSV.bind(importController));



export default router;