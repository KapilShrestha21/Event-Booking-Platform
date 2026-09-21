import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ticketDB',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    options: "-c timezone=UTC",
})

pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err);
    
})

export default pool;