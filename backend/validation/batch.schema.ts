import { z } from "zod";

export const createBatchSchema = z.object({
    batchName: z.string().min(1, { message: "Batch name is required" }),
    startDate: z.coerce.date({ message: "Valid start date is required" }),
    endDate: z.coerce.date({ message: "Valid end date is required" }),
    description: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const updateBatchSchema = z.object({
    batchName: z.string().min(1, { message: "Batch name is required" }).optional(),
    startDate: z.coerce.date({ message: "Valid start date is required" }).optional(),
    endDate: z.coerce.date({ message: "Valid end date is required" }).optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'complete', 'cancelled', 'closed']).optional(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const batchIdSchema = z.object({
    id: z.coerce.number().int({ message: "Batch ID must be an integer" }).positive({ message: "Batch ID must be positive" }),
});