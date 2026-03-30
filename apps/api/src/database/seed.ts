import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { users, workspaces, workspaceMembers } from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://karyo:password@localhost:5432/karyo_os';
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await db.insert(users).values({
    email: 'admin@karyo-os.com',
    passwordHash: '$2b$10$13ul3BiI9mjxaeb1.LVVjOd3Df0mTc32JG9sYQAgHvlREq47fYakG',
    name: 'Admin User',
    role: 'super_admin',
  }).returning();

  // Create workspace
  const workspace = await db.insert(workspaces).values({
    name: 'Demo Workspace',
    slug: 'demo',
    ownerId: adminUser[0].id,
  }).returning();

  // Add member
  await db.insert(workspaceMembers).values({
    workspaceId: workspace[0].id,
    userId: adminUser[0].id,
    role: 'owner',
  });

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch(console.error);