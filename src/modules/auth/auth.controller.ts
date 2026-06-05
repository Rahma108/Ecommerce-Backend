import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import type { LoginBodyDTO, SignupDTO } from './dto/auth.dto';
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
    body: LoginBodyDTO,
  ) {
    console.log({ body });
    return { message: 'Done', body };
  }
}
