// src/drizzle/drizzle.provider.ts
import * as schema from '../db/schema';
import { ConfigService } from '@nestjs/config';
import { drizzle,MySqlDatabase } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const connectionUri = configService.get<string>('DATABASE_URL');
     const pool = createPool({
        host: configService.get<string>('DB_HOST'),
        user: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        port: configService.get<number>('DB_PORT') || 3306,
      });

      const db: MySqlDatabase<any,any,typeof schema> = drizzle(pool, {
        schema,
        mode: 'default',
      });
      return db;
    },
  },
];