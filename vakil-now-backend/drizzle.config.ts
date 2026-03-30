import { Config, defineConfig } from 'drizzle-kit';
import 'dotenv/config';


export default defineConfig ({
  schema: './src/db/schema.ts',
  out: './src/db',
  dialect: 'mysql',
   dbCredentials: {
  host: process.env.DB_HOST || "" ,
  user: process.env.DB_USER || "" ,
  password: process.env.DB_PASSWORD || "" ,
  database: process.env.DB_NAME || "vakil-now" ,
}
});