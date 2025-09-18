/** @fileoverview Root layout component for the Investify application */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import AuthStatus from '@/components/AuthStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Investify - Company Onboarding Platform',
  description: 'Streamline your company onboarding process and get your investability score',
}

/**
 * Root layout component that wraps all pages
 * @description Provides the base HTML structure and global styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <Link href="/" className="text-2xl font-bold text-gray-900">Investify</Link>
                </div>
                <nav className="flex items-center space-x-6">
                  <Link href="/onboarding" className="text-gray-500 hover:text-gray-900">Get Started</Link>
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
                  <Link href="/data-room" className="text-gray-500 hover:text-gray-900">Data Room</Link>
                  <AuthStatus />
                </nav>
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

