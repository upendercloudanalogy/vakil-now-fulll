// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { AuthService } from "../../auth.service";
// import { ROLES_KEY } from "../../decorators/roles.decorator";

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) { }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflectRoles(context);

//     console.log('Required roles for endpoint:', requiredRoles);

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     console.log('User from JWT:', {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//       role_id: user.role_id
//     });

//     if (!user || !user.role_id) {
//       console.log('ERROR: No user or role_id found');
//       throw new UnauthorizedException('User role not found');
//     }

//     const accessibleRoles = await this.authService.getAccessibleRoles(user.role_id);

//     const allowed = requiredRoles.some(role => accessibleRoles.includes(role));

//     console.log('Access allowed:', allowed);


//     if (!allowed) throw new UnauthorizedException('Forbidden resource Not Allowed');
//     return true;
//   }

//   private reflectRoles(context: ExecutionContext): string[] {
//     const roles = Reflect.getMetadata(ROLES_KEY, context.getHandler()) ||
//       Reflect.getMetadata(ROLES_KEY, context.getClass()) ||
//       [];
//     console.log('Reflected roles:', roles);
//     return roles;
//   }
// }







