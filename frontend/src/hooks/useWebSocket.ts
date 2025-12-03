import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCode,
  setInitialState,
  setConnectionStatus,
  updateUserCursor,
  removeUserCursor,
  updateUserTyping,
  removeUserTyping,
  setActiveUsersCount,
  setErrorMessage,
} from '@/store/slices/roomSlice'
import { setConnected, incrementReconnectAttempts, resetReconnectAttempts } from '@/store/slices/websocketSlice'
import { WS_ENDPOINTS } from '@/config/api'
import { RootState } from '@/store/store'

interface WebsocketMessage {
  type: string
  [key: string]: any
}

const COLOR_PALETTE = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
]

let userColorMap: Record<string, string> = {}
let colorIndex = 0

const getUserColor = (userId: string): string => {
  if (!userColorMap[userId]) {
    userColorMap[userId] = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length]
    colorIndex++
  }
  return userColorMap[userId]
}

export const useWebSocket = (roomId: string | null, userId: string) => {
  const dispatch = useDispatch()
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isReady, setIsReady] = useState(false)
  const reconnectAttempts = useSelector(
    (state: RootState) => state.websocket.reconnectAttempts
  )

  const connect = useCallback(() => {
    if (!roomId || ws.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      dispatch(setConnectionStatus('connecting'))
      const url = WS_ENDPOINTS.room(roomId)
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        dispatch(setConnectionStatus('connected'))
        dispatch(setConnected(true))
        dispatch(resetReconnectAttempts())
        setIsReady(true)

        // Send init message
        ws.current?.send(
          JSON.stringify({
            type: 'init',
            userId,
          })
        )
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebsocketMessage = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.current.onerror = () => {
        dispatch(setConnectionStatus('error'))
        dispatch(setConnected(false))
        dispatch(setErrorMessage('WebSocket connection error'))
      }

      ws.current.onclose = () => {
        dispatch(setConnectionStatus('disconnected'))
        dispatch(setConnected(false))
        setIsReady(false)

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
          reconnectTimeoutRef.current = setTimeout(() => {
            dispatch(incrementReconnectAttempts())
            connect()
          }, delay)
        }
      }
    } catch (error) {
      dispatch(setConnectionStatus('error'))
      dispatch(setConnected(false))
      dispatch(setErrorMessage('Failed to connect to WebSocket'))
    }
  }, [roomId, userId, dispatch, reconnectAttempts])

  const handleMessage = useCallback(
    (message: WebsocketMessage) => {
      switch (message.type) {
        case 'init':
          dispatch(
            setInitialState({
              code: message.code,
              language: message.language || 'python',
            })
          )
          break

        case 'code_update':
          if (message.user_id !== userId) {
            dispatch(setCode(message.code))
          }
          break

        case 'cursor_update':
          if (message.user_id !== userId) {
            dispatch(
              updateUserCursor({
                userId: message.user_id,
                position: message.cursor_position,
                color: getUserColor(message.user_id),
              })
            )
          }
          break

        case 'typing':
          dispatch(
            updateUserTyping({
              userId: message.user_id,
              isTyping: message.is_typing,
            })
          )
          break

        case 'user_joined':
          dispatch(setActiveUsersCount(message.active_users))
          break

        case 'user_left':
          dispatch(removeUserCursor(message.user_id))
          dispatch(removeUserTyping(message.user_id))
          dispatch(setActiveUsersCount(message.active_users))
          break

        case 'error':
          dispatch(setErrorMessage(message.message))
          break
      }
    },
    [userId, dispatch]
  )

  const send = useCallback((message: WebsocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    ws.current?.close()
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [roomId, userId])

  return {
    send,
    isReady,
    ws: ws.current,
  }
}
