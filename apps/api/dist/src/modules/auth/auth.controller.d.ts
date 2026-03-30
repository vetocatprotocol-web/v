import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
    register(body: {
        email: string;
        password: string;
        name: string;
        workspace_name?: string;
    }): Promise<{
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
    refresh(body: {
        refresh_token: string;
    }): Promise<{
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
    logout(): Promise<{
        message: string;
    }>;
    me(req: any): Promise<{
        data: {
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
        };
    }>;
}
