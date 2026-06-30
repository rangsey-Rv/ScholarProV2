import { Request, Response } from "express";
import { BakongPayService } from "../services/bakong-pay.service";
import { db } from "../db"; 
import { transactions } from "../db/schema/transaction";
import { applications } from "../db/schema/application";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/app-error";

export class PaymentController {
  
  // Initiate Payment
  async initiatePayment(req: Request, res: Response) {
    const { applicationId } = req.body;

    if (!applicationId) {
      throw new AppError("Application ID is required", 400);
    }

    // Check if application exists
    const [application] = await db.select().from(applications).where(eq(applications.id, applicationId)).limit(1);

    if (!application) {
        throw new AppError("Application not found", 404);
    }
    
    if (application.paymentStatus === "completed") {
        throw new AppError("Application is already paid", 400);
    }

    // Define amount (e.g. $10.00 Application Fee)
    const amount = 0.5 ; 
    const currency = "USD";
    const description = `Application Fee for App ID: ${applicationId}`;

    // Generate KHQR
    const { khqr, md5 } = BakongPayService.generateKHQR(amount, currency, description);

    // Generate Deeplink
    const deeplink = await BakongPayService.generateDeeplink(khqr);

    // Save Transaction
    const [newTransaction] = await db.insert(transactions).values({
        applicationId: applicationId,
        khqrString: khqr,
        md5Hash: md5,
        deeplink: deeplink,
        amount: amount.toString(),
        currency: currency,
        status: "PENDING"
    }).returning();

    res.status(200).json({
        status: "success",
        data: {
            transactionId: newTransaction.id,
            khqrString: khqr,
            md5Hash: md5,
            deeplink: deeplink,
            amount: amount,
            currency: currency
        }
    });
  }

  // Check Status
  async checkStatus(req: Request, res: Response) {
      const { md5 } = req.params;

      if (!md5) {
          throw new AppError("MD5 Hash is required", 400);
      }

      // Check local DB first
      const [transaction] = await db.select().from(transactions).where(eq(transactions.md5Hash, md5)).limit(1);

      if (!transaction) {
          throw new AppError("Transaction not found", 404);
      }

      if (transaction.status === "SUCCESS") {
          return res.status(200).json({ status: "SUCCESS" });
      }

      // Call Bakong API
      const status = await BakongPayService.checkTransactionStatus(md5);

      if (status === "SUCCESS") {
          // Update Transaction
          await db.update(transactions)
            .set({ status: "SUCCESS" })
            .where(eq(transactions.id, transaction.id));
          
          // Update Application - Set payment to completed AND status to submitted
          await db.update(applications)
            .set({ 
                paymentStatus: "completed",
                status: "submitted" // Automatically submit application after payment
            })
            .where(eq(applications.id, transaction.applicationId));
      } else if (status === "FAILED") {
          await db.update(transactions)
            .set({ status: "FAILED" })
            .where(eq(transactions.id, transaction.id));
      }

      res.status(200).json({ status: status });
  }
}
