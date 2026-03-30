import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from '../../database/schema';
export declare class UsersService {
    private db;
    constructor(db: ReturnType<typeof drizzle>);
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
    findByEmail(email: string): Promise<{
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
    update(id: string, updateData: Partial<typeof users.$inferInsert>): Promise<{
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
    deleteUserData(userId: string): Promise<{
        message: string;
    }>;
    exportUserData(userId: string): Promise<{
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
