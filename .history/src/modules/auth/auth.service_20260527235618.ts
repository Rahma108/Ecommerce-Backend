import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data: SignupDto) {
    return data;
  }

  login(data: LoginDto) {
    return data;
  }
}
