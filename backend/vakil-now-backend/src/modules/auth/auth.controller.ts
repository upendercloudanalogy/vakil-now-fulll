
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Body, Controller, Get, Inject, InternalServerErrorException, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as cache from 'cache-manager';
import type { Response } from 'express';
import { EmailService } from 'src/global/email/email.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { EmailLinkResponse } from './dto/emailResponse.dto';
import { KycResponse } from './dto/kycResponse.dto';
import { RefreshTokenResponse } from './dto/refreshTokenResponse.dto';
import { SignUpPhoneDto } from './dto/signUpPhone.dto';
import { SignUpResponse } from './dto/signupResponse.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { UpdateUserResponse } from './dto/updateUserResponse.dto';
import { VerifyEmailLinkResponse } from './dto/verifyEmailLinkResponse.dto';
import { VerifyOtpDto } from './dto/verifyOtpDto.dto';
import { VerifyOtpResponse } from './dto/verifyOtpResponse.dto';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly emailservice: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: cache.Cache
  ) { }

  @Public()
  @Post('refreshInPhone')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    type: RefreshTokenResponse
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token'
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied'
  })
  @ApiCookieAuth('refresh-token')
  async refreshAccessTokenInPhone(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const oldrefreshToken = req.cookies['refresh-token'];
    const result = await this.authService.refreshAccessTokenInPhone(oldrefreshToken);
    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;
    const type = result?.type;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax',
      path:'/'
    });

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: 'lax',
      path:'/'
    });

    res.cookie('user-type', type, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS),
      sameSite: 'lax',
      path:'/'
    })
    return {
      status: 200,
      message:'Access Token Update Successfully'
    };
  }

  @Public()
  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response){
    return this.authService.logOut(res);
  }

  @Public()
  @Post('signupByPhone')
  @ApiOperation({ summary: 'Send OTP to phone for signup/login' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    type: SignUpResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Phone number required or invalid format'
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to send OTP'
  })
  @ApiBody({ type: SignUpPhoneDto })
  async signupByPhone(@Body() dto: SignUpPhoneDto, @Req() req: any) {
    const { phone , type } = dto;
    if (!phone || !type) {
      throw new BadRequestException('Phone number and type required');
    }
    const result = await this.authService.otpGenerator(phone , type);
    if (!result.success) {
      throw new InternalServerErrorException(result.message);
    }
    return {
      message: 'OTP sent successfully',
      phone: result.phone
    };
  }

  @Public()
  @Post('verifyOtp')
  @ApiOperation({ summary: 'Verify OTP for signup/login' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: VerifyOtpResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or expired'
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: 500,
    description: 'Wrong OTP'
  })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto);
    if (!result.success) {
      return { status: 500, message: 'Wrong OTP' };
    }
    const { message, accessToken, refreshToken, someInfoOfUser, typeEncoded } = result;

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: 'lax',
      path: '/'
    });

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: 'lax',
      path: '/'
    });

    res.cookie('user-type', typeEncoded, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: 'lax',
      path: '/'
    });


    return {
      message,
      user: someInfoOfUser,
      type: typeEncoded
    };
  }

  @Post('updateUser')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile information' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or user not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(@Req() req: any, @Res() res: any) {
    try {
      const result = await this.authService.updateUser(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Something went wrong',
      });
    }
  }

  @Post('kycUpdation')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update KYC status for user' })
  @ApiResponse({
    status: 200,
    description: 'KYC status updated successfully',
    type: KycResponse
  })
  @ApiResponse({
    status: 400,
    description: 'User ID required'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async kycUpdation(@Req() req: any, @Res() res: any) {
    return this.authService.kycUpdation(req, res);
  }

  @Post('sendEmailLink')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send email verification link' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
    type: EmailLinkResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or user not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async sendEmailLink(@Req() req: any, @Res() res: any) {
    const result = await this.authService.sendEmailLink(req);
    return res.status(200).json(result);
  }

  @Get('verifyEmailLink')
  @ApiOperation({ summary: 'Verify email using verification link' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailLinkResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification token'
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Verification token from email'
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email address to verify'
  })
  async verifyEmailLink(@Req() req: any, @Res() res: any) {
    const result = await this.authService.verifyEmailLink(req);
    return res.status(200).json(result);
  }

}