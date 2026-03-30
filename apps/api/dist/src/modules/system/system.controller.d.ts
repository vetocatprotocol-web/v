export declare class SystemController {
    health(): {
        status: string;
        version: string;
        uptime: number;
        services: {
            database: string;
            redis: string;
        };
    };
}
