import { drizzle } from 'drizzle-orm/postgres-js';
export declare class MemoryService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    private ensureWorkspaceMember;
    findAll(workspaceId: string, userId: string, type?: string, key?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        userId: string;
        type: "behavior" | "preference" | "pattern" | "context";
        key: string;
        value: unknown;
        source: "observed" | "explicit" | "inferred";
    }[]>;
    create(workspaceId: string, userId: string, data: {
        type: string;
        key: string;
        value: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        userId: string;
        type: "behavior" | "preference" | "pattern" | "context";
        key: string;
        value: unknown;
        source: "observed" | "explicit" | "inferred";
    }>;
    search(workspaceId: string, userId: string, query: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        userId: string;
        type: "behavior" | "preference" | "pattern" | "context";
        key: string;
        value: unknown;
        source: "observed" | "explicit" | "inferred";
    }[]>;
    remove(memoryId: string, userId: string): Promise<{
        message: string;
    }>;
}
