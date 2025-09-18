/** @fileoverview Auth routes: minimal email-based session using cookies */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../index'
import { AppError, LoginSchema } from '../../shared/types'

export default async function authRoutes(fastify: FastifyInstance) {
  // Login: set a signed cookie for demo session
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = LoginSchema.parse(request.body)
      const email = body.email.toLowerCase()

      // Create or find demo user
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email }
      })

      // Set cookie with user id (signed)
      ;(reply as any).setCookie('session', String(user.id), {
        signed: true,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return { success: true, message: 'Logged in', data: { userId: user.id, email: user.email } }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(400, 'Invalid login request')
    }
  })

  // Me: returns current user from cookie
  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const cookies = (request as any).cookies || {}
      const session = cookies.session
      if (!session) throw new AppError(401, 'Not authenticated')
      const unsign = (fastify as any).unsignCookie(session)
      const userId = parseInt((unsign && unsign.value) ? unsign.value : '0')
      if (!userId) throw new AppError(401, 'Invalid session')

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new AppError(401, 'User not found')

      return { success: true, data: { id: user.id, email: user.email } }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(401, 'Not authenticated')
    }
  })

  // Logout: clear cookie
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    ;(reply as any).clearCookie('session', { path: '/' })
    return { success: true, message: 'Logged out' }
  })
}


