import { Controller, Get, Post,Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request} from 'express';

@Controller('user')
export class UserController {
    constructor(private userService : UserService){}

//     @Get('me')
//     async fetchUser (@Req() request:any, @Res() res:any){
//     const userId = request.userId;
//     if(!userId){
//         return res.send({
//             status:404,
//             message:'cant find the userId'
//         });
//     }
//      const result = await this.userService.findById(userId);
//      const userInfo ={
//         name:result?.name,
//         email:result?.email
//      }
//      res.send({
//         status:200,
//         userInfo,
//      })
// }


//     @Get('mePhone')
//     async fetchUserInPhone (@Req() request:any, @Res() res:any){
//     const userId = request.userId;
//     if(!userId){
//         return res.send({
//             status:404,
//             message:'cant find the userId'
//         });
//     }
//      const result = await this.userService.findByIdInPhone(userId);
//      const userInfo ={
//         name:result?.name,
//         phone:result?.phone
//      }
//      res.send({
//         status:200,
//         userInfo,
//      })
// }


}
