/** @fileoverview File upload and management API routes */
/** @description Handles file uploads, validation, and retrieval */

import { FastifyInstance } from 'fastify'
import { prisma } from '../index'
import { AppError } from '../../shared/types'
import { promises as fs } from 'fs'
import { createWriteStream } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Files routes plugin
 * @description Registers all file-related endpoints
 */
export default async function filesRoutes(fastify: FastifyInstance) {
  // Upload file
  fastify.post('/', async (request, reply) => {
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
      
      const data = await request.file()
      
      if (!data) {
        throw new AppError(400, 'No file uploaded')
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
      if (!allowedTypes.includes(data.mimetype)) {
        throw new AppError(400, 'Invalid file type. Only PDF, XLSX, and PPTX files are allowed')
      }
      
      // Validate file size (5MB limit)
      if (data.file.bytesRead > 5 * 1024 * 1024) {
        throw new AppError(400, 'File size too large. Maximum size is 5MB')
      }
      
      // Generate unique filename
      const fileExtension = path.extname(data.filename)
      const uniqueFilename = `${uuidv4()}${fileExtension}`
      const uploadPath = path.join(process.cwd(), 'uploads', uniqueFilename)
      
      // Ensure uploads directory exists
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      
      // Save file
      await data.file.pipe(createWriteStream(uploadPath))
      
      // Save file record to database
      const document = await prisma.document.create({
        data: {
          companyId: company.id,
          name: data.filename,
          mimeType: data.mimetype,
          size: data.file.bytesRead,
          path: uploadPath
        }
      })
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'file_uploaded',
          message: `File "${data.filename}" uploaded successfully`
        }
      })
      
      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: document.id,
          name: document.name,
          size: document.size,
          uploadedAt: document.createdAt
        }
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'File upload failed')
    }
  })
  
  // Get files list
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
      
      const documents = await prisma.document.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: 'desc' }
      })
      
      const files = documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        uploadedAt: doc.createdAt
      }))
      
      return {
        success: true,
        data: files
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'Failed to fetch files')
    }
  })
  
  // Delete file
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const documentId = parseInt(id)
      
      if (isNaN(documentId)) {
        throw new AppError(400, 'Invalid file ID')
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
      
      // Find the document
      const document = await prisma.document.findFirst({
        where: { 
          id: documentId,
          companyId: company.id
        }
      })
      
      if (!document) {
        throw new AppError(404, 'File not found')
      }
      
      // Delete file from filesystem
      try {
        await fs.unlink(document.path)
      } catch (error) {
        // File might not exist, continue with database deletion
      }
      
      // Delete from database
      await prisma.document.delete({
        where: { id: documentId }
      })
      
      return {
        success: true,
        message: 'File deleted successfully'
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(500, 'File deletion failed')
    }
  })
}
