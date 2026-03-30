import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { and, eq, gt, ne } from 'drizzle-orm';
import { MySqlDatabase } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { EmailService } from 'src/global/email/email.service';
import * as schema from '../../db/schema';
import { UserService } from '../user/user.service';
import { VerifyOtpDto } from './dto/verifyOtpDto.dto';
dotenv.config();


@Injectable()
export class AuthService {
  constructor (private jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly emailservice: EmailService,
    @Inject(DrizzleAsyncProvider) private readonly db: MySqlDatabase<any, any>,
  ) { }

  async verifyEmail (token: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.verificationToken, token));

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }


    if (user.verificationExpiresAt && new Date() > new Date(user.verificationExpiresAt)) {
      throw new BadRequestException('Verification link has expired. Please request a new one.');
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }


    await this.db
      .update(schema.users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id));

    return { message: 'Email verified successfully' };
  }

  // async handleSocialLogin(profile: any, provider: string, ip: string, device: string, platform: string) {
  //   const { email, name, picture } = profile;
  //   if (!email) throw new BadRequestException('Email not provided by provider');

  //   const [existingUser] = await this.db
  //     .select({
  //       id: users.id,
  //       email: users.email,
  //       name: users.name,
  //       role_id: users.role_id,
  //       role_name: roles.name,
  //     })
  //     .from(users)
  //     .leftJoin(roles, eq(users.role_id, roles.id))
  //     .where(eq(users.email, email.toLowerCase()));

  //   let user = existingUser;

  //   if (!user) {
  //     const [defaultRole] = await this.db
  //       .select()
  //       .from(roles)
  //       .where(eq(roles.id, 4)); // default User role

  //     const [newUser] = await this.db
  //       .insert(users)
  //       .values({
  //         name,
  //         email: email.toLowerCase(),
  //         password: '',
  //         signup_source: provider,
  //         platform,
  //         email_verified: true,
  //         role_id: defaultRole.id,
  //         created_at: new Date(),
  //         updated_at: new Date(),
  //       })
  //       .$returning({
  //         id: users.id,
  //         email: users.email,
  //         name: users.name,
  //         role_id: users.role_id,
  //       });

  //     user = { ...newUser, role_name: defaultRole.name };
  //   }

  //   await this.db
  //     .update(users)
  //     .set({
  //       ip_address: ip,
  //       device_info: device,
  //       platform,
  //       last_login: new Date(),
  //     })
  //     .where(eq(users.id, user.id));

  //   // ✅ Reuse shared generator
  //   const tokens = await this.generateTokens(user, platform);

  //   return {
  //     message: `Logged in with ${provider}`,
  //     ...tokens,
  //     user: {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       picture,
  //     },
  //   };
  // }

  // private async generateTokens(user: any, platform: string) {
  //   // ✅ Fetch role permissions (only if not passed in)
  //   const rolePermissions = await this.db
  //     .select({ permission: permissions.name })
  //     .from(role_permissions)
  //     .innerJoin(permissions, eq(role_permissions.permission_id, permissions.id))
  //     .where(eq(role_permissions.role_id, user.role_id));

  //   const permissionList = rolePermissions.map((p: any) => p.permission);

  //   // ✅ Common payload
  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //     platform,
  //     role: user.role_name,
  //     role_id: user.role_id,
  //     permissions: permissionList,
  //   };

  //   const accessToken = this.jwtService.sign(payload, {
  //     expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
  //     secret: this.configService.get('JWT_ACCESS_SECRET'),
  //   });

  //   const refreshToken = this.jwtService.sign(payload, {
  //     expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
  //     secret: this.configService.get('JWT_REFRESH_SECRET'),
  //   });

  //   return { accessToken, refreshToken, payload };
  // }

  // private async generateTokens(user: any, platform: string, rememberMe = false) {
  //   // ✅ Fetch role permissions
  //   const rolePermissions = await this.db
  //     .select({ permission: permissions.name })
  //     .from(role_permissions)
  //     .innerJoin(permissions, eq(role_permissions.permission_id, permissions.id))
  //     .where(eq(role_permissions.role_id, user.role_id));

  //   const permissionList = rolePermissions.map((p: any) => p.permission);

  //   // ✅ Common payload for both tokens
  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //     platform,
  //     role: user.role_name,
  //     role_id: user.role_id,
  //     permissions: permissionList,
  //   };

  //   // ✅ Access Token (short-lived)
  //   const accessToken = this.jwtService.sign(payload, {
  //     expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
  //     secret: this.configService.get('JWT_ACCESS_SECRET'),
  //   });

  //   // ✅ Refresh Token (adjust lifespan if "Remember Me" is true)
  //   const refreshExpiresIn = rememberMe
  //     ? this.configService.get('JWT_REMEMBER_EXPIRES_IN') || '30d'
  //     : this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';

  //   const refreshToken = this.jwtService.sign(
  //     {
  //       ...payload,
  //       type: 'refresh',
  //     },
  //     {
  //       expiresIn: refreshExpiresIn,
  //       secret: this.configService.get('JWT_REFRESH_SECRET'),
  //     },
  //   );

  //   return {
  //     accessToken,
  //     refreshToken,
  //     rememberMe,
  //     accessExpiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
  //     refreshExpiresIn,
  //   };
  // }


  // async verifyHcaptcha(token: string): Promise<boolean> {
  //   if (!token) {
  //     throw new BadRequestException('Captcha token is missing');
  //   }

  //   const secret = this.configService.get<string>('HCAPTCHA_SECRET_KEY');
  //   const verifyUrl =
  //     this.configService.get<string>('HCAPTCHA_VERIFY_URL', "")

  //   if (!secret) {
  //     throw new BadRequestException('hCaptcha secret key is not configured');
  //   }

  //   try {
  //     const { data } = await axios.post(
  //       verifyUrl,
  //       null,
  //       {
  //         params: {
  //           secret,
  //           response: token,
  //         },
  //       },
  //     );

  //     if (data.success) return true;

  //     console.warn('hCaptcha verification failed:', data['error-codes']);
  //     return false;

  //   } catch (error) {
  //     console.error('hCaptcha verification error:', error.response?.data || error.message);
  //     throw new BadRequestException('Failed to verify hCaptcha');
  //   }
  // }
  // async verifyPhoneOtp(phone: string, otp: string) {
  //   const [user] = await this.db.select().from(users).where(eq(users.phone, phone));
  //   if (!user) throw new BadRequestException('User not found');

  //   if (!user.phone_otp || user.phone_otp !== otp)
  //     throw new BadRequestException('Invalid OTP');

  //   if (new Date() > new Date(user.otp_expires_at))
  //     throw new BadRequestException('OTP expired');

  //   // Mark phone as verified
  //   await this.db
  //     .update(users)
  //     .set({
  //       phone_verified: true,
  //       phone_otp: null,
  //       otp_expires_at: null,
  //     })
  //     .where(eq(users.id, user.id));

  //   return { message: 'Phone verified successfully' };
  // }



  async updateUser (req: any) {
    const {
      name,
      email,
      password,
      signupSource,
      referralCode,
      utmSource,
      utmCampaign,

    } = req?.body;

    const userId = req?.userId;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const ipAddress =
      req?.ip ||
      req?.headers['x-forwarded-for'] ||
      req?.connection?.remoteAddress ||
      null;

    const deviceInfo = req?.headers['user-agent'] || null;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new BadRequestException('Valid name is required');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Valid email address is required');
    }

    if (password && password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    try {
      const result = await this.db.transaction(async (tx) => {
        const [existingUser] = await tx
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .for('update');

        if (!existingUser) {
          throw new BadRequestException('User not found');
        }

        const emailExists = await tx
          .select()
          .from(schema.users)
          .where(
            and(eq(schema.users.email, email), ne(schema.users.id, userId))
          );

        if (emailExists.length > 0) {
          throw new BadRequestException('Email already exists');
        }

        let hashedPassword = existingUser.password;
        if (password && password !== existingUser.password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        const updateData: any = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          signupSource: signupSource || existingUser.signupSource,
          referralCode: referralCode || existingUser.referralCode,
          utmSource: utmSource || existingUser.utmSource,
          utmCampaign: utmCampaign || existingUser.utmCampaign,
          ipAddress,
          deviceInfo,
          updatedAt: new Date(),
        };

        await tx
          .update(schema.users)
          .set(updateData)
          .where(eq(schema.users.id, userId));

        const [updatedUser] = await tx
          .select({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            signupSource: schema.users.signupSource,
            referralCode: schema.users.referralCode,
            utmSource: schema.users.utmSource,
            utmCampaign: schema.users.utmCampaign,
            kycStatus: schema.users.kycStatus,
            emailVerified: schema.users.emailVerified,
            updatedAt: schema.users.updatedAt,
          })
          .from(schema.users)
          .where(eq(schema.users.id, userId));

        return updatedUser;
      });

      return {
        success: true,
        message: 'User updated successfully',
        user: result,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Failed to update user details'
      );
    }
  }


  async logOut (res: any) {
    try {
      res.clearCookie('refresh-token', {
        httpOnly: true,
        secure: false, // true in prod (HTTPS)
        sameSite: 'lax',
        path: '/'
      });

      res.clearCookie('access-token', {
        httpOnly: true,
        secure: false, // true in prod (HTTPS)
        sameSite: 'lax',
        path: '/'
      });

      res.clearCookie('user-type', {
        httpOnly: true,
        secure: false, // true in prod (HTTPS)
        sameSite: 'lax',
        path: '/'
      });
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new InternalServerErrorException('error in clearing cookies')
    }
  }



  async otpGenerator (phone: string, type: string) {
    const phonenumber = phone?.trim();
    if (!phonenumber) {
      throw new BadRequestException('Phone number is required');
    }
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
    if (!phoneRegex.test(phonenumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    const existingUser = await this.usersService.findByPhone(phonenumber);
    if (existingUser) {
      if (existingUser?.type !== type) {
        throw new BadRequestException(`Phone number already exists with ${existingUser?.type} type`)
      }
    }
    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp, 'otp');

    if (!otp || otp < 100000 || otp > 999999) {
      throw new BadRequestException('Error generating OTP');
    }
    const hashedOTP = await bcrypt.hash(String(otp), 10);
    if (!hashedOTP) {
      throw new BadRequestException('Error hashing otp');
    }


    const otpExpirySeconds = parseInt(process.env.OTP_EXPIRY || '600'); // fallback 10 min
    const expiresAt = new Date(Date.now() + otpExpirySeconds * 1000); // JS timestamp + ms

    if (!expiresAt) {
      throw new BadRequestException('Error setting otp expiry');
    }

    try {
      return await this.db.transaction(async (tx) => {
        // check acoount is locked or not
        const [existingOtpRecordForLocked] = await tx
          .select()
          .from(schema.otpsLocks)
          .where(eq(schema.otpsLocks.phone, phonenumber))
          .for('update');

        if (existingOtpRecordForLocked && existingOtpRecordForLocked.lockedUntil) {
          const now = new Date();
          const lockedUntil = new Date(existingOtpRecordForLocked.lockedUntil);
          if (now < lockedUntil) {
            throw new BadRequestException('Account is locked. Please try again later.');
          }
        }

        // updating last request time
        const now: any = new Date();

        if (existingOtpRecordForLocked && existingOtpRecordForLocked.lastRequestAt) {
          const elapsed = (now.getTime() - new Date(existingOtpRecordForLocked.lastRequestAt).getTime());
          const cooldownMs = parseInt(process.env.OTP_REQUEST_COOLDOWN_SECONDS!) * 1000;

          if (elapsed < cooldownMs) {
            const waitSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
            return { success: false, message: `Please wait ${waitSeconds} seconds before requesting another OTP.` };
          }
          await tx.update(schema.otpsLocks).set({
            lastRequestAt: new Date()
          }).where(eq(schema.otpsLocks.phone, phonenumber));
        }
        else if (existingOtpRecordForLocked) {
          await tx.update(schema.otpsLocks).set({
            lastRequestAt: new Date()
          }).where(eq(schema.otpsLocks.phone, phonenumber));
        }
        else {
          try {
            await tx.insert(schema.otpsLocks).values({ phone: phonenumber, lockedUntil: null, lastRequestAt: new Date() });
          } catch (error) {
            throw new BadRequestException('OTP request already in progress, please try again later.');
          }
        }

        await tx.delete(schema.otps).where(eq(schema.otps.phone, phonenumber));

        const otpStored = await tx
          .insert(schema.otps)
          .values({
            phone: phonenumber,
            otp: hashedOTP,
            expiresAt
          })
          .$returningId();

        if (!otpStored) {
          throw new BadRequestException('Error storing otp');
        }

        // SMS gateway variables
        const apikey = process.env.API_KEY_SMS;
        const apisender = process.env.API_SENDER_SMS;
        const EntityId = process.env.ENTITY_ID_SMS;
        const dlttemplateid = process.env.DLT_TEMPLATE_ID;

        if (!apikey || !apisender || !EntityId || !dlttemplateid) {
          throw new BadRequestException('SMS gateway not configured');
        }
        const msg = `Your one-time OTP is ${otp} for verifying your mobile number on Vakilnow. This OTP is valid for 10 minutes. Please sign up at https://info.vakil-now.com.`;

        const encodedMsg = encodeURIComponent(msg);
        const url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apikey}&senderid=${apisender}&channel=2&DCS=0&flashsms=0&number=${phonenumber}&text=${encodedMsg}&route=1&EntityId=${EntityId}&dlttemplateid=${dlttemplateid}`;

        if (phonenumber === '9000000000' || phonenumber === '9111111111') {
          return {
            success: true,
            phone: phonenumber,
            message: 'OTP sent successfully'
          }
        }
        try {
          const response = await axios.post(url, null, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 5000, // 5 seconds timeout
          });

          if (response?.data?.ErrorCode !== '000' || !response?.data?.JobId || !response?.data?.MessageData[0]?.MessageId) {
            throw new BadRequestException('error in sending code');
          }

          return {
            success: true,
            phone: phonenumber,
            message: 'OTP sent successfully'
          }
        } catch (error) {
          throw new BadRequestException('Error sending OTP via SMS');
        }
      });
    } catch (error) {
      throw error;
    }
  }


  async verifyOtp (dto: VerifyOtpDto) {
    const phonenumber = dto?.phone?.trim();
    const otp = dto?.otp?.trim();
    console.log(otp, 'otp');


    let type = dto?.type?.trim();

    if (!phonenumber || !otp || !type) {
      throw new BadRequestException('Phone number and OTP are required');
    }

    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
    if (!phoneRegex.test(phonenumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    if (!String(otp).match(/^\d{6}$/)) {
      throw new BadRequestException('OTP must be 6 digits');
    }

    try {
      return await this.db.transaction(async (tx) => {
        // check acoount is locked or not
        const [existingOtpRecordForLocked] = await tx
          .select()
          .from(schema.otpsLocks)
          .where(eq(schema.otpsLocks.phone, phonenumber));

        if (!existingOtpRecordForLocked) {
          throw new BadRequestException('Invalid credentials');
        }

        if (existingOtpRecordForLocked && existingOtpRecordForLocked.lockedUntil) {
          const now = new Date();
          const lockedUntil = new Date(existingOtpRecordForLocked.lockedUntil);
          if (now < lockedUntil) {
            throw new BadRequestException(`Account temporarily locked due to multiple failed attempts , please try again later after ${Math.ceil((lockedUntil.getTime() - now.getTime()) / 1000)} seconds`);
          }
        }


        const otpDataArray = await tx
          .select()
          .from(schema.otps)
          .where(eq(schema.otps.phone, phonenumber));

        const otpData = otpDataArray[0];
        if (!otpData) {
          throw new UnauthorizedException('Invalid credentials');
        }

        if (otpData.isUsed) {
          const result = await this.incrementRetryAndMaybeLock(phonenumber);
          if (!result.success) {
            throw new BadRequestException('Account temporarily locked due to multiple failed attempts');
          }
          throw new UnauthorizedException('OTP already used');
        }
        if (otpData.expiresAt < new Date()) {
          const result = await this.incrementRetryAndMaybeLock(phonenumber);
          if (!result.success) {
            throw new BadRequestException('Account temporarily locked due to multiple failed attempts');
          }
          throw new UnauthorizedException('OTP expired');
        }

        const isOtpValid = await bcrypt.compare(String(otp), otpData.otp);
        if (!isOtpValid) {
          const result = await this.incrementRetryAndMaybeLock(phonenumber);
          if (!result.success) {
            throw new BadRequestException('Account temporarily locked due to multiple failed attempts');
          }
          throw new UnauthorizedException('Wrong OTP');
        }

        await Promise.all([
          tx.update(schema.otpsLocks).set({
            retryCount: 0,
            lockedUntil: null
          }).where(eq(schema.otpsLocks.phone, phonenumber)),
          tx.update(schema.otps)
            .set({ isUsed: true })
            .where(eq(schema.otps.id, otpData.id))
        ]);

        let user = await this.usersService.findByPhone(phonenumber, tx);

        if (user) {
          if (user?.type !== type) {
            throw new BadRequestException(`Phone number already exists with ${user?.type} type`)
          }
        }
        let messageInfo = 'Registered'
        if (user) {
          messageInfo = 'Login'
        }
        if (!user) {
          user = await this.usersService.createUserByPhone({ phone: phonenumber, type: dto.type as 'ADMIN' | 'USER' | 'LAWYER' }, tx);
        }
        if (!user?.id) {
          throw new BadRequestException('Error creating user');
        }

        await tx.update(schema.users).set({
          lastLogin: new Date(),
        }).where(eq(schema.users.id, user.id));

        const tokens = await this.generateTokenInPhone(user?.id, user?.type, tx);
        if (!tokens) {
          throw new BadRequestException('Error generating token');
        }
        const { accessToken, refreshToken, typeEncoded } = tokens;

        const userInfo = await this.usersService.findByPhone(user?.phone!, tx);
        const someInfoOfUser = {
          name: userInfo?.name,
          phone: userInfo?.phone,
          type: userInfo?.type,
        }
        return { message: `User ${messageInfo} successfully`, accessToken, refreshToken, typeEncoded, someInfoOfUser, success: true };
      });
    } catch (err) {
      throw err;
    }
  }





  async incrementRetryAndMaybeLock (phone: string) {
    const [row] = await this.db
      .select()
      .from(schema.otpsLocks)
      .where(eq(schema.otpsLocks.phone, phone));

    if (!row) {
      return { success: false };
    }
    const newCount = (row.retryCount || 0) + 1;
    const updates: any = { retryCount: newCount };
    if (newCount >= parseInt(process.env.OTP_MAX_RETRIES!)) {
      const lockedUntil = new Date(Date.now() + await this.lockTtlSeconds() * 1000);
      updates.lockedUntil = lockedUntil;
      updates.retryCount = 0; // reset count on lock
    }
    await this.db.update(schema.otpsLocks).set(updates).where(eq(schema.otpsLocks.phone, phone));

    const [row1] = await this.db
      .select()
      .from(schema.otpsLocks)
      .where(eq(schema.otpsLocks.phone, phone));
    return { success: true };
  }

  async lockTtlSeconds () {
    return parseInt(process.env.OTP_LOCK_DURATION_SECONDS || '900'); // default 15 minutes
  }

  async refreshAccessTokenInPhone (refreshToken: string): Promise<{
    accessToken: string; refreshToken: string; type: string
  }> {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }
      let decodedToken;
      try {
        decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const userId = decodedToken.sub;
      const type = decodedToken.type;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findByIdInPhone(userId);
      if (!user) {
        throw new BadRequestException('Error in finding user');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
      if (!isValid) {
        throw new BadRequestException('Token is not valid');
      }
      const tokens = await this.generateTokenInPhone(userId, user.type);
      if (!tokens) {
        throw new BadRequestException('Error generating token');
      }
      const { accessToken, refreshToken: newRefreshToken, typeEncoded } = tokens;
      return { accessToken, refreshToken: newRefreshToken, type: typeEncoded };
    }
    catch (error) {
      throw error;
    }
  }


  private async generateTokenInPhone (userId: string, type: string, tx = this.db): Promise<{ accessToken: string; refreshToken: string; typeEncoded: string }> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required to generate tokens');
      }
      const payload = { sub: userId, type: type };
      const typePayload = { type: type }

      // Access Token
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY as any || '15m',
      });

      // Refresh Token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET!,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY as any || '7d',
      });

      const typeEncoded = await this.jwtService.signAsync(typePayload, {
        secret: process.env.JWT_SECRET!,
      })

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.usersService.updateRefreshTokenInPhone(userId, hashedRefreshToken, tx)

      return { accessToken, refreshToken, typeEncoded };
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to generate tokens in verify');
    }
  }


  async kycUpdation (req: any, res: any) {

    const userId = req?.userId;
    if (!userId) {
      throw new BadRequestException('UserId number is required');
    }

    await this.db
      .update(schema.users)
      .set({
        kycStatus: 'VERIFIED',
      })
      .where(eq(schema.users.id, userId));

    res.send({ message: 'KYC status updated successfully' });
  }


  async sendEmailLink (req: any) {
    const userId = req?.userId;
    const to = req?.body?.to?.trim()?.toLowerCase();

    // 🔹 Validation
    if (!userId) throw new BadRequestException('User ID is required');
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to))
      throw new BadRequestException('A valid email address is required');

    try {
      return await this.db.transaction(async (tx) => {
        // 1️⃣ Check if user exists
        const [user] = await tx
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .for('update');

        if (!user) throw new BadRequestException('User not found');

        // 2️⃣ Generate secure token
        const token = randomBytes(32).toString('hex');
        const tokenHash = await bcrypt.hash(token, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes


        const updated = await tx
          .update(schema.users)
          .set({
            verificationToken: tokenHash,
            verificationExpiresAt: expiresAt,
          })
          .where(eq(schema.users.id, userId));

        if (!updated) throw new BadRequestException('Failed to store verification token');

        // 4 Send verification email (outside DB transaction)
        await this.emailservice.sendVerificationEmail(to, token);

        return {
          success: true,
          message: 'Verification email sent successfully',
          email: to,
        };
      });
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to send verification email');
    }
  }


  async verifyEmailLink (req: any) {
    const token = req?.query?.token?.trim();
    let email = decodeURIComponent(String(req?.query?.email || '').trim());

    // 🔹 Validation
    if (!token) throw new BadRequestException('Verification token is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new BadRequestException('Valid email is required');

    try {
      return await this.db.transaction(async (tx) => {
        // 1️⃣ Find user with matching email and valid expiry
        const [user] = await tx
          .select()
          .from(schema.users)
          .where(
            and(
              eq(schema.users.email, email),
              gt(schema.users.verificationExpiresAt, new Date())
            )
          )
          .for('update');

        if (!user) throw new BadRequestException('User not found or link expired');
        if (!user.verificationToken) throw new BadRequestException('No verification token found');

        // 2️⃣ Compare token hashes
        const isValid = await bcrypt.compare(token, user.verificationToken);
        if (!isValid) throw new BadRequestException('Invalid or expired verification token');

        // 3️⃣ Update user as verified
        const result = await tx
          .update(schema.users)
          .set({
            emailVerified: true,
            verificationToken: null,
            verificationExpiresAt: null,
          })
          .where(eq(schema.users.id, user.id));

        if (!result) throw new BadRequestException('Failed to verify email');

        return {
          success: true,
          message: 'Email verified successfully',
          user: {
            id: user.id,
            email: user.email,
            emailVerified: true,
          },
        };
      });
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to verify email');
    }
  }

}

