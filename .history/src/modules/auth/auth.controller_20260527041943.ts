import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  signup( ,@Body() body: SignupDto) {
    const user = this.authenticationService.signup(body);
    return { message: 'Done', user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {
    return 'LOGIN';
  }
}
