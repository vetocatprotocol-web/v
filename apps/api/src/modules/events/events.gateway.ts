import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { workspaces, workspaceMembers } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    workspaceId: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3004', 'http://localhost:3005'], // web and admin apps
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private jwtService: JwtService,
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token;
      const workspaceId = client.handshake.auth.workspaceId;

      if (!token || !workspaceId) {
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;

      // Check workspace access
      const member = await this.db.select()
        .from(workspaceMembers)
        .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
        .limit(1);

      if (!member[0]) {
        client.emit('error', { code: 'ACCESS_DENIED', message: 'No access to workspace' });
        client.disconnect();
        return;
      }

      // Store user data
      client.data.userId = userId;
      client.data.workspaceId = workspaceId;

      // Join workspace room
      client.join(`workspace:${workspaceId}`);
      client.join(`user:${userId}`);

      // Send connection confirmation
      client.emit('connected', {
        userId,
        workspaceId,
        sessionId: client.id,
        serverTime: new Date().toISOString(),
      });

      this.logger.log(`Client connected: ${client.id} (user: ${userId}, workspace: ${workspaceId})`);
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.emit('error', { code: 'AUTH_FAILED', message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Task events
  emitTaskCreated(workspaceId: string, task: any) {
    this.server.to(`workspace:${workspaceId}`).emit('task:created', task);
  }

  emitTaskUpdated(workspaceId: string, taskId: string, updates: any) {
    this.server.to(`workspace:${workspaceId}`).emit('task:updated', { taskId, ...updates });
  }

  emitTaskStatusChanged(workspaceId: string, taskId: string, status: string, previousStatus: string) {
    this.server.to(`workspace:${workspaceId}`).emit('task:status_changed', {
      taskId,
      status,
      previousStatus,
    });
  }

  emitTaskProgress(workspaceId: string, taskId: string, progress: number, message: string, details?: any) {
    this.server.to(`workspace:${workspaceId}`).emit('task:progress', {
      taskId,
      progress,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  emitTaskCompleted(workspaceId: string, taskId: string, output: any, cost: any) {
    this.server.to(`workspace:${workspaceId}`).emit('task:completed', {
      taskId,
      output,
      cost,
      completedAt: new Date().toISOString(),
    });
  }

  emitTaskFailed(workspaceId: string, taskId: string, error: any) {
    this.server.to(`workspace:${workspaceId}`).emit('task:failed', {
      taskId,
      error,
      failedAt: new Date().toISOString(),
    });
  }

  // Agent events
  emitAgentStarted(workspaceId: string, taskId: string, agentId: string) {
    this.server.to(`workspace:${workspaceId}`).emit('agent:started', {
      taskId,
      agentId,
    });
  }

  emitAgentStep(workspaceId: string, taskId: string, step: number, totalSteps: number, message: string) {
    this.server.to(`workspace:${workspaceId}`).emit('agent:step', {
      taskId,
      step,
      totalSteps,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  emitAgentCompleted(workspaceId: string, taskId: string, agentId: string, output: any) {
    this.server.to(`workspace:${workspaceId}`).emit('agent:completed', {
      taskId,
      agentId,
      output,
    });
  }

  emitAgentThinking(workspaceId: string, taskId: string, message: string) {
    this.server.to(`workspace:${workspaceId}`).emit('agent:thinking', {
      taskId,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // File events
  emitFileUploaded(workspaceId: string, file: any) {
    this.server.to(`workspace:${workspaceId}`).emit('file:uploaded', file);
  }

  emitFileProcessing(workspaceId: string, fileId: string, operation: string, progress: number, message: string) {
    this.server.to(`workspace:${workspaceId}`).emit('file:processing', {
      fileId,
      operation,
      progress,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  emitFileProcessed(workspaceId: string, fileId: string, result: any) {
    this.server.to(`workspace:${workspaceId}`).emit('file:processed', {
      fileId,
      result,
    });
  }
}