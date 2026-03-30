import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  private issueAccessToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
    );
  }

  private issueRefreshToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'secret'),
      { expiresIn: '7d' },
    );
  }

  async login(email: string, password: string) {
    const user = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user[0] || !(await bcrypt.compare(password, user[0].passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
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

  async register(email: string, password: string, name: string, workspace_name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const exists = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (exists[0]) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = await this.db.insert(users).values({
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

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'secret')) as any;
      const user = await this.db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
      if (!user[0]) {
        throw new UnauthorizedException('Invalid refresh token');
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
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }

  async validateUserById(userId: string) {
    const user = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user[0];
  }

  async logout() {
    // Stateless JWT logout cannot invalidate token without a token store.
    // Placeholder for future implementation (revocation list).
    return { message: 'Logged out successfully' };
  }
}