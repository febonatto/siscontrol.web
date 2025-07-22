import { z } from 'zod';

export const alterarSenhaSchema = z
  .object({
    senhaAtual: z
      .string()
      .min(1, '')
      .refine(
        (value) => value.length >= 8,
        'O tamanho mínimo aceito para a senha é de 8 caracteres',
      ),
    novaSenha: z
      .string()
      .min(1, '')
      .refine(
        (value) => value.length >= 8,
        'O tamanho mínimo aceito para a senha é de 8 caracteres',
      ),
    confirmacaoSenha: z.string().min(1, ''),
  })
  .superRefine(({ novaSenha, confirmacaoSenha }, ctx) => {
    if (novaSenha !== confirmacaoSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A confirmação de senha deve coincidir com a senha',
        path: ['confirmacaoSenha'],
      });
    }
  });
