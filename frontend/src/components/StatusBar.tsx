'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface StatusBarProps {
  roomId: string | null
  activeUsers: number
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  usersTyping: Record<string, { userId: string; isTyping: boolean }>
}

export const StatusBar: React.FC<StatusBarProps> = ({
  roomId,
  activeUsers,
  connectionStatus,
  usersTyping,
}) => {
  const typingUsers = Object.values(usersTyping)
    .filter((u) => u.isTyping)
    .map((u) => u.userId)

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500'
      case 'connecting':
        return 'text-yellow-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Connection Error'
      default:
        return 'Disconnected'
    }
  }

  return (
    <div className="h-16 bg-editor-bg border-t border-editor-border px-4 py-3 flex items-center justify-between text-sm text-editor-fg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Room:</span>
          <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded">
            {roomId?.slice(0, 8) || 'Loading...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">Users:</span>
          <span className="font-semibold">{activeUsers}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className={getStatusColor()}>{getStatusText()}</span>
        </div>
      </div>

      {typingUsers.length > 0 && (
        <div className="text-xs text-yellow-500">
          {typingUsers.slice(0, 2).join(', ')}
          {typingUsers.length > 2 ? ' and more' : ''} is typing...
        </div>
      )}
    </div>
  )
}
