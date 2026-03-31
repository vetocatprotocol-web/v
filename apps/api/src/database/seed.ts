import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://karyo:password@localhost:5432/karyo_os';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // Check if admin user already exists
  const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'admin@karyo-os.com')).limit(1);
  
  let adminUser;
  if (existingUser.length === 0) {
    // Create admin user
    adminUser = await db.insert(schema.users).values({
      email: 'admin@karyo-os.com',
      passwordHash: '$2b$10$13ul3BiI9mjxaeb1.LVVjOd3Df0mTc32JG9sYQAgHvlREq47fYakG',
      name: 'Admin User',
      role: 'super_admin',
    }).returning();
  } else {
    adminUser = existingUser;
  }

  // Check if workspace already exists
  const existingWorkspace = await db.select().from(schema.workspaces).where(eq(schema.workspaces.slug, 'demo')).limit(1);
  
  let workspace;
  if (existingWorkspace.length === 0) {
    // Create workspace
    workspace = await db.insert(schema.workspaces).values({
      name: 'Demo Workspace',
      slug: 'demo',
      ownerId: adminUser[0].id,
      plan: 'free',
      settings: {},
      storageUsedBytes: 0,
      aiTasksToday: 0,
    }).returning();
  } else {
    workspace = existingWorkspace;
  }

  // Check if member already exists
  const existingMember = await db.select().from(schema.workspaceMembers).where(and(
    eq(schema.workspaceMembers.workspaceId, workspace[0].id),
    eq(schema.workspaceMembers.userId, adminUser[0].id)
  )).limit(1);

  if (existingMember.length === 0) {
    // Add member
    await db.insert(schema.workspaceMembers).values({
      workspaceId: workspace[0].id,
      userId: adminUser[0].id,
      role: 'owner',
    });
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch(console.error);