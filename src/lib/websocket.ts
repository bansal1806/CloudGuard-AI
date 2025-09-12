import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { AuthService } from './auth'
import type { Socket } from 'socket.io'

export interface AuthenticatedSocket extends Socket {
  userId?: string
  userRole?: string
}

let io: SocketIOServer | null = null

export function initializeWebSocket(httpServer: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const user = AuthService.verifyToken(token)
      if (!user) {
        return next(new Error('Invalid token'))
      }

      socket.userId = user.id
      socket.userRole = user.role
      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  // Connection handling
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User ${socket.userId} connected via WebSocket`)

    // Join user-specific room
    socket.join(`user:${socket.userId}`)

    // Join role-based rooms
    if (socket.userRole === 'ADMIN') {
      socket.join('admins')
    }

    // Handle real-time metric subscriptions
    socket.on('subscribe:metrics', (resourceId: string) => {
      socket.join(`metrics:${resourceId}`)
      console.log(`📊 User ${socket.userId} subscribed to metrics for ${resourceId}`)
    })

    socket.on('unsubscribe:metrics', (resourceId: string) => {
      socket.leave(`metrics:${resourceId}`)
      console.log(`📊 User ${socket.userId} unsubscribed from metrics for ${resourceId}`)
    })

    // Handle alert subscriptions
    socket.on('subscribe:alerts', () => {
      socket.join('alerts')
      console.log(`🚨 User ${socket.userId} subscribed to alerts`)
    })

    socket.on('unsubscribe:alerts', () => {
      socket.leave('alerts')
      console.log(`🚨 User ${socket.userId} unsubscribed from alerts`)
    })

    // Handle cloud resource subscriptions
    socket.on('subscribe:resources', (accountId?: string) => {
      const room = accountId ? `resources:${accountId}` : 'resources'
      socket.join(room)
      console.log(`☁️ User ${socket.userId} subscribed to resources: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userId} disconnected from WebSocket`)
    })
  })

  return io
}

export function getWebSocketServer(): SocketIOServer | null {
  return io
}

// Utility functions for broadcasting
export class WebSocketService {
  static broadcastMetrics(resourceId: string, metrics: any) {
    if (!io) return
    io.to(`metrics:${resourceId}`).emit('metrics:update', {
      resourceId,
      metrics,
      timestamp: new Date().toISOString()
    })
  }

  static broadcastAlert(alert: any) {
    if (!io) return
    io.to('alerts').emit('alert:new', {
      ...alert,
      timestamp: new Date().toISOString()
    })
  }

  static broadcastResourceUpdate(accountId: string, resource: any) {
    if (!io) return
    io.to(`resources:${accountId}`).emit('resource:update', {
      accountId,
      resource,
      timestamp: new Date().toISOString()
    })
  }

  static broadcastToUser(userId: string, event: string, data: any) {
    if (!io) return
    io.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  static broadcastToAdmins(event: string, data: any) {
    if (!io) return
    io.to('admins').emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }
}