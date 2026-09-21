import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .email('Invalid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),

  email: z
    .email('Invalid email address')
    .trim()
    .toLowerCase()
    .max(150, 'Email must be at most 150 characters'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),

  role: z
    .enum(['customer', 'organizer'], {
      required_error: 'Please select a role',
    }).default('customer'),
});