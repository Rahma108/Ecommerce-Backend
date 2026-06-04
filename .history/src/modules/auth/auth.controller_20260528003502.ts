import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
  signup(
    @Body(new CustomValidationPipe<SignupDTO>(signupSchema)) body: SignupDTO,
  ) {
    const user = this.authenticationService.signup(body);
    return { message: 'Done', user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  // new CustomValidationPipe<LoginDTO>(loginSchema)
  login(@Body(ValidationPipe) body: LoginBodyDTO) {
    console.log
    return { message: 'Done', body };
  }
}
