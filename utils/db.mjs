import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // ⭐ จำเป็นสำหรับ Supabase
  },
});

export default connectionPool;
