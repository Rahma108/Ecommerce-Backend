import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';

@Module({
    imports:[],
    exports:[],
    controllers:[AuthenticationController],
    providers:[A]
})
export class AuthModule{


}