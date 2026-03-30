import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  async findAll() {
    return this.db.select().from(users);
  }

  async findOne(id: string) {
    const user = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user[0]) {
      throw new NotFoundException('User not found');
    }
    return user[0];
  }

  async findByEmail(email: string) {
    const user = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user[0];
  }

  async update(id: string, updateData: Partial<typeof users.$inferInsert>) {
    const updated = await this.db.update(users).set(updateData).where(eq(users.id, id)).returning();
    if (!updated[0]) {
      throw new NotFoundException('User not found');
    }
    return updated[0];
  }

  async deleteUserData(userId: string) {
    // TODO: Deep deletion of all related records (workspaces, tasks, files, etc.)
    const deleted = await this.db.delete(users).where(eq(users.id, userId)).returning();
    if (!deleted[0]) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User data deletion queued' };
  }

  async exportUserData(userId: string) {
    // TODO: Implement asynchronous export and email to user
    const user = await this.findOne(userId);
    return {
      message: 'User data export queued',
      payload: user,
    };
  }

  async remove(id: string) {
    const deleted = await this.db.delete(users).where(eq(users.id, id)).returning();
    if (!deleted[0]) {
      throw new NotFoundException('User not found');
    }
    return deleted[0];
  }
}