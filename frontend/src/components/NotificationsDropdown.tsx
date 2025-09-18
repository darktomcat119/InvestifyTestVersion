'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { notificationsApi } from '@/lib/api'

type NotificationItem = {
  id: number
  message: string
  type: string
  createdAt: string
  readAt: string | null
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res: any = await notificationsApi.get()
      setItems(res.data || [])
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const unreadCount = items.filter(i => !i.readAt).length

  const markAll = async () => {
    try {
      await notificationsApi.markAllAsRead()
      await load()
    } catch {}
  }

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-500 hover:text-gray-900" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            <button onClick={markAll} className="text-xs text-blue-600 hover:underline">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No notifications</div>
            ) : (
              items.map(item => (
                <div key={item.id} className={`px-3 py-2 text-sm ${item.readAt ? 'bg-white' : 'bg-blue-50'}`}>
                  <div className="text-gray-900">{item.message}</div>
                  <div className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}


