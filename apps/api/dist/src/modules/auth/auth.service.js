"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database_module_1 = require("../../database/database.module");
let AuthService = class AuthService {
    constructor(db) {
        this.db = db;
    }
    issueAccessToken(user) {
        return jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    }
    issueRefreshToken(user) {
        return jwt.sign({
            userId: user.id,
        }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'secret'), { expiresIn: '7d' });
    }
    async login(email, password) {
        const user = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (!user[0] || !(await bcrypt.compare(password, user[0].passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const access_token = this.issueAccessToken(user[0]);
        const refresh_token = this.issueRefreshToken(user[0]);
        return {
            access_token,
            refresh_token,
            expires_in: 3600,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                role: user[0].role,
                locale: user[0].locale,
            },
        };
    }
    async register(email, password, name, workspace_name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const exists = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (exists[0]) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const newUser = await this.db.insert(schema_1.users).values({
            email,
            passwordHash: hashedPassword,
            name,
        }).returning();
        const access_token = this.issueAccessToken(newUser[0]);
        const refresh_token = this.issueRefreshToken(newUser[0]);
        return {
            access_token,
            refresh_token,
            expires_in: 3600,
            user: {
                id: newUser[0].id,
                name: newUser[0].name,
                email: newUser[0].email,
                role: newUser[0].role,
                locale: newUser[0].locale,
            },
            workspace_name,
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'secret'));
            const user = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, payload.userId)).limit(1);
            if (!user[0]) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const access_token = this.issueAccessToken(user[0]);
            const new_refresh_token = this.issueRefreshToken(user[0]);
            return {
                access_token,
                refresh_token: new_refresh_token,
                expires_in: 3600,
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    role: user[0].role,
                    locale: user[0].locale,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token invalid or expired');
        }
    }
    async validateUserById(userId) {
        const user = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        return user[0];
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], AuthService);
//# sourceMappingURL=auth.service.js.map