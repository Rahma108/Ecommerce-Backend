
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HUserDocument } from 'src/DB/models';
import { CxtType, IAuthReq, IAuthSocket } from '../interfaces';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
      let user!:HUserDocument;
      let authorization!:string;
        switch (context.getType<CxtType>()) {
            case "http":
            user = (context.switchToHttp().getRequest() as IAuthReq).credentials.user
            break;
            case "graphql":
            user= (GqlExecutionContext.create(context).getContext().req as IAuthReq ).credentials.user ;
          break;
          case 'ws':
          user = (context.switchToWs().getClient() as IAuthSocket)
            .credentials.user;
          break;
        
            default:
            break;
        }
        return user
  },
);
