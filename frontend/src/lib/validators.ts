import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().min(5, "Enter your house or street address"),
  area: z.string().min(2, "Enter your locality or area"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Select your state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[0-9]/, "Include one number"),
    confirmPassword: z.string(),
    address: addressSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const complaintSchema = z.object({
  categoryId: z.string().min(1, "Select a complaint category"),
  title: z.string().min(8, "Give the issue a short title"),
  description: z.string().min(20, "Describe the problem in at least 20 characters"),
  landmark: z.string().optional(),
  useRegisteredAddress: z.boolean(),
  address: addressSchema,
});

export const profileSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  address: addressSchema,
});

export const registerApiSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include one uppercase letter")
    .regex(/[0-9]/, "Include one number"),
  address: addressSchema,
});

export const sendVerificationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(1).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit token").optional(),
    token: z.string().min(16, "Invalid reset link").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[0-9]/, "Include one number"),
    confirmPassword: z.string(),
  })
  .refine((value) => Boolean(value.otp || value.token), {
    message: "Enter the email token or use the reset link",
    path: ["otp"],
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit token").optional(),
    token: z.string().min(16, "Invalid verification link").optional(),
  })
  .refine((value) => Boolean(value.otp || value.token), {
    message: "Enter the email token or use the verification link",
    path: ["otp"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ComplaintValues = z.infer<typeof complaintSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
