import { z, ZodIssueCode } from 'zod';

export const baseExperienciaPessoaSchema = z
  .object({
    pessoaId: z.preprocess(
      (value) => (value ? value : undefined),
      z.string().min(1, '').optional(),
    ),
    nomeEmpresa: z
      .string()
      .min(1, '')
      .max(
        100,
        'O nome da empresa excede a quantidade máxima de 100 caracteres',
      ),
    ocupacao: z
      .string()
      .min(1, '')
      .max(50, 'A ocupação excede a quantidade máxima de 50 caracteres'),
    responsabilidades: z.string().min(1, ''),
    dataEntrada: z.date({ message: '' }).nullable(),
    dataSaida: z.date({ message: '' }).nullable(),
  })
  .superRefine(({ dataEntrada, dataSaida }, ctx) => {
    if (!dataEntrada) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: '',
        path: ['dataEntrada'],
      });
    }

    if (!dataSaida) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: '',
        path: ['dataSaida'],
      });
    }

    if (
      dataEntrada &&
      dataSaida &&
      dataEntrada.getTime() >= dataSaida.getTime()
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'A data de entrada deve ser anterior a data de saída',
        path: ['dataEntrada'],
      });
    }
  });
