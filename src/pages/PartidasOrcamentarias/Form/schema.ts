import { currency } from '@/validators/currency';
import { z } from 'zod';

export const partidaOrcamentariaSchema = z
  .object({
    aeroportoId: z.string().min(1, ''),
    codigo: z
      .string()
      .min(1, '')
      .max(15, 'O código excede a quantidade máxima de 15 caracteres'),
    servico: z.string().min(1, ''),
    tempoExperienciaRequisitado: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .regex(
          /^-?\d+$/,
          'O tempo de experiência requisitado deve conter apenas números',
        )
        .refine(
          (value) => Number(value) >= 0,
          'O tempo de experiência requisitado deve ser positivo ou 0',
        )
        .nullable(),
    ),
    dataMobilizacaoPrevista: z.preprocess(
      (value) => (!value ? null : value),
      z.date().nullable(),
    ),
    quantidadePessoas: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .regex(/^-?\d+$/, 'A quantidade de pessoas deve conter apenas números')
        .refine(
          (value) => Number(value) > 0,
          'A quantidade de pessoas deve ser positivo',
        )
        .nullable(),
    ),
    quantidadeMeses: z.preprocess(
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
    precoUnitario: currency({ optional: true }),
    pessoaPartida: z
      .object({
        pessoaId: z.preprocess(
          (value) => (value === '' ? null : value),
          z.string().min(1, '').nullable(),
        ),
        dataMobilizacaoReal: z.preprocess(
          (value) => (!value ? null : value),
          z.date().nullable(),
        ),
      })
      .optional(),
  })
  .superRefine(
    (
      {
        tempoExperienciaRequisitado,
        dataMobilizacaoPrevista,
        quantidadePessoas,
        quantidadeMeses,
        precoUnitario,
        pessoaPartida,
      },
      ctx,
    ) => {
      if (!tempoExperienciaRequisitado) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['tempoExperienciaRequisitado'],
        });
      }

      if (!dataMobilizacaoPrevista) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['dataMobilizacaoPrevista'],
        });
      }

      if (!quantidadePessoas) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['quantidadePessoas'],
        });
      }

      if (!quantidadeMeses) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['quantidadeMeses'],
        });
      }

      if (!precoUnitario) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['precoUnitario'],
        });
      }

      const { pessoaId, dataMobilizacaoReal } = pessoaPartida || {};

      if (pessoaId && !dataMobilizacaoReal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'A data de mobilização é obrigatória quando um colaborador é fornecido',
          path: ['pessoaPartida.dataMobilizacaoReal'],
        });
      }

      if (!pessoaId && dataMobilizacaoReal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'O colaborador é obrigatória quando uma data de mobilização é fornecida',
          path: ['pessoaPartida.pessoaId'],
        });
      }
    },
  );
