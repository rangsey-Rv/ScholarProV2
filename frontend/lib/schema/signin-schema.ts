import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email").nonempty({ message: "Email is required" }),

  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be more than 8 characters" })
    .max(64, { message: "Password must be less than 64 characters" })
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character"),
});

export type SignInSchemaProps = z.infer<typeof signInSchema>;
