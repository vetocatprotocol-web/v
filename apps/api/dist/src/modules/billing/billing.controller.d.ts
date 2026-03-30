import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getSubscription(workspaceId: string, req: any): Promise<{
        data: {
            workspaceId: string;
            plan: "free" | "pro" | "enterprise";
            aiTasksToday: number;
            billingBudgetUsd: number;
            billingAlertThresholds: number[];
            billingActionOnLimit: string;
        };
    }>;
    updateSubscription(workspaceId: string, body: {
        plan: string;
    }, req: any): Promise<{
        data: {
            workspaceId: string;
            plan: "free" | "pro" | "enterprise";
            aiTasksToday: number;
            billingBudgetUsd: number;
            billingAlertThresholds: number[];
            billingActionOnLimit: string;
        };
    }>;
    getUsage(workspaceId: string, period: string, req: any): Promise<{
        data: {
            workspaceId: string;
            period: string;
            aiTasksUsed: number;
            aiTaskLimit: number;
            costUsd: string;
            budgetUsd: number;
        };
    }>;
    setBudget(workspaceId: string, body: {
        limit_usd: number;
        alert_thresholds?: number[];
        action_on_limit?: string;
    }, req: any): Promise<{
        data: {
            message: string;
        };
    }>;
}
