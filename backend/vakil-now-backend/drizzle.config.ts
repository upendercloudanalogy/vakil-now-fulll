import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


export default defineConfig ({
  schema: './src/db/schema.ts',
  out: './src/db',
  dialect: 'mysql',
   dbCredentials: {
  host: process.env.DB_HOST || "" ,
  user: process.env.DB_USER || "" ,
  password: process.env.DB_PASSWORD || "" ,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME || "" ,
  ssl: {
  rejectUnauthorized: false
}

},
});