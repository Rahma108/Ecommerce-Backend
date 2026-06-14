
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HUserDocument } from 'src/DB/models';
import { IAuthReq } from '../interfaces';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
      let user!:HUserDocument;
       let authorization!:string;
        switch (context.getType()) {
            case "http":
            user = (context.switchToHttp().getRequest() as IAuthReq).credentials.user
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
