/** @fileoverview Dashboard page component */
/** @description Main dashboard with company profile, status badges, and investability score */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Bell,
  Upload,
  Calendar,
  MessageCircle
} from 'lucide-react'
import { companyApi, scoreApi, notificationsApi } from '@/lib/api'

/**
 * Dashboard page component
 * @description Displays company information, investability score, and quick actions
 */
export default function DashboardPage() {
  const [company, setCompany] = useState<any>(null)
  const [score, setScore] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Load dashboard data
   * @description Fetches company, score, and notification data
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [companyData, scoreData, notificationsData] = await Promise.all([
          companyApi.get(),
          scoreApi.get(),
          notificationsApi.get()
        ])
        
        setCompany((companyData as any).data)
        setScore((scoreData as any).data)
        setNotifications((notificationsData as any).data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Found</h2>
          <p className="text-gray-600 mb-6">Please complete the onboarding process first.</p>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Start Onboarding
          </Link>
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
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Investify</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/data-room" className="text-gray-500 hover:text-gray-900">
                Data Room
              </Link>
              <Link href="/schedule" className="text-gray-500 hover:text-gray-900">
                Schedule
              </Link>
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-500 hover:text-gray-900 cursor-pointer" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Profile */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex space-x-2">
              <Link
                href="/onboarding"
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sector</h3>
              <p className="text-lg font-semibold text-gray-900">{company.sector}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Target Raise</h3>
              <p className="text-lg font-semibold text-gray-900">
                ${company.targetRaise.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Revenue</h3>
              <p className="text-lg font-semibold text-gray-900">
                ${company.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investability Score */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Investability Score</h2>
            </div>
            
            {score && (
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${score.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{score.score}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {score.score >= 80 ? 'Excellent' : 
                   score.score >= 60 ? 'Good' : 
                   score.score >= 40 ? 'Fair' : 'Needs Improvement'}
                </h3>
                
                <div className="text-sm text-gray-600 space-y-1">
                  {score.reasons.map((reason: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Badges */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Status Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">KYC Verified</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  company.kycVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {company.kycVerified ? 'Complete' : 'Pending'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">Financials Linked</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  company.financialsLinked 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {company.financialsLinked ? 'Complete' : 'Pending'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <span className="font-medium text-gray-900">Documents Uploaded</span>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {company.documents?.length || 0} files
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/data-room"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Upload className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Upload Documents</h3>
                <p className="text-sm text-gray-600">Add files to your data room</p>
              </div>
            </Link>
            
            <Link
              href="/schedule"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Schedule Call</h3>
                <p className="text-sm text-gray-600">Book investor meetings</p>
              </div>
            </Link>
            
            <Link
              href="/chat"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <MessageCircle className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Support Chat</h3>
                <p className="text-sm text-gray-600">Get help and support</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

