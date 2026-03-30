import { Injectable, Inject, BadRequestException  } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import {  MySqlDatabase } from 'drizzle-orm/mysql2';
import * as schema from '../../db/schema';
import { eq, count } from 'drizzle-orm';

@Injectable()
export class UserService {
constructor(
    @Inject(DrizzleAsyncProvider) private db: MySqlDatabase<any,any>,
  ) {}


   async getTotalLawyers() {
     try {
    const result = await this.db
      .select({ totalLawyers: count() })
      .from(schema.users)
      .where(eq(schema.users.type, 'LAWYER'));
    return { totalLawyers: result[0].totalLawyers };
     } catch (error) {
    throw new BadRequestException('Failed to fetch lawyer count');
  }
  }

async getUser(userId: string) {
   try {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);
    return user[0];
      } catch (error) {
    throw new BadRequestException('Failed to fetch user');
  }
  }


  async getTotalUsers() {

    const all = await this.db.select().from(schema.users);
     try {
    const result = await this.db
      .select({ totalUsers: count() })
      .from(schema.users)
      .where(eq(schema.users.type, 'USER'));
    return { totalUsers: result[0].totalUsers };
     } catch (error) {
    throw new BadRequestException('Failed to fetch user count');
  }
  }


     async findByPhone(phone:string, tx = this.db) {
     if (!phone) return null;    
    const user = await tx
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, phone));
    return user[0];
  }

   async findByIdInPhone(userId: string){
     if (!userId) return null;
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));
    return user[0];
  }

 async updateRefreshTokenInPhone(userId: string, refreshToken: string , tx = this.db) {
    await tx
      .update(schema.users)
      .set({ refreshToken })
      .where(eq(schema.users.id, userId));
  }

  async createUserByPhone({ phone  , type}: { phone: string , type:'ADMIN' | 'USER' | 'LAWYER' },  tx = this.db) {
    try {
      // Insert and get ID
      const [inserted] = await tx
        .insert(schema.users)
        .values({
          phone,
          type
        })
        .$returningId();

      // Fetch full user details
      const [user] = await tx
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, inserted.id));

      return user || null;
    } catch (error) {
      throw new BadRequestException('Error creating user by phone');
    }
  }


  async updateUserEmail({phone,email}: {phone:string , email:string}, tx = this.db) {
    await tx
      .update(schema.users)
      .set({ email })
      .where(eq(schema.users.phone, phone));
  }
}
