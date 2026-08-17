import { z } from 'zod';

export const CreateTokenResponseSchema = z.object({
    token: z.string(),
});

export type CreateTokenResponse =
    z.infer<typeof CreateTokenResponseSchema>;