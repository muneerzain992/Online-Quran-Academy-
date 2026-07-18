import { z } from "zod";

/** Letters from any language (Unicode), plus spaces / hyphen / apostrophe. */
const NAME_PATTERN = /^[\p{L}\p{M}](?:[\p{L}\p{M}\s'-]*[\p{L}\p{M}])?$/u;

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 letters")
  .max(80, "Name is too long")
  .regex(
    NAME_PATTERN,
    "Names can only contain letters (any language), spaces, hyphens, or apostrophes",
  );

export const emailSchema = z
  .string()
  .trim()
  .min(3, "Enter your email")
  .refine((v) => v.includes("@"), {
    message: "Email must include @",
  })
  .email("Enter a valid email address")
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Enter a complete email (e.g. name@gmail.com)",
  });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^A-Za-z0-9\s]/, "Include at least one special character (!@#$%…)");

/** Full international number, e.g. +923001234567 */
export const phoneE164Schema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    "Select a country code and enter a valid phone number",
  );

export const optionalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length ? v : undefined))
  .pipe(z.union([z.undefined(), phoneE164Schema]));

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+[1-9]\d{7,14}$/.test(v), {
      message: "Select a country code and enter a valid phone number",
    }),
  subject: z.string().trim().min(3, "Please add a subject"),
  message: z.string().trim().min(10, "Message should be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  studentName: nameSchema,
  parentName: nameSchema,
  email: emailSchema,
  whatsapp: phoneE164Schema,
  country: z.string().min(2, "Select a country"),
  timezone: z.string().min(2, "Select a timezone"),
  courseSlug: z.string().min(1, "Select a course"),
  preferredTime: z.string().min(2, "Share a preferred day/time"),
  teacherGenderPref: z.enum(["female", "male", "no-preference"]),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const newsletterSchema = z.object({
  email: emailSchema,
  locale: z.string().optional().default("en"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: z.string().min(10),
  password: passwordSchema,
});

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check the form fields.";
}
