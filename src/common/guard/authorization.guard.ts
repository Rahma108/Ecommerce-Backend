import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CxtType, IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { RoleEnum} from '../enums';
import { RoleName} from '../decorator';
import { HUserDocument } from 'src/DB/models';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector : Reflector ){

  }
async canActivate(context: ExecutionContext): Promise<boolean> {
  const roles = this.reflector.getAllAndOverride<RoleEnum[]>(
    RoleName,
    [context.getHandler(), context.getClass()],
  );

  let user!: HUserDocument;

  switch (context.getType<CxtType>()) {
    case 'http':
      user = (context.switchToHttp().getRequest() as IAuthReq)
        .credentials.user;
      break;
      case "graphql":
         user= (GqlExecutionContext.create(context).getContext().req as IAuthReq ).credentials.user ;
         break;
  }
  if (!roles) return true;
  if (!user || user.role === undefined) return false;
  return roles.includes(user.role);
}
}
