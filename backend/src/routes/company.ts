/** @fileoverview Company management API routes */
/** @description Handles company creation, updates, and retrieval */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { CreateCompanySchema, AppError } from '../../shared/types'

/**
 * Company routes plugin
 * @description Registers all company-related endpoints
 */
export default async function companyRoutes(fastify: FastifyInstance) {
  // Create or update company
  fastify.post('/', async (request, reply) => {
    try {
      console.log('Received request body:', request.body)
      
      // Check if body is empty
      if (!request.body || Object.keys(request.body).length === 0) {
        throw new AppError(400, 'Request body cannot be empty')
      }
      
      const body = CreateCompanySchema.parse(request.body)
      
      // For demo purposes, we'll use a hardcoded user ID
      // In production, this would come from authentication
      let userId = 1
      
      // Ensure user exists (create if not)
      const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: 'demo@investify.com'
        }
      })
      
      // Check if company already exists for this user
      const existingCompany = await prisma.company.findFirst({
        where: { userId }
      })
      
      let company
      if (existingCompany) {
        // Update existing company
        company = await prisma.company.update({
          where: { id: existingCompany.id },
          data: {
            name: body.name,
            sector: body.sector,
            targetRaise: body.targetRaise,
            revenue: body.revenue
          }
        })
      } else {
        // Create new company
        company = await prisma.company.create({
          data: {
            userId,
            name: body.name,
            sector: body.sector,
            targetRaise: body.targetRaise,
            revenue: body.revenue
          }
        })
      }
      
      return {
        success: true,
        message: existingCompany ? 'Company updated successfully' : 'Company created successfully',
        data: company
      }
    } catch (error) {
      console.error('Validation error:', error)
      if (error instanceof Error) {
        throw new AppError(400, `Invalid company data: ${error.message}`)
      }
      throw new AppError(400, 'Invalid company data')
    }
  })
  
  // Get company by user ID
  fastify.get('/', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const company = await prisma.company.findFirst({
        where: { userId },
        include: {
          documents: true,
          messages: true
        }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      return {
        success: true,
        data: company
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch company')
    }
  })
}