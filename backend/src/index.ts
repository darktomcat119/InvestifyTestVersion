/** @fileoverview Main entry point for the Investify backend server */
/** @description Fastify server with all routes, middleware, and configurations */

import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import cookie from '@fastify/cookie'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../shared/types'

// Import routes
import companyRoutes from './routes/company'
import kycRoutes from './routes/kyc'
import financialsRoutes from './routes/financials'
import filesRoutes from './routes/files'
import scoreRoutes from './routes/score'
import notificationsRoutes from './routes/notifications'
import messagesRoutes from './routes/messages'
import authRoutes from './routes/auth'

// Initialize Prisma client
export const prisma = new PrismaClient()

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
})

/**
 * Register plugins and routes
 * @description Sets up all middleware, CORS, security, and API routes
 */
async function buildServer() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    })

    // Register security headers
    await fastify.register(helmet, {
      contentSecurityPolicy: false
    })

    // Register cookies (for session auth)
    await fastify.register(cookie, {
      secret: process.env.COOKIE_SECRET || 'dev-secret',
      parseOptions: {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production'
      }
    })

    // Register rate limiting
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    })

    // Register multipart for file uploads
    await fastify.register(multipart, {
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      }
    })

    // Register routes
    await fastify.register(authRoutes, { prefix: '/api/auth' })
    await fastify.register(companyRoutes, { prefix: '/api/company' })
    await fastify.register(kycRoutes, { prefix: '/api/kyc' })
    await fastify.register(financialsRoutes, { prefix: '/api/financials' })
    await fastify.register(filesRoutes, { prefix: '/api/files' })
    await fastify.register(scoreRoutes, { prefix: '/api/score' })
    await fastify.register(notificationsRoutes, { prefix: '/api/notifications' })
    await fastify.register(messagesRoutes, { prefix: '/api/messages' })

    // Health check endpoint
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    })

    // Global error handler
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error)
      
      if (error instanceof AppError) {
        reply.status(error.statusCode).send({
          success: false,
          message: error.message
        })
      } else {
        reply.status(500).send({
          success: false,
          message: 'Internal server error'
        })
      }
    })

    return fastify
  } catch (error) {
    fastify.log.error(error)
    throw error
  }
}

/**
 * Start the server
 * @description Initializes and starts the Fastify server
 */
async function start() {
  try {
    const server = await buildServer()
    
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'
    
    await server.listen({ port, host })
    console.log(`🚀 Server running on http://${host}:${port}`)
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...')
      await server.close()
      await prisma.$disconnect()
      process.exit(0)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
start()
