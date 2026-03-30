import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor (private userService: UserService) { }


  @Post('update-email')
  async updateEmail (@Body() body: { phone: string, email: string }) {
    await this.userService.updateUserEmail({ phone: body.phone, email: body.email });
    return { message: 'Email updated successfully' };
  }


  @Get('me')
  async getProfile (@Req() request: any) {
    const userId = request.userId;
    const user = await this.userService.getUser(userId);
    return {
      success: true,
      message: 'User profile fetched successfully',
      data: {
        phone: user?.phone,
        type: user?.type,
        createdAt: user?.createdAt
      }
    };
  }


  @Get('total-lawyers')
  async getTotalLawyers () {
    const result = await this.userService.getTotalLawyers();
    return {
      success: true,
      message: 'Total lawyers fetched successfully',
      data: {
        totalLawyers: result?.totalLawyers
      }
    }
  }


  @Get('total-users')
  async getTotalUsers () {
    const result = await this.userService.getTotalUsers();
    return {
      success: true,
      message: 'Total Users fetched successfully',
      data: {
        totalUsers: result?.totalUsers
      }
    }
  }
}

