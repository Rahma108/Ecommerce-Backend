// export class SignupDto {
//   username!: string;
//   email!: string;
//   password!: string;
//   confirmPassword!: string;
// }

// export class LoginDto {
//   email!: string;
//   password!: string;
// }
import {z} from 'zod'
import { signupSchema } from '../auth.validation'
export type SignupDTO = z.infer<typeof signupSchema>

