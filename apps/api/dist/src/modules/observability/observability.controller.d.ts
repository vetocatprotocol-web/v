import { ObservabilityService } from './observability.service';
export declare class ObservabilityController {
    private readonly observabilityService;
    constructor(observabilityService: ObservabilityService);
    getLogs(limit?: number): {
        data: {
            timestamp: string;
            level: "info" | "warn" | "error";
            message: string;
            details?: any;
        }[];
    };
    getMetrics(): {
        data: {
            [key: string]: number;
        };
    };
}
