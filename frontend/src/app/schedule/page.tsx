/** @fileoverview Scheduling page component */
/** @description Simple scheduling interface for investor calls */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Building2,
  CheckCircle
} from 'lucide-react'

/**
 * Scheduling page component
 * @description Simple scheduling interface for booking investor calls
 */
export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  /**
   * Handle booking submission
   * @description Simulates booking process
   */
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooking(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsBooking(false)
    setIsBooked(true)
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Scheduled!</h2>
          <p className="text-gray-600 mb-6">
            Your investor call has been scheduled successfully. You'll receive a confirmation email shortly.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
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
              <Link href="/data-room" className="text-gray-500 hover:text-gray-900">
                Data Room
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Schedule Investor Call</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Book a call with our investment team to discuss your company and funding opportunities.
          </p>

          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <select
                required
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Call Details</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Duration: 30 minutes</li>
                <li>• Format: Video call (Zoom/Teams)</li>
                <li>• Preparation: Review your company profile and documents</li>
                <li>• Follow-up: You'll receive a summary and next steps</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isBooking || !selectedDate || !selectedTime}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Call
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

