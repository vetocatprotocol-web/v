import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { drizzle } from 'drizzle-orm/postgres-js';
interface AuthenticatedSocket extends Socket {
    data: {
        userId: string;
        workspaceId: string;
    };
}
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private db;
    server: Server;
    private logger;
    constructor(jwtService: JwtService, db: ReturnType<typeof drizzle>);
    handleConnection(client: AuthenticatedSocket, ...args: any[]): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    emitTaskCreated(workspaceId: string, task: any): void;
    emitTaskUpdated(workspaceId: string, taskId: string, updates: any): void;
    emitTaskStatusChanged(workspaceId: string, taskId: string, status: string, previousStatus: string): void;
    emitTaskProgress(workspaceId: string, taskId: string, progress: number, message: string, details?: any): void;
    emitTaskCompleted(workspaceId: string, taskId: string, output: any, cost: any): void;
    emitTaskFailed(workspaceId: string, taskId: string, error: any): void;
    emitAgentStarted(workspaceId: string, taskId: string, agentId: string): void;
    emitAgentStep(workspaceId: string, taskId: string, step: number, totalSteps: number, message: string): void;
    emitAgentCompleted(workspaceId: string, taskId: string, agentId: string, output: any): void;
    emitAgentThinking(workspaceId: string, taskId: string, message: string): void;
    emitFileUploaded(workspaceId: string, file: any): void;
    emitFileProcessing(workspaceId: string, fileId: string, operation: string, progress: number, message: string): void;
    emitFileProcessed(workspaceId: string, fileId: string, result: any): void;
}
export {};
