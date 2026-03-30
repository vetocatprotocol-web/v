"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema_1 = require("./schema");
const connectionString = process.env.DATABASE_URL || 'postgresql://karyo:password@localhost:5432/karyo_os';
const client = postgres(connectionString);
const db = (0, postgres_js_1.drizzle)(client);
async function seed() {
    console.log('Seeding database...');
    const adminUser = await db.insert(schema_1.users).values({
        email: 'admin@karyo-os.com',
        passwordHash: '$2b$10$13ul3BiI9mjxaeb1.LVVjOd3Df0mTc32JG9sYQAgHvlREq47fYakG',
        name: 'Admin User',
        role: 'super_admin',
    }).returning();
    const workspace = await db.insert(schema_1.workspaces).values({
        name: 'Demo Workspace',
        slug: 'demo',
        ownerId: adminUser[0].id,
    }).returning();
    await db.insert(schema_1.workspaceMembers).values({
        workspaceId: workspace[0].id,
        userId: adminUser[0].id,
        role: 'owner',
    });
    console.log('Seeding completed!');
    process.exit(0);
}
seed().catch(console.error);
//# sourceMappingURL=seed.js.map