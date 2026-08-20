import { z } from 'zod';

export const CreateTokenRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type CreateTokenRequest = z.infer<typeof CreateTokenRequestSchema>;
