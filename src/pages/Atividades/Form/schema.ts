import { z } from 'zod';

export const atividadeSchema = z
  .object({
    dataReferencia: z.date({ message: '' }).nullable(),
    atividade: z.string().min(1, ''),
  })
  .superRefine(({ dataReferencia }, ctx) => {
    if (!dataReferencia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '',
        path: ['dataReferencia'],
      });
    }
  });
