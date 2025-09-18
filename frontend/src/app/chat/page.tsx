/** @fileoverview Chat page component */
/** @description Simple support chat interface */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  MessageCircle, 
  Send, 
  ArrowLeft,
  Building2,
  User
} from 'lucide-react'
import { messagesApi } from '@/lib/api'

/**
 * Chat page component
 * @description Simple support chat interface
 */
export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Load messages from backend
   * @description Fetches chat messages
   */
  const loadMessages = async () => {
    try {
      const response = await messagesApi.get() as any
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  /**
   * Scroll to bottom of messages
   * @description Auto-scrolls to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Handle sending message
   * @description Sends new message to backend
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    
    try {
      await messagesApi.send('You', newMessage)
      setNewMessage('')
      await loadMessages() // Reload messages
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  /**
   * Format message time
   * @description Formats timestamp for display
   */
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Support Chat</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Get help with your account and investment process
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'You'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{message.sender}</span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Chat Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Chat Support</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Our support team is available 9 AM - 5 PM EST</li>
            <li>• Average response time: 5-10 minutes</li>
            <li>• We can help with account setup, document uploads, and general questions</li>
            <li>• For urgent matters, please call our support line</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

