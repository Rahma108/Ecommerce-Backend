
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable,  of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../utils';
import { Reflector } from '@nestjs/core';
import { ttlName } from '../decorator';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
    constructor(private readonly redis : CacheService , private readonly reflector : Reflector ){

    }
     async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const url = context.switchToHttp().getRequest().url;
        const cacheKey = `Request::${url}`;
        const data = await this.redis.get(cacheKey);
        if(data){
            return of(data)
        }
        return next
        .handle()
        .pipe(
            tap(async (value ) => {
                const ttl = await this.reflector.getAllAndOverride<number>(ttlName , [context.getClass() , context.getHandler() ]) ?? 10
                await this.redis.set({key : cacheKey   , value , ttl:  10 })

            }),
        );
    }
}

