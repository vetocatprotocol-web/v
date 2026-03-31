export declare class ObservabilityService {
    private logs;
    private metrics;
    log(level: 'info' | 'warn' | 'error', message: string, details?: any): void;
    increment(metric: keyof ObservabilityService['metrics'], count?: number): void;
    getLogs(limit?: number): {
        timestamp: string;
        level: "info" | "warn" | "error";
        message: string;
        details?: any;
    }[];
    getMetrics(): {
        [key: string]: number;
    };
}
