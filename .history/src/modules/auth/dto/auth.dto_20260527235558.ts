
import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
