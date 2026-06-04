import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { isEmail, IsNotEmpty, isStrongPassword } from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export class LoginBodyDTO {
  @I()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @isStrongPassword()
  @IsNotEmpty()
  password!: string;
}
export class SignupBodyDTO extends LoginBodyDTO {
  username!: string;
}