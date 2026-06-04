import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export class LoginBodyDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @IsStrongPassword()
  @IsNotEmpty()
  password!: string;
}
export class SignupBodyDTO extends LoginBodyDTO {
  @Length(2, 20, { message: 'Invalid range is 2 - 20' })
  username!: string;
  @IsStrongPassword()
  @IsNotEmpty()
  confirmPassword!:string;
}
