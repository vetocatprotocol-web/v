import { MemoryService } from './memory.service';
export declare class MemoryController {
    private readonly memoryService;
    constructor(memoryService: MemoryService);
    findAll(req: any, workspaceId: string, type?: string, key?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            type: "behavior" | "preference" | "pattern" | "context";
            key: string;
            value: unknown;
            source: "observed" | "explicit" | "inferred";
        }[];
    }>;
    create(req: any, workspaceId: string, body: {
        type: string;
        key: string;
        value: any;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            type: "behavior" | "preference" | "pattern" | "context";
            key: string;
            value: unknown;
            source: "observed" | "explicit" | "inferred";
        };
    }>;
    search(req: any, workspaceId: string, body: {
        query: string;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            type: "behavior" | "preference" | "pattern" | "context";
            key: string;
            value: unknown;
            source: "observed" | "explicit" | "inferred";
        }[];
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
