"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let EventsGateway = class EventsGateway {
    constructor(jwtService, db) {
        this.jwtService = jwtService;
        this.db = db;
        this.logger = new common_1.Logger('EventsGateway');
    }
    async handleConnection(client, ...args) {
        try {
            const token = client.handshake.auth.token;
            const workspaceId = client.handshake.auth.workspaceId;
            if (!token || !workspaceId) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.userId;
            const member = await this.db.select()
                .from(schema_1.workspaceMembers)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
                .limit(1);
            if (!member[0]) {
                client.emit('error', { code: 'ACCESS_DENIED', message: 'No access to workspace' });
                client.disconnect();
                return;
            }
            client.data.userId = userId;
            client.data.workspaceId = workspaceId;
            client.join(`workspace:${workspaceId}`);
            client.join(`user:${userId}`);
            client.emit('connected', {
                userId,
                workspaceId,
                sessionId: client.id,
                serverTime: new Date().toISOString(),
            });
            this.logger.log(`Client connected: ${client.id} (user: ${userId}, workspace: ${workspaceId})`);
        }
        catch (error) {
            this.logger.error(`Connection failed: ${error.message}`);
            client.emit('error', { code: 'AUTH_FAILED', message: 'Authentication failed' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    emitTaskCreated(workspaceId, task) {
        this.server.to(`workspace:${workspaceId}`).emit('task:created', task);
    }
    emitTaskUpdated(workspaceId, taskId, updates) {
        this.server.to(`workspace:${workspaceId}`).emit('task:updated', { taskId, ...updates });
    }
    emitTaskStatusChanged(workspaceId, taskId, status, previousStatus) {
        this.server.to(`workspace:${workspaceId}`).emit('task:status_changed', {
            taskId,
            status,
            previousStatus,
        });
    }
    emitTaskProgress(workspaceId, taskId, progress, message, details) {
        this.server.to(`workspace:${workspaceId}`).emit('task:progress', {
            taskId,
            progress,
            message,
            details,
            timestamp: new Date().toISOString(),
        });
    }
    emitTaskCompleted(workspaceId, taskId, output, cost) {
        this.server.to(`workspace:${workspaceId}`).emit('task:completed', {
            taskId,
            output,
            cost,
            completedAt: new Date().toISOString(),
        });
    }
    emitTaskFailed(workspaceId, taskId, error) {
        this.server.to(`workspace:${workspaceId}`).emit('task:failed', {
            taskId,
            error,
            failedAt: new Date().toISOString(),
        });
    }
    emitAgentStarted(workspaceId, taskId, agentId) {
        this.server.to(`workspace:${workspaceId}`).emit('agent:started', {
            taskId,
            agentId,
        });
    }
    emitAgentStep(workspaceId, taskId, step, totalSteps, message) {
        this.server.to(`workspace:${workspaceId}`).emit('agent:step', {
            taskId,
            step,
            totalSteps,
            message,
            timestamp: new Date().toISOString(),
        });
    }
    emitAgentCompleted(workspaceId, taskId, agentId, output) {
        this.server.to(`workspace:${workspaceId}`).emit('agent:completed', {
            taskId,
            agentId,
            output,
        });
    }
    emitAgentThinking(workspaceId, taskId, message) {
        this.server.to(`workspace:${workspaceId}`).emit('agent:thinking', {
            taskId,
            message,
            timestamp: new Date().toISOString(),
        });
    }
    emitFileUploaded(workspaceId, file) {
        this.server.to(`workspace:${workspaceId}`).emit('file:uploaded', file);
    }
    emitFileProcessing(workspaceId, fileId, operation, progress, message) {
        this.server.to(`workspace:${workspaceId}`).emit('file:processing', {
            fileId,
            operation,
            progress,
            message,
            timestamp: new Date().toISOString(),
        });
    }
    emitFileProcessed(workspaceId, fileId, result) {
        this.server.to(`workspace:${workspaceId}`).emit('file:processed', {
            fileId,
            result,
        });
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3004', 'http://localhost:3005'],
            credentials: true,
        },
        namespace: '/',
    }),
    __param(1, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [jwt_1.JwtService, void 0])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map