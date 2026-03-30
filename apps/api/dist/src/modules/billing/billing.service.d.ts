import { drizzle } from 'drizzle-orm/postgres-js';
export declare class BillingService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    private ensureWorkspaceMember;
    getSubscription(workspaceId: string, userId: string): Promise<{
        workspaceId: string;
        plan: "free" | "pro" | "enterprise";
        aiTasksToday: number;
        billingBudgetUsd: number;
        billingAlertThresholds: number[];
        billingActionOnLimit: string;
    }>;
    updateSubscription(workspaceId: string, userId: string, plan: string): Promise<{
        workspaceId: string;
        plan: "free" | "pro" | "enterprise";
        aiTasksToday: number;
        billingBudgetUsd: number;
        billingAlertThresholds: number[];
        billingActionOnLimit: string;
    }>;
    getUsage(workspaceId: string, userId: string, period?: string): Promise<{
        workspaceId: string;
        period: string;
        aiTasksUsed: number;
        aiTaskLimit: number;
        costUsd: string;
        budgetUsd: number;
    }>;
    setBudget(workspaceId: string, userId: string, limitUsd: number, alertThresholds?: number[], actionOnLimit?: string): Promise<{
        message: string;
    }>;
}
