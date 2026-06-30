import { z } from "zod";

export const InviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});
