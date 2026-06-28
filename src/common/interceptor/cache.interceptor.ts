
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable,  of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../utils';
import { Reflector } from '@nestjs/core';
import { PersonalCacheName, ttlName } from '../decorator';
import { CxtType, IAuthReq } from '../interfaces';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
// export class CustomCacheInterceptor implements NestInterceptor {
//     constructor(private readonly redis : CacheService , private readonly reflector : Reflector ){

//     }
//      async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//         const url = context.switchToHttp().getRequest().url;
//         const cacheKey = `Request::${url}`;
//         const data = await this.redis.get(cacheKey);
//         if(data){
//             return of(data)
//         }
//         return next
//         .handle()
//         .pipe(
//             tap(async (value ) => {
//                 const ttl = await this.reflector.getAllAndOverride<number>(ttlName , [context.getClass() , context.getHandler() ]) ?? 10
//                 await this.redis.set({key : cacheKey   , value , ttl:  10 })

//             }),
//         );
//     }
// }

export class CustomCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly redis: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {

    const ttl: number = this.reflector.getAllAndOverride<number>(
      ttlName,
      [context.getHandler(), context.getClass()],
    );

    const usePersonalUser: boolean =
      this.reflector.getAllAndOverride<boolean>(
        PersonalCacheName,
        [context.getHandler(), context.getClass()],
      );

    let url!: string;
    let userId!: string;

    switch (context.getType<CxtType>()) {
      case 'http':
        const req: IAuthReq = context.switchToHttp().getRequest();

        url = context.switchToHttp().getRequest().url;
        userId = req.credentials?.user?._id?.toString();
        break;

      case 'graphql':
        const ctx = GqlExecutionContext.create(context)
        url = JSON.stringify({
            Key : ctx.getInfo().path.Key ,
            typename : ctx.getInfo().path.typename ,
            args : ctx.getArgs()
        })
        break;

      default:
        break;
    }

    const cacheKey = this.redis.getCacheKey(
      url,
      usePersonalUser ? userId : undefined,
    );

    console.log({ cacheKey });

    const data = await this.redis.get(cacheKey);

    if (data) {
      return of(data);
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.redis.set({key : cacheKey   , value: data , ttl })
      }),
    );
  }
}

