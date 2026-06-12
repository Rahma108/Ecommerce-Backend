import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import type {  ConfirmEmailDTO, LoginDTO, ResendConfirmEmailDto, SignupDTO } from './dto/auth.dto';
import { CustomValidationPipe } from 'src/common/pipe/validation.pipe';
import { signupSchema } from './auth.validation';
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  async signup(
    @Body(new CustomValidationPipe<SignupDTO>(signupSchema)) body: SignupDTO,
  ) {
    const user = await this.authenticationService.signup(body);
    return { message: 'Done', data: { user } };
  }
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post('login')
  login(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: LoginDTO,
  ) {
    console.log({ body });
    return { message: 'Done', body };
  }
  @Patch('confirm-email')
  async confirmEmail(@Body() body:ConfirmEmailDTO){
      await this.authenticationService.confirmEmail(body)
      return ;
  }

  @Patch('/resend-confirm-email')
  async reSendConfirmEmail(@Body() body:ResendConfirmEmailDto){
      await this.authenticationService.reSendConfirmEmail(body)
      return ;
  }
}
