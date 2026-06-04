import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data:S) {
    return {
      id: 1,
      username: 'Rahma',
    };
  }
}
