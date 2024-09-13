import dotenv from "dotenv";
import { Pool } from "pg"; // TypeScript will infer the types from here

dotenv.config();

// Ensure type safety for environment variables
const PG_USER = process.env.PG_USER as string;
const PG_HOST = process.env.PG_HOST as string;
const PG_DATABASE = process.env.PG_DATABASE as string;
const PG_PASSWORD = process.env.PG_PASSWORD as string;
const PG_PORT = parseInt(process.env.PG_PORT as string, 10); // Convert to number

// Throw an error if any required env variable is missing
if (!PG_USER || !PG_HOST || !PG_DATABASE || !PG_PASSWORD || isNaN(PG_PORT)) {
    throw new Error('Missing or invalid PostgreSQL environment variables');
}

// Configure PostgreSQL connection pool
export const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT, // Use the parsed number for port
});
