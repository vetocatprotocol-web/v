import { drizzle } from 'drizzle-orm/postgres-js';
import { workspaces } from '../../database/schema';
export declare class WorkspacesService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
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
    findByUser(userId: string): Promise<{
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
    create(createWorkspaceDto: {
        name: string;
        ownerId: string;
        slug?: string;
    }): Promise<{
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
    update(id: string, updateData: Partial<typeof workspaces.$inferInsert>): Promise<{
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
    addMember(workspaceId: string, userId: string, role?: string): Promise<{
        id: string;
        role: "admin" | "owner" | "editor" | "viewer";
        workspaceId: string;
        userId: string;
        invitedBy: string;
        joinedAt: Date;
    }[]>;
    removeMember(workspaceId: string, userId: string): Promise<{
        id: string;
        role: "admin" | "owner" | "editor" | "viewer";
        workspaceId: string;
        userId: string;
        invitedBy: string;
        joinedAt: Date;
    }[]>;
}
