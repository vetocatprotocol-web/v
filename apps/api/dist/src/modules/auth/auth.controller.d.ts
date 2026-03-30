import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
}
