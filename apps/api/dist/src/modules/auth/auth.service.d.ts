import { drizzle } from 'drizzle-orm/postgres-js';
export declare class AuthService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
    private issueAccessToken;
    private issueRefreshToken;
    login(email: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            name: string;
            email: string;
            role: "user" | "admin" | "super_admin";
            locale: string;
        };
    }>;
    register(email: string, password: string, name: string, workspace_name?: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            name: string;
            email: string;
            role: "user" | "admin" | "super_admin";
            locale: string;
        };
        workspace_name: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            name: string;
            email: string;
            role: "user" | "admin" | "super_admin";
            locale: string;
        };
    }>;
    validateUserById(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        avatarUrl: string;
        role: "user" | "admin" | "super_admin";
        locale: string;
        emailVerified: boolean;
        lastLoginAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
