import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
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

  async login(email: string, password: string) {
    const user = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user[0] || !(await bcrypt.compare(password, user[0].passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return { token, user: { id: user[0].id, name: user[0].name, email: user[0].email } };
  }

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await this.db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      name,
    }).returning();

    return { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email };
  }
}