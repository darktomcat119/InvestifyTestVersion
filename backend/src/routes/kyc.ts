/** @fileoverview KYC verification API routes */
/** @description Handles KYC verification simulation and status updates */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { KYCVerificationSchema, AppError } from '../../shared/types'

/**
 * KYC routes plugin
 * @description Registers all KYC-related endpoints
 */
export default async function kycRoutes(fastify: FastifyInstance) {
  // Simulate KYC verification
  fastify.post('/verify', async (request, reply) => {
    try {
      console.log('KYC verification request received')
      console.log('Request body:', request.body)
      
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      // Simulate KYC verification (always returns true for demo)
      // Parse the empty body to satisfy Fastify's JSON body parser
      const verification = { verified: true }
      
      // Update company KYC status
      await prisma.company.update({
        where: { id: company.id },
        data: { kycVerified: true }
      })
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'kyc_completed',
          message: 'KYC verification completed successfully'
        }
      })
      
      return {
        success: true,
        message: 'KYC verification completed',
        data: verification
      }
    } catch (error) {
      console.error('KYC verification error:', error)
      if (error instanceof AppError) throw error
      throw new AppError(500, 'KYC verification failed')
    }
  })
  
  // Get KYC status
  fastify.get('/status', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const company = await prisma.company.findFirst({
        where: { userId },
        select: { kycVerified: true }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      return {
        success: true,
        data: { verified: company.kycVerified }
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch KYC status')
    }
  })
}
