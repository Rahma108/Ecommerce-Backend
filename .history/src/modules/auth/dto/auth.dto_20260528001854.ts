import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;


export class SignupBodyDTO {

  email:string;
  
}
