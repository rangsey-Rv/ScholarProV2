import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticateUser } from "../middleware/authenticate-user";

const router = express.Router();
const paymentController = new PaymentController();

// Initiate Payment (Requires Authentication)
router.post(
  "/initiate",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    await paymentController.initiatePayment(req, res);
  })
);

// Check Payment Status (Public or Authenticated - depending on requirements)
// Making it public for polling without auth header if needed, but safer with auth.
// Given the context, the user is likely logged in app to poll.
router.get(
  "/:md5/status",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    await paymentController.checkStatus(req, res);
  })
);

export default router;
