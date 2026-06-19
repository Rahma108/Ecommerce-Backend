
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable,  of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService, cartCacheKey } from '../utils';
import { Reflector } from '@nestjs/core';
import { PersonalCacheName, ttlName } from '../decorator';
import { IAuthReq } from '../interfaces';
import { HUserDocument } from 'src/DB/models';
import { Types } from 'mongoose';

@Injectable()
export class CustomCartCacheInterceptor implements NestInterceptor {
    constructor(private readonly redis : CacheService ,
        private readonly reflector : Reflector ,
  ){

    }
     async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

        const usePersonalUser: boolean = await this.reflector.getAllAndOverride<boolean>(PersonalCacheName , [context.getClass() , context.getHandler() ]) ?? false;

        let req: IAuthReq = context.switchToHttp().getRequest().url;
        let  url: string = context.switchToHttp().getRequest().url;
        let userId ! : string;
        userId = req.credentials?.user?._id.toString();
        if(usePersonalUser ){
            url += `-${userId}`;

        }
        const cacheKey = this.redis.getCacheKey(url ,usePersonalUser ? userId : undefined );
        const data = await this.redis.get(cacheKey);
        if(data){
            return of(data)
        }
        return next
        .handle()
        .pipe(
            tap(async (value ) => {
                const ttl = await this.reflector.getAllAndOverride<number>(ttlName , [context.getClass() , context.getHandler() ]) ?? 10
                await this.redis.set({key : cacheKey   , value , ttl  })

            }),
        );
    }
}

