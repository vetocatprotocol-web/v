import { drizzle } from 'drizzle-orm/postgres-js';
export declare class MarketplaceService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    private ensureWorkspaceMember;
    getAgents(filters?: {
        page?: number;
        perPage?: number;
        category?: string;
        sort?: string;
    }): Promise<{
        data: any;
        page: number;
        perPage: number;
    }>;
    installAgent(workspaceId: string, agentId: string, userId: string): Promise<{
        id: string;
        workspaceId: string;
        agentId: string;
        installedBy: string;
        installedAt: Date;
    }>;
}
