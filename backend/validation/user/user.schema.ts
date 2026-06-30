import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phoneNumber: z.string().regex(/^\+?[0-9]{8,15}$/, "Invalid phone number format").optional(),
    departmentId: z.coerce.number().int().positive("Department ID must be a positive integer").optional(),
    profileUrl: z.string().optional(), 
});