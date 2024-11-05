import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password must be at least 1 characters")
    .max(32, "Password must be less than 32 characters"),
});
