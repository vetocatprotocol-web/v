# KARYO OS — WebSocket Event Catalog

## Real-time Communication Specification

---

## 📡 Overview

Karyo OS menggunakan **Socket.IO** untuk real-time communication antara server dan client. Semua event di-serialize sebagai JSON.

---

## 🔌 Connection

### Client Connect

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt-access-token',
    workspaceId: 'workspace-uuid',
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// Connection events
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
socket.on('connect_error', (err) => console.log('Connection error:', err.message));
socket.on('reconnect', (attempt) => console.log('Reconnected after', attempt, 'attempts'));
```

### Authentication

```typescript
// Server validates JWT on connection
// If invalid → disconnect with reason "authentication_error"
// If valid → join workspace room

// Server-side
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = verifyJWT(token);
    socket.data.userId = user.id;
    socket.data.workspaceId = socket.handshake.auth.workspaceId;
    next();
  } catch (err) {
    next(new Error('authentication_error'));
  }
});
```

### Room Structure

```
workspace:{workspaceId}     — All members of a workspace
user:{userId}               — Specific user (notifications)
task:{taskId}               — Task-specific updates
session:{sessionId}         — Work session tracking
```

---

## 📋 Event Catalog

### Server → Client Events

#### 🔔 Connection & Auth

| Event | Payload | Description |
|-------|---------|-------------|
| `connected` | `{ userId, workspaceId, sessionId }` | Connection confirmed |
| `error` | `{ code, message }` | Error notification |
| `auth:expired` | `{ reason }` | JWT expired, need re-login |
| `auth:workspace_changed` | `{ workspaceId }` | User switched workspace |

```json
// connected
{
  "userId": "uuid",
  "workspaceId": "uuid",
  "sessionId": "uuid",
  "serverTime": "2026-03-31T02:00:00Z"
}
```

#### 📋 Task Events

| Event | Payload | Description |
|-------|---------|-------------|
| `task:created` | `Task` | New task created |
| `task:updated` | `Partial<Task>` | Task fields updated |
| `task:status_changed` | `{ taskId, status, previousStatus }` | Status transition |
| `task:progress` | `{ taskId, progress, message, details }` | Progress update (0–100) |
| `task:completed` | `{ taskId, output, summary }` | Task completed successfully |
| `task:failed` | `{ taskId, error }` | Task failed |
| `task:cancelled` | `{ taskId, reason }` | Task cancelled by user |
| `task:deleted` | `{ taskId }` | Task deleted |

```json
// task:progress
{
  "taskId": "uuid",
  "progress": 65,
  "message": "Menganalisis data penjualan...",
  "details": "Processing 320/500 rows",
  "timestamp": "2026-03-31T02:00:00Z"
}
```

```json
// task:completed
{
  "taskId": "uuid",
  "output": {
    "summary": "Laporan penjualan Q3 berhasil dibuat",
    "format": "pdf",
    "fileId": "uuid",
    "insights": [
      "Revenue naik 15% dibanding Q2",
      "Produk A adalah top performer"
    ]
  },
  "cost": {
    "usd": 0.032,
    "tokens": 8500
  },
  "durationMs": 12400,
  "completedAt": "2026-03-31T02:00:00Z"
}
```

```json
// task:failed
{
  "taskId": "uuid",
  "error": {
    "code": "E5001",
    "message": "AI model timeout after 300s",
    "retryable": true,
    "details": {}
  },
  "failedAt": "2026-03-31T02:00:00Z"
}
```

#### 🤖 Agent Events

| Event | Payload | Description |
|-------|---------|-------------|
| `agent:assigned` | `{ taskId, agentId, agentName }` | Agent assigned to task |
| `agent:started` | `{ taskId, agentId }` | Agent started executing |
| `agent:step` | `{ taskId, step, totalSteps, message }` | Agent execution step |
| `agent:completed` | `{ taskId, agentId, output }` | Agent finished |
| `agent:failed` | `{ taskId, agentId, error }` | Agent failed |
| `agent:thinking` | `{ taskId, message }` | Agent is reasoning/processing |

```json
// agent:step
{
  "taskId": "uuid",
  "agentId": "finance-analyst-v1",
  "step": 3,
  "totalSteps": 6,
  "stepName": "Analyze trends",
  "message": "Menghitung rata-rata pertumbuhan bulanan...",
  "timestamp": "2026-03-31T02:00:00Z"
}
```

#### 📁 File Events

| Event | Payload | Description |
|-------|---------|-------------|
| `file:uploaded` | `File` | File uploaded |
| `file:processing` | `{ fileId, operation, progress }` | AI processing file |
| `file:processed` | `{ fileId, result }` | AI processing done |
| `file:deleted` | `{ fileId }` | File deleted |
| `file:updated` | `{ fileId, changes }` | File metadata updated |

```json
// file:processing
{
  "fileId": "uuid",
  "operation": "summarize",
  "progress": 45,
  "message": "Menganalisis konten dokumen...",
  "timestamp": "2026-03-31T02:00:00Z"
}
```

#### 🧠 Memory Events

| Event | Payload | Description |
|-------|---------|-------------|
| `memory:created` | `MemoryEntry` | New memory stored |
| `memory:updated` | `{ memoryId, changes }` | Memory updated |
| `memory:suggestion` | `{ suggestion, context }` | AI suggests action based on memory |

```json
// memory:suggestion
{
  "suggestion": "Anda biasanya membuat laporan di format PDF. Mau pakai format yang sama?",
  "context": {
    "trigger": "task_created",
    "pattern": "report_format_preference",
    "confidence": 0.92
  },
  "actions": [
    { "label": "Ya, PDF", "value": "pdf" },
    { "label": "Tidak, Markdown", "value": "markdown" }
  ]
}
```

#### 🔌 Integration Events

| Event | Payload | Description |
|-------|---------|-------------|
| `integration:connected` | `Integration` | Integration connected |
| `integration:disconnected` | `{ integrationId }` | Integration disconnected |
| `integration:syncing` | `{ integrationId, progress }` | Sync in progress |
| `integration:synced` | `{ integrationId, stats }` | Sync completed |
| `integration:error` | `{ integrationId, error }` | Integration error |

#### 💰 Billing Events

| Event | Payload | Description |
|-------|---------|-------------|
| `billing:usage_update` | `{ usage, budgetRemaining }` | Usage meter updated |
| `billing:threshold_reached` | `{ threshold, action }` | Budget threshold hit |
| `billing:limit_reached` | `{ action }` | Budget limit hit |

```json
// billing:threshold_reached
{
  "threshold": 75,
  "currentUsage": 74.50,
  "budgetLimit": 100.00,
  "action": "warning",
  "message": "Kamu sudah menggunakan 75% dari budget bulanan"
}
```

#### 🔔 Notification Events

| Event | Payload | Description |
|-------|---------|-------------|
| `notification` | `Notification` | New notification |
| `notification:read` | `{ notificationId }` | Notification read |

#### 👥 Collaboration Events

| Event | Payload | Description |
|-------|---------|-------------|
| `presence:join` | `{ userId, name, avatar }` | User joined workspace |
| `presence:leave` | `{ userId }` | User left workspace |
| `presence:active` | `{ userId, resource }` | User is viewing a resource |
| `cursor:move` | `{ userId, position }` | User cursor position |
| `comment:new` | `Comment` | New comment posted |
| `comment:updated` | `{ commentId, body }` | Comment edited |
| `comment:deleted` | `{ commentId }` | Comment deleted |

```json
// presence:join
{
  "userId": "uuid",
  "name": "Budi Santoso",
  "avatar": "https://...",
  "joinedAt": "2026-03-31T02:00:00Z"
}
```

#### 📊 System Events

| Event | Payload | Description |
|-------|---------|-------------|
| `system:maintenance` | `{ message, scheduledAt }` | Planned maintenance |
| `system:update` | `{ version, changes }` | System updated |
| `system:announcement` | `{ title, body }` | System announcement |

---

### Client → Server Events

#### 📋 Task Actions

| Event | Payload | Description |
|-------|---------|-------------|
| `task:create` | `{ title, type, input, agentId? }` | Create new task |
| `task:update` | `{ taskId, changes }` | Update task |
| `task:execute` | `{ taskId, mode? }` | Execute task |
| `task:cancel` | `{ taskId }` | Cancel running task |
| `task:delete` | `{ taskId }` | Delete task |
| `task:subscribe` | `{ taskId }` | Subscribe to task updates |
| `task:unsubscribe` | `{ taskId }` | Unsubscribe from task updates |

```json
// task:subscribe
{
  "taskId": "uuid"
}
```

#### 📁 File Actions

| Event | Payload | Description |
|-------|---------|-------------|
| `file:upload_start` | `{ name, size, mimeType }` | Signal upload start |
| `file:upload_chunk` | `{ fileId, chunk, index, total }` | Chunk upload |
| `file:upload_complete` | `{ fileId }` | Upload finished |
| `file:process` | `{ fileId, operations }` | Request AI processing |
| `file:delete` | `{ fileId }` | Delete file |

#### 💬 Collaboration

| Event | Payload | Description |
|-------|---------|-------------|
| `cursor:move` | `{ x, y, resourceId }` | Send cursor position |
| `resource:focus` | `{ resourceId, resourceType }` | User is viewing resource |
| `resource:blur` | `{ resourceId }` | User stopped viewing |
| `comment:create` | `{ resourceType, resourceId, body, parentId? }` | Create comment |
| `comment:update` | `{ commentId, body }` | Edit comment |
| `comment:delete` | `{ commentId }` | Delete comment |

#### ⚙ Session & Settings

| Event | Payload | Description |
|-------|---------|-------------|
| `workspace:switch` | `{ workspaceId }` | Switch active workspace |
| `session:heartbeat` | `{ timestamp }` | Keep-alive ping |
| `settings:update` | `{ key, value }` | Update user setting |

---

## 🔧 Server-Side Implementation

### Event Emitter Service

```typescript
// src/modules/realtime/realtime.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../auth/ws-auth.guard';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN },
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const userId = client.data.userId;
    const workspaceId = client.data.workspaceId;

    // Join workspace room
    await client.join(`workspace:${workspaceId}`);
    await client.join(`user:${userId}`);

    // Notify others
    this.server.to(`workspace:${workspaceId}`).emit('presence:join', {
      userId,
      name: client.data.userName,
      avatar: client.data.avatar,
      joinedAt: new Date().toISOString(),
    });

    // Confirm connection
    client.emit('connected', {
      userId,
      workspaceId,
      sessionId: client.id,
      serverTime: new Date().toISOString(),
    });
  }

  async handleDisconnect(client: Socket) {
    const { userId, workspaceId } = client.data;

    this.server.to(`workspace:${workspaceId}`).emit('presence:leave', {
      userId,
    });
  }

  // ═══════════════════════════════════════
  // Task subscriptions
  // ═══════════════════════════════════════

  @SubscribeMessage('task:subscribe')
  async handleTaskSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { taskId: string },
  ) {
    await client.join(`task:${data.taskId}`);
  }

  @SubscribeMessage('task:unsubscribe')
  async handleTaskUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { taskId: string },
  ) {
    await client.leave(`task:${data.taskId}`);
  }

  // ═══════════════════════════════════════
  // Collaboration
  // ═══════════════════════════════════════

  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { x: number; y: number; resourceId: string },
  ) {
    const workspaceId = client.data.workspaceId;
    client.to(`workspace:${workspaceId}`).emit('cursor:move', {
      userId: client.data.userId,
      ...data,
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Event Emitter Service (for other modules to emit events)
// ═══════════════════════════════════════════════════════════════

@Injectable()
export class RealtimeEmitter {
  constructor(private gateway: RealtimeGateway) {}

  emitToWorkspace(workspaceId: string, event: string, data: any) {
    this.gateway.server.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToTask(taskId: string, event: string, data: any) {
    this.gateway.server.to(`task:${taskId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.gateway.server.to(`user:${userId}`).emit(event, data);
  }

  // Progress update helper
  emitTaskProgress(taskId: string, workspaceId: string, update: TaskProgressUpdate) {
    this.emitToTask(taskId, 'task:progress', update);
    this.emitToWorkspace(workspaceId, 'task:updated', {
      taskId,
      progress: update.progress,
      status: 'running',
    });
  }
}
```

---

## 📊 Client-Side Usage

### React Hook

```typescript
// hooks/useSocket.ts

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';
import { useWorkspaceStore } from '@/stores/workspace';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const { activeWorkspaceId } = useWorkspaceStore();

  useEffect(() => {
    if (!token || !activeWorkspaceId) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token, workspaceId: activeWorkspaceId },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, activeWorkspaceId]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, on, emit, isConnected: socketRef.current?.connected };
}
```

### Task Progress Component

```typescript
// components/TaskProgress.tsx

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface TaskProgressProps {
  taskId: string;
}

export function TaskProgress({ taskId }: TaskProgressProps) {
  const { on, emit } = useSocket();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to task updates
    emit('task:subscribe', { taskId });

    const unsubscribers = [
      on('task:progress', (data) => {
        if (data.taskId === taskId) {
          setProgress(data.progress);
          setMessage(data.message);
        }
      }),

      on('agent:step', (data) => {
        if (data.taskId === taskId) {
          setSteps(prev => [...prev, {
            step: data.step,
            total: data.totalSteps,
            name: data.stepName,
            message: data.message,
          }]);
        }
      }),

      on('task:completed', (data) => {
        if (data.taskId === taskId) {
          setProgress(100);
          setMessage('Selesai!');
        }
      }),

      on('task:failed', (data) => {
        if (data.taskId === taskId) {
          setMessage(`Gagal: ${data.error.message}`);
        }
      }),
    ];

    return () => {
      emit('task:unsubscribe', { taskId });
      unsubscribers.forEach(unsub => unsub());
    };
  }, [taskId, on, emit]);

  return (
    <div className="task-progress">
      <div className="progress-bar">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="message">{message}</p>
      <p className="percent">{progress}%</p>

      {steps.length > 0 && (
        <div className="steps">
          {steps.map((step, i) => (
            <div key={i} className="step">
              <span className="step-num">{step.step}/{step.total}</span>
              <span className="step-name">{step.name}</span>
              <span className="step-msg">{step.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Reconnection & Error Handling

```typescript
// Client-side reconnection strategy
const socket = io(url, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,           // Start with 1s
  reconnectionDelayMax: 30000,       // Max 30s between retries
  randomizationFactor: 0.5,          // Jitter: ±50%
  // Backoff: 1s → 1.5s → 2.25s → ... → 30s (max)

  auth: {
    token: getAccessToken(),
    workspaceId: getActiveWorkspace(),
  },
});

// Handle reconnection
socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
  // Re-subscribe to active tasks
  resubscribeToActiveTasks();
});

socket.on('reconnect_failed', () => {
  console.log('Reconnection failed after max attempts');
  // Show offline mode UI
  showOfflineMode();
});

// Handle auth expiration
socket.on('auth:expired', () => {
  refreshToken().then((newToken) => {
    socket.auth = { token: newToken, workspaceId: getActiveWorkspace() };
    socket.connect();
  });
});
```

---

**🚀 Real-time communication yang reliable dan scalable!**
