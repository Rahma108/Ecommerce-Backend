import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserRepository } from 'src/common/repository';
import { createClient } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from 'src/common/utils/service/caching.service';
import { EmailService, EncryptionSecurity, SecurityService, TokenService } from 'src/common/utils/service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [UserModule , ConfigModule],
  exports: ['REDIS_CLIENT'],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.get<string>('Redis_URI'),
        });

        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();
        console.log('✅ Redis connected');

        return client;
      },
      inject: [ConfigService],
    },
    AuthenticationService,
    UserRepository,
    CacheService,
    EmailService,
    EncryptionSecurity,
    SecurityService,
    JwtService,
    TokenService

  ],
})
export class AuthModule {}
