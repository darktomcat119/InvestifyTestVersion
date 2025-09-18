/** @fileoverview Chat messages API routes */
/** @description Handles chat message creation and retrieval */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { AppError } from '../../shared/types'

/**
 * Messages routes plugin
 * @description Registers all message-related endpoints
 */
export default async function messagesRoutes(fastify: FastifyInstance) {
  // Get messages
  fastify.get('/', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      const messages = await prisma.message.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: 'asc' }
      })
      
      return {
        success: true,
        data: messages
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch messages')
    }
  })
  
  // Create message
  fastify.post('/', async (request, reply) => {
    try {
      const { sender, text } = request.body as { sender: string; text: string }
      
      if (!sender || !text) {
        throw new AppError(400, 'Sender and text are required')
      }
      
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      // Find the company for this user
      const company = await prisma.company.findFirst({
        where: { userId }
      })
      
      if (!company) {
        throw new AppError(404, 'Company not found')
      }
      
      const message = await prisma.message.create({
        data: {
          companyId: company.id,
          sender,
          text
        }
      })
      
      return {
        success: true,
        message: 'Message sent successfully',
        data: message
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to send message')
    }
  })
}
