import { MarketplaceService } from './marketplace.service';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    listAgents(page?: number, perPage?: number, category?: string, sort?: string): Promise<{
        data: any;
        page: number;
        perPage: number;
    }>;
    installAgent(agentId: string, workspaceId: string, req: any): Promise<{
        data: {
            id: string;
            workspaceId: string;
            agentId: string;
            installedBy: string;
            installedAt: Date;
        };
    }>;
}
