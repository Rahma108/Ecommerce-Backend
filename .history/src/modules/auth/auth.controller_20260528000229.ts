import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import type { LoginDTO, SignupDTO } from './dto/auth.dto';
import { CustomValidationPipe } from 'src/common/pipe/validation.pipe';
import { loginSchema, signupSchema } from './auth.validation';

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
  login(@Body(new CustomValidationPipe< LoginDTO>(loginSchema)) body: LoginDTO) {
    const user = this.authenticationService.login(body);
    return { message: 'Done', user };
  }
}
