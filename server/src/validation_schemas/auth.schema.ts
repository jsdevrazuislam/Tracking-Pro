import { z } from 'zod';

export const register_schema = z.object({
  full_name: z.string().min(3, "Name is required"),
  email: z.string().email("invalid email").transform((s) => s.toLowerCase()),
  password: z.string().min(8, "password must be at least 8 characters "),
  role: z.string().optional(),
});

export const login_schema = z.object({
  email: z.string().min(1, "Email is required").transform((s) => s.toLowerCase()),
  password: z.string().min(8, "password must be at least 8 characters "),
});