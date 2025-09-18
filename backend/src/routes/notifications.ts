/** @fileoverview Notifications API routes */
/** @description Handles notification creation, retrieval, and status updates */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { AppError } from '../../shared/types'

/**
 * Notifications routes plugin
 * @description Registers all notification-related endpoints
 */
export default async function notificationsRoutes(fastify: FastifyInstance) {
  // Get notifications
  fastify.get('/', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      
      const formattedNotifications = notifications.map(notification => ({
        id: notification.id,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt,
        readAt: notification.readAt
      }))
      
      return {
        success: true,
        data: formattedNotifications
      }
    } catch (error) {
      throw new AppError(500, 'Failed to fetch notifications')
    }
  })
  
  // Mark notification as read
  fastify.patch('/:id/read', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const notificationId = parseInt(id)
      
      if (isNaN(notificationId)) {
        throw new AppError(400, 'Invalid notification ID')
      }
      
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const notification = await prisma.notification.findFirst({
        where: { 
          id: notificationId,
          userId
        }
      })
      
      if (!notification) {
        throw new AppError(404, 'Notification not found')
      }
      
      await prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() }
      })
      
      return {
        success: true,
        message: 'Notification marked as read'
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to mark notification as read')
    }
  })
  
  // Mark all notifications as read
  fastify.patch('/read-all', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      await prisma.notification.updateMany({
        where: { 
          userId,
          readAt: null
        },
        data: { readAt: new Date() }
      })
      
      return {
        success: true,
        message: 'All notifications marked as read'
      }
    } catch (error) {
      throw new AppError(500, 'Failed to mark all notifications as read')
    }
  })
  
  // Get unread count
  fastify.get('/unread-count', async (request, reply) => {
    try {
      // For demo purposes, we'll use a hardcoded user ID
      const userId = 1
      
      const count = await prisma.notification.count({
        where: { 
          userId,
          readAt: null
        }
      })
      
      return {
        success: true,
        data: { count }
      }
    } catch (error) {
      throw new AppError(500, 'Failed to fetch unread count')
    }
  })
}
