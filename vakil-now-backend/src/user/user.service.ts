import { Injectable, Inject, BadRequestException  } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import {  MySqlDatabase } from 'drizzle-orm/mysql2';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySqlDatabase<any,any>,
  ) {}



  async findByEmail(email: string, tx = this.db) {
    if (!email) return null;
    const user = await tx
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    return user[0];
  }

  async findByPhone(phone:string, tx = this.db) {
     if (!phone) return null;    
    const user = await tx
      .select()
      .from(schema.usersP)
      .where(eq(schema.usersP.phone, phone));
    return user[0];
  }

    async createUserByPhone({ phone }: { phone: string },  tx = this.db) {
    try {
      // Insert and get ID
      const [inserted] = await tx
        .insert(schema.usersP)
        .values({
          phone
        })
        .$returningId();

      // Fetch full user details
      const [user] = await tx
        .select()
        .from(schema.usersP)
        .where(eq(schema.usersP.id, inserted.id));

      return user || null;
    } catch (error) {
      throw new BadRequestException('Error creating user by phone');
    }
  }

  async createUser(data : { name: string; email: string; password: string },tx= this.db) {
    if (!data.email || !data.name || !data.password) return null;
    const { email, name, password } = data;
    const user = await tx
      .insert(schema.users)
      .values({ email, name, password })
      .$returningId();
      
    return user[0];
  }

  async updateRefreshToken(userId: string, refreshToken: string , tx = this.db) {
    await tx
      .update(schema.users)
      .set({ refreshToken })
      .where(eq(schema.users.id, userId));
  }

  async updateRefreshTokenInPhone(userId: string, refreshToken: string , tx = this.db) {
    await tx
      .update(schema.usersP)
      .set({ refreshToken })
      .where(eq(schema.usersP.id, userId));
  }

  async findByIdInPhone(userId: string){
     if (!userId) return null;
    const user = await this.db
      .select()
      .from(schema.usersP)
      .where(eq(schema.usersP.id, userId));
    return user[0];
  }

  async findById(userId: string, tx=this.db) {
    if (!userId) return null;
    const user = await tx
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));
    return user[0];
  }

  
}