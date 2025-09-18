'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function AuthStatus() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    authApi.me()
      .then((res: any) => {
        if (!cancelled) setEmail(res.data?.email || null)
      })
      .catch(() => {
        if (!cancelled) setEmail(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) return null

  const onLogout = async () => {
    await authApi.logout()
    setEmail(null)
    router.push('/login')
  }

  if (!email) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Login
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 hidden sm:inline">{email}</span>
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900"
      >
        Logout
      </button>
    </div>
  )
}


