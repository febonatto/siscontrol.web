import { z } from 'zod';

export const aeroportoSchema = z
  .object({
    sigla: z
      .string()
      .min(1, '')
      .max(4, 'A sigla excede a quantidade máxima de 4 caracteres'),
    nome: z
      .string()
      .min(1, '')
      .max(150, 'O nome excede a quantidade máxima de 150 caracteres'),
    lote: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .regex(/^-?\d+$/, 'A quantidade de meses deve conter apenas números')
        .refine(
          (value) => Number(value) > 0,
          'A quantidade de meses deve ser positivo',
        )
        .nullable(),
    ),
    cnpj: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .regex(
          /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}/,
          'O cnpj não segue os requisitos informados',
        )
        .nullable(),
    ),
    estado: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O estado excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    cidade: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'A cidade excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    endereco: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(150, 'O endereço excede a quantidade máxima de 150 caracteres')
        .nullable(),
    ),
  })
  .superRefine(({ lote }, ctx) => {
    if (!lote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '',
        path: ['lote'],
      });
    }
  });
