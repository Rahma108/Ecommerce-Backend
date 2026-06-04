import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { IsNotEmpty } from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export class SignupBodyDTO {
  @IsNotEmpty()
  email!: string;
  password!: string;
}
