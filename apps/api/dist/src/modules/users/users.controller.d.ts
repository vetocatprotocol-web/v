import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
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
    }[]>;
    findMe(req: any): Promise<{
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
    updateMe(req: any, updateUserDto: any): Promise<{
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
    exportMeData(req: any): Promise<{
        message: string;
        payload: {
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
    deleteMeData(req: any, body: {
        confirmation: string;
    }): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, updateUserDto: any): Promise<{
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
    remove(id: string): Promise<{
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
}
