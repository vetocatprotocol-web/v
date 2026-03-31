import { CommandService } from './command.service';
export declare class CommandController {
    private commandService;
    constructor(commandService: CommandService);
    interpret(body: {
        command: string;
        workspaceId: string;
        mode: 'manual' | 'agent' | 'hybrid';
        agentId?: string;
    }, req: any): Promise<{
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
}
