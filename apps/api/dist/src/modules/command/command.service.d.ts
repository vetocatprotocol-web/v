import { TasksService } from '../tasks/tasks.service';
import { AgentsService } from '../agents/agents.service';
import { FilesService } from '../files/files.service';
export declare class CommandService {
    private tasksService;
    private agentsService;
    private filesService;
    constructor(tasksService: TasksService, agentsService: AgentsService, filesService: FilesService);
    interpret(command: string, workspaceId: string, userId: string, mode: 'manual' | 'agent' | 'hybrid', agentId?: string): Promise<{
        error: unknown;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        title: string;
        description: string;
        type: "manual" | "agent" | "workflow";
        status: "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";
        priority: "low" | "medium" | "high" | "urgent";
        input: unknown;
        output: unknown;
        agentId: string;
        assignedTo: string;
        progress: number;
        costUsd: string;
        modelUsed: string;
        tokensInput: number;
        tokensOutput: number;
        createdBy: string;
        startedAt: Date;
        completedAt: Date;
    }>;
    private extractTitle;
    private extractDescription;
}
