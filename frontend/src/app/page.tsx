'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Button } from '@/components'
import { API_ENDPOINTS } from '@/config/api'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.createRoom, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create room')
      }

      const data = await response.json()
      const roomId = data.room_id

      router.push(`/room/${roomId}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">
              Pair Programming
            </h1>
            <p className="text-xl text-gray-300">
              Real-time collaborative code editing with live cursors and typing indicators
            </p>
          </div>

          <div className="space-y-6 bg-gray-800 rounded-lg p-8">
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-semibold text-white">Features</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Real-time code synchronization
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Live cursor tracking for all users
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Typing indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  AI-powered autocomplete suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Python syntax highlighting
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded p-4 text-red-100">
                {error}
              </div>
            )}

            <Button
              size="lg"
              onClick={handleCreateRoom}
              isLoading={isLoading}
              className="w-full"
            >
              Create New Room
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Or share a room ID with others to collaborate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-white mb-2">⚡ Fast</h3>
              <p className="text-sm text-gray-400">
                Real-time updates powered by WebSockets
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-white mb-2">🔄 Sync</h3>
              <p className="text-sm text-gray-400">
                All changes synchronized instantly
              </p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <h3 className="font-semibold text-white mb-2">🤖 Smart</h3>
              <p className="text-sm text-gray-400">
                Autocomplete suggestions as you type
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
