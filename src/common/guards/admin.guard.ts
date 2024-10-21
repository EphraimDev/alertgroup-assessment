import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequest } from '../types';
import { RoleService } from '../../../src/modules/roles/roles.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as IRequest;
    const user = request.user;
    if (!user)
      throw new UnauthorizedException(
        'This request is reserved for only Admins.',
      );

    if (!user.role || user.role.name !== 'Admin')
      throw new UnauthorizedException(
        'This request is reserved for only Admins.',
      );
    return true;
  }
}
