import { Controller, Post, Body, Res, Req, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyOtpDto.dto';
import { SignUpPhoneDto } from './dto/signUpPhone.dto';
import type { Response } from 'express';
import { Public } from './decorator/public.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cache from 'cache-manager';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: cache.Cache
  ) { }

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signup(dto);
    const { message, accessToken, refreshToken, someInfoOfUser } = result;
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      message,
      accessToken,
      someInfoOfUser
    }
  }


  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    const { message, accessToken, refreshToken, UserInfo } = result;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax'
    });

    // Return success response
    return {
      success: true,
      message: message,
      accessToken: accessToken,
      user: UserInfo
    };
  }

  @Public()
  @Post('refresh')
  async refreshAccessToken(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    console.log('inside refresh');

    const oldrefreshToken = req.cookies['refresh-token'];
    const result = await this.authService.refreshAccessToken(oldrefreshToken);
    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax'
    });

    return {
      status: 200,
      accessToken: accessToken,
    };
  }


  @Public()
  @Post('refreshInPhone')
  async refreshAccessTokenInPhone(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const oldrefreshToken = req.cookies['refresh-token'];
    const result = await this.authService.refreshAccessTokenInPhone(oldrefreshToken);
    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax'
    });

    return {
      status: 200,
      accessToken: accessToken,
    };
  }


  @Public()
  @Post('signupByPhone')
  async signupByPhone(@Body() dto: SignUpPhoneDto, @Req() req: any) {
    const { phone } = dto;
    if (!phone) {
      return { status: 400, error: 'Phone number required' };
    }
    const result = await this.authService.otpGenerator(phone);
    if (!result.success) {
      return { status: 500, error: result.message };
    }
    return {
      status: 200,
      message: 'OTP sent successfully',
      phone: result.phone
    };
  }


  @Public()
  @Post('verifyOtp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto);
    if (!result.success) {
      return { status: 500, message: 'Wrong OTP' };
    }
    const { message, accessToken, refreshToken, someInfoOfUser } = result;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: 'lax',
    });

    return {
      message,
      accessToken,
      user: someInfoOfUser,
    };
  }
}
