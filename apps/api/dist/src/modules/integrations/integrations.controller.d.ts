import { IntegrationsService } from './integrations.service';
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    list(workspaceId: string, req: any): Promise<{
        data: {
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
        }[];
    }>;
    connect(provider: string, workspaceId: string, req: any): Promise<{
        data: {
            oauth_url: string;
            state: string;
        };
    }>;
    callback(provider: string, workspaceId: string, body: {
        code: string;
        state: string;
    }, req: any): Promise<{
        data: {
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
        };
    }>;
    sync(integrationId: string, req: any): Promise<{
        message: string;
    }>;
    disconnect(integrationId: string, req: any): Promise<{
        message: string;
    }>;
}
