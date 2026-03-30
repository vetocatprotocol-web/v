import { WorkspacesService } from './workspaces.service';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    create(createWorkspaceDto: {
        name: string;
        slug?: string;
    }, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }[]>;
    findByUser(req: any): Promise<{
        role: "admin" | "owner" | "editor" | "viewer";
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }>;
    update(id: string, updateWorkspaceDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        plan: "free" | "pro" | "enterprise";
        settings: unknown;
        storageUsedBytes: number;
        aiTasksToday: number;
        aiTasksResetAt: Date;
    }>;
    addMember(id: string, body: {
        userId: string;
        role?: string;
    }): Promise<{
        id: string;
        role: "admin" | "owner" | "editor" | "viewer";
        workspaceId: string;
        userId: string;
        invitedBy: string;
        joinedAt: Date;
    }[]>;
    removeMember(id: string, userId: string): Promise<{
        id: string;
        role: "admin" | "owner" | "editor" | "viewer";
        workspaceId: string;
        userId: string;
        invitedBy: string;
        joinedAt: Date;
    }[]>;
}
