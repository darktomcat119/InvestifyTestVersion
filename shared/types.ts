/** @fileoverview Shared TypeScript types for Investify platform */
/** @description Common types used across frontend and backend */

import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  createdAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// Company types
export const CompanySchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string().min(1),
  sector: z.string().min(1),
  targetRaise: z.number().min(0),
  revenue: z.number().min(0),
  kycVerified: z.boolean().default(false),
  financialsLinked: z.boolean().default(false),
  createdAt: z.date(),
})

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  sector: z.string().min(1, 'Sector is required'),
  targetRaise: z.number().min(0, 'Target raise must be positive'),
  revenue: z.number().min(0, 'Revenue must be positive'),
})

export type Company = z.infer<typeof CompanySchema>
export type CreateCompany = z.infer<typeof CreateCompanySchema>

// Document types
export const DocumentSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  path: z.string(),
  createdAt: z.date(),
})

export type Document = z.infer<typeof DocumentSchema>

// Notification types
export const NotificationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  type: z.string(),
  message: z.string(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
})

export type Notification = z.infer<typeof NotificationSchema>

// Message types
export const MessageSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  sender: z.string(),
  text: z.string(),
  createdAt: z.date(),
})

export type Message = z.infer<typeof MessageSchema>

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
})

export type ApiResponse<T = any> = {
  success: boolean
  message?: string
  data?: T
}

// Investability Score types
export const InvestabilityScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
})

export type InvestabilityScore = z.infer<typeof InvestabilityScoreSchema>

// KYC types
export const KYCVerificationSchema = z.object({
  verified: z.boolean(),
})

export type KYCVerification = z.infer<typeof KYCVerificationSchema>

// Financials types
export const FinancialsLinkSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const FinancialsLinkResponseSchema = z.object({
  financials_linked: z.boolean(),
})

export type FinancialsLink = z.infer<typeof FinancialsLinkSchema>
export type FinancialsLinkResponse = z.infer<typeof FinancialsLinkResponseSchema>

// File upload types
export const FileUploadSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  path: z.string(),
})

export type FileUpload = z.infer<typeof FileUploadSchema>

// Auth types
export const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
})

export type LoginRequest = z.infer<typeof LoginSchema>

// Error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

