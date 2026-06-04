import { z } from 'zod';


export const signup = z.strictObject({
    username : z.string(),
    email:z.email,
})
