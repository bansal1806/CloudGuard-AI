import { NextRequest, NextResponse } from 'next/server'
import { initializeWebSocket } from '@/lib/websocket'

export async function GET(request: NextRequest) {
  try {
    // This endpoint provides WebSocket connection info
    return NextResponse.json({
      success: true,
      websocket: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL 
          : 'http://localhost:3000',
        path: '/socket.io/',
        transports: ['websocket', 'polling']
      },
      message: 'WebSocket server is running'
    })
  } catch (error: any) {
    console.error('WebSocket info error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get WebSocket info'
    }, { status: 500 })
  }
}
