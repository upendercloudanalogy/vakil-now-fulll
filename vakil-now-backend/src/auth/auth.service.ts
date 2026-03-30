import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Inject,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySqlDatabase } from 'drizzle-orm/mysql2';
import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { VerifyOtpDto } from './dto/verifyOtpDto.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(DrizzleAsyncProvider)
    private readonly db: MySqlDatabase<any, any>,
  ) { }

  async signup(dto: SignupDto): Promise<{ message: string, accessToken: string, refreshToken: string, someInfoOfUser: any }> {
    let { name, email, password } = dto;
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();


    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }
    return await this.db.transaction(async (tx) => {
      try {
        const existingUser = await this.usersService.findByEmail(email, tx)
        if (existingUser) {
          throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
          throw new BadRequestException('Error hashing password');
        }
        const user = await this.usersService.createUser({
          name,
          email,
          password: hashedPassword
        }, tx);

        if (!user) {
          throw new BadRequestException('Error creating user');
        }

        const tokens = await this.generateToken(user?.id, tx);
        if (!tokens) {
          throw new BadRequestException('Error generating token');
        }
        const { accessToken, refreshToken } = tokens;

        if (!accessToken || !refreshToken) {
          throw new BadRequestException('Error generating token');
        }

        const userInfo = await this.usersService.findById(user?.id, tx);
        if (!userInfo) {
          throw new BadRequestException('ERROR FETCHING USER')
        }
        const someInfoOfUser = {
          name: userInfo?.name,
          email: userInfo?.email
        }
        return { message: 'User registered successfully', accessToken, refreshToken, someInfoOfUser };
      }
      catch (error) {
        throw error;
      }
    });
  }
  async otpGenerator(phone: string) {
    const phonenumber = phone?.trim();
    if (!phonenumber) {
      throw new BadRequestException('Phone number is required');
    }
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
    if (!phoneRegex.test(phonenumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);    

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
  async verifyOtp(dto: VerifyOtpDto) {
    const phonenumber = dto?.phone?.trim();
    const otp = dto?.otp?.trim();

    if (!phonenumber || !otp) {
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
          throw new UnauthorizedException('Invalid credentials');
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
        let messageInfo = 'Registered'
        if (user) {
          messageInfo = 'Login'
        }
        if (!user) {
          user = await this.usersService.createUserByPhone({ phone: phonenumber }, tx);
        }
        if (!user?.id) {
          throw new BadRequestException('Error creating user');
        }
        const tokens = await this.generateTokenInPhone(user?.id, tx);
        if (!tokens) {
          throw new BadRequestException('Error generating token');
        }
        const { accessToken, refreshToken } = tokens;

        const userInfo = await this.usersService.findByPhone(user?.phone, tx);
        const someInfoOfUser = {
          name: userInfo?.name,
          phone: userInfo?.phone
        }
        return { message: `User ${messageInfo} successfully`, accessToken, refreshToken, someInfoOfUser, success: true };

      });
    } catch (err) {
      throw err;
    }
  }
  async incrementRetryAndMaybeLock(phone: string) {
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
  async lockTtlSeconds() {
    return parseInt(process.env.OTP_LOCK_DURATION_SECONDS || '900'); // default 15 minutes
  }
  async login(dto: LoginDto) {
    const { email, password } = dto;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    try {
      return await this.db.transaction(async (tx) => {
        const user = await this.usersService.findByEmail(email, tx);

        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateToken(user.id, tx);

        if (!tokens.accessToken || !tokens.refreshToken) {
          throw new BadRequestException('Error generating token');
        }

        const UserInfo = {
          name: user?.name,
          email: user?.email
        }

        return { message: 'Login successful', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, UserInfo };

      })
    }
    catch (error) {
      throw error;
    }
  }
  private async generateToken(userId: string, tx = this.db): Promise<{ accessToken: string; refreshToken: string }> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    const payload = { sub: userId };
    // Access Token
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET!,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET!,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any || '7d',
      }),
    ]);

    if (!accessToken || !refreshToken) {
      throw new BadRequestException('Error generating tokens');
    }
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(userId, refreshTokenHash, tx);

    return { accessToken, refreshToken };
  }
  private async generateTokenInPhone(userId: string, tx = this.db): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required to generate tokens');
      }
      const payload = { sub: userId };
      // Access Token
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET!,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any || '15m',
      });

      // Refresh Token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET!,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any || '7d',
      });
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      await this.usersService.updateRefreshTokenInPhone(userId, refreshTokenHash, tx);

      return { accessToken, refreshToken };
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to generate tokens');
    }
  }
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    try {
      return await this.db.transaction(async (tx) => {
        const decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
        if (!decodedToken) {
          throw new UnauthorizedException('Invalid refresh token');
        }

        const userId = decodedToken.sub;
        if (!userId) {
          throw new UnauthorizedException('Invalid refresh token');
        }


        const user = await this.usersService.findById(userId, tx);
        if (!user || !user.refreshToken) {
          throw new ForbiddenException('Access denied');
        }

        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {

          throw new ForbiddenException('Access denied');
        }
        const tokens = await this.generateToken(user.id, tx);
        if (!tokens) {
          throw new BadRequestException('Error generating token');
        }
        const { accessToken, refreshToken: newRefreshToken } = tokens;

        return { accessToken, refreshToken: newRefreshToken };
      })
    } catch (error) {
      throw error;
    }
  }
  async refreshAccessTokenInPhone(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }
      let decodedToken;
      try {
        decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const userId = decodedToken.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findByIdInPhone(userId);
      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Access denied');
      }

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isRefreshTokenValid) {
        throw new ForbiddenException('Access denied');
      }

      const tokens = await this.generateTokenInPhone(user.id);
      if (!tokens) {
        throw new BadRequestException('Error generating token');
      }
      const { accessToken, refreshToken: newRefreshToken } = tokens;
      return { accessToken, refreshToken: newRefreshToken };
    }
    catch (error) {
      throw error;
    }
  }
}