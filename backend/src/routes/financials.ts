/** @fileoverview Financials linking API routes */
/** @description Handles financials linking simulation and status updates */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { FinancialsLinkSchema, FinancialsLinkResponseSchema, AppError } from '../../shared/types'

/**
 * Financials routes plugin
 * @description Registers all financials-related endpoints
 */
export default async function financialsRoutes(fastify: FastifyInstance) {
  // Simulate financials linking
  fastify.post('/link', async (request, reply) => {
    try {
      const body = FinancialsLinkSchema.parse(request.body)
      
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      // Simulate financials linking (always returns true for demo)
      const response = FinancialsLinkResponseSchema.parse({ financials_linked: true })
      
      // Update company financials status
      await prisma.company.update({
        where: { id: company.id },
        data: { financialsLinked: true }
      })
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'financials_linked',
          message: 'Financials linked successfully'
        }
      })
      
      return {
        success: true,
        message: 'Financials linked successfully',
        data: response
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Financials linking failed')
    }
  })
  
  // Get financials status
  fastify.get('/status', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const company = await prisma.company.findFirst({
        where: { userId },
        select: { financialsLinked: true }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      return {
        success: true,
        data: { financials_linked: company.financialsLinked }
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch financials status')
    }
  })
}
