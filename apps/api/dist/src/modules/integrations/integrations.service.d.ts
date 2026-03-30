import { drizzle } from 'drizzle-orm/postgres-js';
export declare class IntegrationsService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    private ensureWorkspaceMember;
    list(workspaceId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        status: "connected" | "disconnected" | "error" | "syncing";
        config: unknown;
        provider: "google_drive" | "slack" | "gmail" | "airtable" | "stripe" | "dropbox";
        accessToken: string;
        refreshToken: string;
        syncStatus: "connected" | "disconnected" | "error" | "syncing";
        lastSyncedAt: Date;
    }[]>;
    connect(workspaceId: string, userId: string, provider: string): Promise<{
        oauth_url: string;
        state: string;
    }>;
    callback(workspaceId: string, userId: string, provider: string, code: string, state: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        status: "connected" | "disconnected" | "error" | "syncing";
        config: unknown;
        provider: "google_drive" | "slack" | "gmail" | "airtable" | "stripe" | "dropbox";
        accessToken: string;
        refreshToken: string;
        syncStatus: "connected" | "disconnected" | "error" | "syncing";
        lastSyncedAt: Date;
    }>;
    triggerSync(integrationId: string, userId: string): Promise<{
        message: string;
    }>;
    disconnect(integrationId: string, userId: string): Promise<{
        message: string;
    }>;
}
