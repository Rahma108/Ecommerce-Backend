import { Body, Controller, HttpCode, HttpStatus, Param, Post, Query, Req } from "@nestjs/common";
import type{ Request } from "express";
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  signup(){
    const user = this.authenticationService.signup();
    return { message: 'Done', user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {
    return 'LOGIN';
  }
}
