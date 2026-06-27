import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../utils/service';
import { CxtType, IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { TokenTypeEnum } from '../enums';
import { tokenTypeName } from '../decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector : Reflector,
    private readonly tokenService:TokenService){

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

  const tokenType = this.reflector.getAllAndOverride<TokenTypeEnum>(tokenTypeName , 
    [context.getHandler() , context.getClass()] )?? TokenTypeEnum.access
    let req!: IAuthReq;
    let authorization!:string;
    switch (context.getType<CxtType>()) {
      case "http":
        req = context.switchToHttp().getRequest()
        authorization = req.headers['authorization'] as string; 
        break;
      case "graphql":
        req = GqlExecutionContext.create(context).getContext().req
        authorization = req.headers['authorization'] as string; 
        break;

        // case "ws":
        // req = context.switchToWs().getClient()
        // authorization = req.headers['authorization'] as string; 
        // break;
    
      default:
        break;
    }

    const [key, token] = authorization.split(' ') || [] ;

    if (key !== 'Bearer' || !token) {
        throw new Error('Invalid Authorization format');
    }
    req.credentials = await this.tokenService.decodeToken({ token  , tokenType });

    return true;
  }
}
