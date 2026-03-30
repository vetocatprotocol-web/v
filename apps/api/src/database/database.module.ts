import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL || 'postgresql://karyo:password@localhost:5432/karyo_os';
        const client = postgres(connectionString);
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}