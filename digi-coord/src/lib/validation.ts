import { z } from "zod"
import { NextResponse } from "next/server"

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid input"
    throw new ValidationError(firstError)
  }
  return result.data
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export function handleValidation(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  throw error
}

export const createWorkerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  whatsapp: z.string().min(1, "WhatsApp is required").max(50).regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  employer: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  accommodation: z.string().max(500).optional().or(z.literal("")),
  arrivalDate: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().max(200).optional().or(z.literal("")),
  emergencyContactPhone: z.string().max(50).optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const updateWorkerSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  whatsapp: z.string().min(1).max(50).regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format").optional(),
  email: z.string().email().optional().nullable(),
  employer: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  accommodation: z.string().max(500).optional().nullable(),
  arrivalDate: z.string().optional().nullable(),
  emergencyContactName: z.string().max(200).optional().nullable(),
  emergencyContactPhone: z.string().max(50).optional().nullable(),
  onboardingStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  employeeCardStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "BIOMETRICS_DONE", "CARD_READY", "ISSUED"]).optional(),
})

export const createIssueSchema = z.object({
  issueType: z.string().min(1, "Issue type is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  workerId: z.number().int().positive().optional().nullable(),
  workerName: z.string().max(200).optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  mediaUrls: z.array(z.string()).optional(),
  situationId: z.string().max(100).optional().nullable(),
  contacted: z.string().max(100).optional().nullable(),
})

export const updateIssueSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  description: z.string().max(5000).optional(),
  issueType: z.string().max(200).optional(),
})

export const createAccommodationSchema = z.object({
  workerId: z.number().int().positive("workerId is required"),
  address: z.string().min(1, "Address is required").max(500),
  room: z.string().max(200).optional().or(z.literal("")),
  rules: z.string().max(2000).optional().or(z.literal("")),
  contactName: z.string().max(200).optional().or(z.literal("")),
  contactPhone: z.string().max(50).optional().or(z.literal("")),
  mapUrl: z.string().max(500).optional().or(z.literal("")),
})

export const updateAccommodationSchema = z.object({
  address: z.string().min(1).max(500).optional(),
  room: z.string().max(200).optional().nullable(),
  rules: z.string().max(2000).optional().nullable(),
  contactName: z.string().max(200).optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  mapUrl: z.string().max(500).optional().nullable(),
})

export const toggleOnboardingSchema = z.object({
  completed: z.boolean().optional(),
})

export const createCompanySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  userId: z.string().optional().nullable(),
})

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  userId: z.string().optional().nullable(),
})

export const createCommunicationSchema = z.object({
  workerId: z.number().int().positive({ message: "Worker ID is required" }),
  companyId: z.number().int().positive().optional().nullable(),
  type: z.enum(["NOTE", "ISSUE_UPDATE", "ONBOARDING_UPDATE", "GENERAL"]).optional(),
  message: z.string().min(1, "Message is required").max(10000),
})
