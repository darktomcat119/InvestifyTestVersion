/** @fileoverview Data room page component */
/** @description File upload and management interface for company documents */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  AlertCircle,
  CheckCircle,
  Building2,
  ArrowLeft
} from 'lucide-react'
import { filesApi } from '@/lib/api'

/**
 * Data room page component
 * @description Handles file uploads, validation, and management
 */
export default function DataRoomPage() {
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Load files from backend
   * @description Fetches list of uploaded files
   */
  const loadFiles = async () => {
    try {
      const response = await filesApi.getList() as any
      setFiles(response.data)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  /**
   * Handle file upload
   * @description Uploads selected file with validation
   */
  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only PDF, XLSX, and PPTX files are allowed.')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum size is 5MB.')
      return
    }

    setIsUploading(true)
    
    try {
      await filesApi.upload(file)
      await loadFiles() // Reload files list
    } catch (error) {
      console.error('File upload failed:', error)
      alert('File upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Handle file selection
   * @description Processes selected files from input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles[0])
    }
  }

  /**
   * Handle drag and drop
   * @description Manages drag and drop file upload
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileUpload(droppedFiles[0])
    }
  }

  /**
   * Handle file deletion
   * @description Deletes selected file
   */
  const handleFileDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      await filesApi.delete(fileId)
      await loadFiles() // Reload files list
    } catch (error) {
      console.error('File deletion failed:', error)
      alert('File deletion failed. Please try again.')
    }
  }

  /**
   * Format file size
   * @description Converts bytes to human readable format
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Get file icon based on type
   * @description Returns appropriate icon for file type
   */
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'xlsx':
        return '📊'
      case 'pptx':
        return '📈'
      default:
        return '📄'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-900" />
              </Link>
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Investify</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/schedule" className="text-gray-500 hover:text-gray-900">
                Schedule
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Room</h1>
          <p className="text-gray-600">
            Upload and manage your company documents securely. Only PDF, XLSX, and PPTX files are allowed.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Documents</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PDF, XLSX, PPTX files up to 5MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Select Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Uploaded Files</h2>
            <p className="text-sm text-gray-500 mt-1">
              {files.length} file{files.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          
          {files.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{getFileIcon(file.name)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFileDelete(file.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Delete file"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Requirements */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">File Requirements</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Supported formats: PDF, XLSX, PPTX</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Files are stored securely and only accessible to you</li>
            <li>• Upload at least 3 documents to maximize your investability score</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

