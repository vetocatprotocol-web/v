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
