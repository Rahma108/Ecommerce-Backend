import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import type {  ConfirmEmailDTO, LoginDTO, ResendConfirmEmailDto, SignupDTO, SignupWithGoogleDTO } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { WatchInterceptor } from 'src/common/interceptor';
import { IUser } from 'src/common/interfaces';
import { LoginResponse } from './entites/auth.entites';
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')

  async signup(
    @Body() body: SignupDTO,
  ) :Promise<IUser>{
    const user = await this.authenticationService.signup(body);
    return user;
  }
  @UseInterceptors(WatchInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login (
    @Req() req : Request,
    @Body()
    body: LoginDTO,
  ) : Promise<LoginResponse>{
    console.log({lang : req.headers['accept-language']})
    const credentials = await this.authenticationService.login(body , `${req.protocol}://${req.get('host')}`)
    return credentials;
  }
  @Patch('confirm-email')
  async confirmEmail(@Body() body:ConfirmEmailDTO):Promise<void>{
      await this.authenticationService.confirmEmail(body)
      return ;
  }

  @Patch('/resend-confirm-email')
  async reSendConfirmEmail(@Body() body:ResendConfirmEmailDto):Promise<void>{
      await this.authenticationService.reSendConfirmEmail(body)
      return ;
  }

  // Google 
  @Post('signupWithGoogle')
  async signupWithGoogle(
    @Body() body: SignupWithGoogleDTO,
    @Req() req:Request,
    @Res({passthrough:true}) res : Response
  )  :Promise<LoginResponse> {
    const {account , status} = await this.authenticationService.signupWithGmail(body.idToken ,`${req.protocol}://${req.get('host')}`);
    res.status(status)
    return account;
  }
}
