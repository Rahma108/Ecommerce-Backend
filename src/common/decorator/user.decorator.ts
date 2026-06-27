
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HUserDocument } from 'src/DB/models';
import { CxtType, IAuthReq } from '../interfaces';
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



            // case "ws":
            // req = context.switchToWs().getClient()
            // authorization = req.headers['authorization'] as string; 
            // break;
        
            default:
            break;
        }
        return user
  },
);
