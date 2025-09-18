/** @fileoverview Root layout component for the Investify application */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
          {children}
        </div>
      </body>
    </html>
  )
}

