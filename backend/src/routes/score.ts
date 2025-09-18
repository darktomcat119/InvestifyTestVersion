/** @fileoverview Investability score calculation API routes */
/** @description Handles investability score calculation and recommendations */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { InvestabilityScoreSchema, AppError } from '../../shared/types'

/**
 * Score routes plugin
 * @description Registers all score-related endpoints
 */
export default async function scoreRoutes(fastify: FastifyInstance) {
  // Get investability score
  fastify.get('/', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId },
        include: {
          documents: true
        }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      // Calculate investability score
      let score = 0
      const reasons: string[] = []
      
      // KYC verification (+30 points)
      if (company.kycVerified) {
        score += 30
        reasons.push('KYC verified')
      }
      
      // Financials linked (+20 points)
      if (company.financialsLinked) {
        score += 20
        reasons.push('Financials linked')
      }
      
      // Documents uploaded (+25 points for 3+ docs)
      const docCount = company.documents.length
      if (docCount >= 3) {
        score += 25
        reasons.push(`${docCount} docs uploaded`)
      } else if (docCount > 0) {
        score += Math.floor((docCount / 3) * 25)
        reasons.push(`${docCount} docs uploaded (need 3+ for full points)`)
      }
      
      // Revenue scaling (+25 points max, scaled by revenue)
      const revenueScale = Math.min(company.revenue / 1000000, 1) // Scale to $1M max
      const revenuePoints = Math.floor(revenueScale * 25)
      if (revenuePoints > 0) {
        score += revenuePoints
        reasons.push(`Revenue scaled to $${company.revenue.toLocaleString()}`)
      }
      
      // Ensure score doesn't exceed 100
      score = Math.min(score, 100)
      
      const scoreData = InvestabilityScoreSchema.parse({
        score,
        reasons
      })
      
      return {
        success: true,
        data: scoreData
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to calculate score')
    }
  })
  
  // Get score breakdown
  fastify.get('/breakdown', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId },
        include: {
          documents: true
        }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      const breakdown = {
        kycVerified: {
          status: company.kycVerified,
          points: company.kycVerified ? 30 : 0,
          maxPoints: 30,
          description: 'Complete KYC verification'
        },
        financialsLinked: {
          status: company.financialsLinked,
          points: company.financialsLinked ? 20 : 0,
          maxPoints: 20,
          description: 'Link your financial accounts'
        },
        documents: {
          status: company.documents.length >= 3,
          points: Math.min(company.documents.length, 3) * 8.33, // 25/3 points per doc
          maxPoints: 25,
          description: 'Upload at least 3 documents',
          current: company.documents.length,
          required: 3
        },
        revenue: {
          status: company.revenue > 0,
          points: Math.min(company.revenue / 1000000, 1) * 25,
          maxPoints: 25,
          description: 'Revenue scaling (up to $1M)',
          current: company.revenue,
          max: 1000000
        }
      }
      
      return {
        success: true,
        data: breakdown
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch score breakdown')
    }
  })
}
