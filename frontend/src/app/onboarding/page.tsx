/** @fileoverview Onboarding wizard page component */
/** @description Multi-step onboarding process for company setup */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, CheckCircle, Shield, CreditCard } from 'lucide-react'
import { companyApi, kycApi, financialsApi } from '@/lib/api'

/**
 * Onboarding wizard component
 * @description Guides users through company setup, KYC, and financials linking
 */
export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: '',
    sector: '',
    targetRaise: 0,
    revenue: 0
  })
  const [formTouched, setFormTouched] = useState(false)

  // Debug: Log state changes
  console.log('Current companyData state:', companyData)
  const [kycVerified, setKycVerified] = useState(false)
  const [financialsLinked, setFinancialsLinked] = useState(false)

  /**
   * Handle company data submission
   * @description Saves company information and moves to next step
   */
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', companyData)
    console.log('Form touched:', formTouched)
    
    // Check if form has been touched
    if (!formTouched) {
      alert('Please fill in the form before submitting.')
      return
    }
    
    // Validate form data
    if (!companyData.name || !companyData.sector || companyData.targetRaise <= 0 || companyData.revenue < 0) {
      alert('Please fill in all required fields with valid values.')
      return
    }
    
    setIsLoading(true)
    
    try {
      await companyApi.createOrUpdate(companyData)
      setCurrentStep(2)
    } catch (error) {
      console.error('Failed to save company data:', error)
      alert('Failed to save company data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle KYC verification
   * @description Initiates KYC verification process
   */
  const handleKYCVerification = async () => {
    setIsLoading(true)
    
    try {
      await kycApi.verify()
      setKycVerified(true)
      setCurrentStep(3)
    } catch (error) {
      console.error('KYC verification failed:', error)
      alert('KYC verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle financials linking
   * @description Links financial accounts with dummy token
   */
  const handleFinancialsLink = async () => {
    setIsLoading(true)
    
    try {
      await financialsApi.link('dummy_token_123')
      setFinancialsLinked(true)
      setCurrentStep(4)
    } catch (error) {
      console.error('Financials linking failed:', error)
      alert('Financials linking failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Complete onboarding
   * @description Redirects to dashboard after completion
   */
  const completeOnboarding = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              </div>
              
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyData.name}
                    onChange={(e) => {
                      console.log('Name changed to:', e.target.value)
                      setFormTouched(true)
                      setCompanyData({...companyData, name: e.target.value})
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector
                  </label>
                  <select
                    required
                    value={companyData.sector}
                    onChange={(e) => {
                      console.log('Sector changed to:', e.target.value)
                      setFormTouched(true)
                      setCompanyData({...companyData, sector: e.target.value})
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a sector</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Raise ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={companyData.targetRaise}
                    onChange={(e) => setCompanyData({...companyData, targetRaise: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter target raise amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={companyData.revenue}
                    onChange={(e) => setCompanyData({...companyData, revenue: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter annual revenue"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? 'Saving...' : 'Continue'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verify Your Identity
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete KYC verification to proceed with your application.
                  This is a demo simulation and will always return verified.
                </p>
                
                <button
                  onClick={handleKYCVerification}
                  disabled={isLoading}
                  className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                >
                  {isLoading ? 'Verifying...' : 'Start KYC Verification'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Link Financials</h2>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect Your Financial Accounts
                </h3>
                <p className="text-gray-600 mb-6">
                  Link your financial accounts to provide revenue verification.
                  This is a demo simulation with a dummy token.
                </p>
                
                <button
                  onClick={handleFinancialsLink}
                  disabled={isLoading}
                  className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                >
                  {isLoading ? 'Linking...' : 'Link Financial Accounts'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Onboarding Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your company has been successfully set up. You can now access your dashboard
                  to view your investability score and manage your documents.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Upload company documents in the Data Room</li>
                    <li>• View your investability score on the Dashboard</li>
                    <li>• Schedule calls with potential investors</li>
                  </ul>
                </div>
                
                <button
                  onClick={completeOnboarding}
                  className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 flex items-center mx-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

