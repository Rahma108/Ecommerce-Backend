import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { IsEmail, IsNotEmpty, isStrongPassword } from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export class LoginBodyDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @isStrongPassword()
  @IsNotEmpty()
  password!: string;
}
export class SignupBodyDTO extends LoginBodyDTO {
  username!: string;
}