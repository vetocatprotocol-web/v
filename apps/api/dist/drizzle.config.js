"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/database/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: 'localhost',
        port: 5432,
        user: 'karyo',
        password: 'password',
        database: 'karyo_os',
        ssl: false,
    },
});
//# sourceMappingURL=drizzle.config.js.map