import { betterAuth } from "better-auth";
import { pgAdapter } from "better-auth/adapters/pg";
import { Pool } from "pg";

export const auth = betterAuth({
    database: pgAdapter(new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    })),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
});
