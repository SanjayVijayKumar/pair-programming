'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { Header, MonacoEditorWrapper, StatusBar, Button } from '@/components'
import { useWebSocket, useDebounce } from '@/hooks'
import { setRoomId, setCode } from '@/store/slices/roomSlice'
import { fetchSuggestion, clearSuggestion } from '@/store/slices/autocompleteSlice'
import { RootState, AppDispatch } from '@/store/store'
import { v4 as uuidv4 } from 'uuid'

export default function RoomPage() {
  const params = useParams()
  const roomId = params.roomId as string
  const dispatch = useDispatch<AppDispatch>()

  const [userId] = useState(() => `user-${uuidv4().slice(0, 8)}`)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)

  const code = useSelector((state: RootState) => state.room.code)
  const language = useSelector((state: RootState) => state.room.language)
  const connectionStatus = useSelector(
    (state: RootState) => state.room.connectionStatus
  )
  const activeUsersCount = useSelector(
    (state: RootState) => state.room.activeUsersCount
  )
  const usersTyping = useSelector((state: RootState) => state.room.usersTyping)
  const suggestion = useSelector(
    (state: RootState) => state.autocomplete.suggestion
  )

  const debouncedCode = useDebounce(code, 300)
  const debouncedCursor = useDebounce(cursorPosition, 500)

  const { send, isReady } = useWebSocket(roomId, userId)

  // Initialize room
  useEffect(() => {
    dispatch(setRoomId(roomId))
  }, [roomId, dispatch])

  // Send code updates
  useEffect(() => {
    if (isReady && debouncedCode !== code) {
      send({
        type: 'code_update',
        userId,
        code: debouncedCode,
        timestamp: Date.now(),
      })
    }
  }, [debouncedCode, isReady, send, userId, code])

  // Send cursor updates
  useEffect(() => {
    if (isReady) {
      send({
        type: 'cursor_update',
        userId,
        cursorPosition: debouncedCursor,
      })
    }
  }, [debouncedCursor, isReady, send, userId])

  // Handle typing indicator
  useEffect(() => {
    if (isReady) {
      if (isTyping) {
        const timeout = setTimeout(() => {
          setIsTyping(false)
          send({
            type: 'typing',
            userId,
            isTyping: false,
          })
        }, 600)

        return () => clearTimeout(timeout)
      }
    }
  }, [isTyping, isReady, send, userId])

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debouncedCode && cursorPosition > 0 && !isTyping) {
      dispatch(
        fetchSuggestion({
          code: debouncedCode,
          cursorPosition,
          language,
        })
      )
      setShowSuggestion(true)
    } else {
      setShowSuggestion(false)
    }
  }, [debouncedCode, debouncedCursor, isTyping, language, dispatch, cursorPosition])

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(setCode(value))
      setIsTyping(true)

      send({
        type: 'typing',
        userId,
        isTyping: true,
      })
    }
  }

  const handleCursorChange = (position: number) => {
    setCursorPosition(position)
  }

  return (
    <div className="min-h-screen bg-editor-bg flex flex-col">
      <Header subtitle={`Room: ${roomId.slice(0, 12)}...`} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MonacoEditorWrapper
          code={code}
          language={language}
          onChange={handleCodeChange}
          onCursorChange={handleCursorChange}
          theme="vs-dark"
        />

        {showSuggestion && suggestion && (
          <div className="bg-gray-800 border-t border-editor-border px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-400">💡 Suggestion: </span>
                <code className="text-green-400 font-mono">{suggestion}</code>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowSuggestion(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <StatusBar
          roomId={roomId}
          activeUsers={activeUsersCount}
          connectionStatus={connectionStatus}
          usersTyping={usersTyping}
        />
      </div>
    </div>
  )
}
