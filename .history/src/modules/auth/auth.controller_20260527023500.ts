import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticationService } from './auth.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  signup(  
    @Req() req:Request ,
    @Body() body : any,
    @Query() query: any,
    @Param() param: any,
  ) {
    const user = this.authenticationService.signup();
    return { message: 'Done', user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {
    return 'LOGIN';
  }
}
