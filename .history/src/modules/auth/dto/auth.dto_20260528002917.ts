import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { isEmail, IsNotEmpty, isStrongPassword } from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export class LoginBodyDTO {
  @isEmail()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @isStrongPassword()
  @IsNotEmpty()
  password!: string;
}
export class SignupBodyDTO extends L {
  @isEmail()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @isStrongPassword()
  @IsNotEmpty()
  password!: string;
}