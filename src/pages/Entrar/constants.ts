import { z } from 'zod';

export const entrarSchema = z.object({
  email: z.string().min(1, '').email('O e-mail digitado é inválido'),
  senha: z
    .string()
    .min(1, '')
    .refine(
      (value) => value.length >= 8,
      'A senha deve conter ao menos 8 caracteres',
    ),
});
