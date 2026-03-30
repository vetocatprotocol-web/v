import { drizzle } from 'drizzle-orm/postgres-js';
export declare class AuthService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    register(email: string, password: string, name: string): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
}
