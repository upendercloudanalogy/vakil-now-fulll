import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}


    @Post('update-email')
    async updateEmail(@Body() body: {phone:string , email:string}) {
        await this.userService.updateUserEmail({phone:body.phone , email:body.email});
        return { message: 'Email updated successfully' };
    }
}
