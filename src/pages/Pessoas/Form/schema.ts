import { EstadoCivil, Genero, TipoContratacao } from '@/types';
import { currency } from '@/validators/currency';
import { z } from 'zod';

export const pessoaSchema = z
  .object({
    nomeCompleto: z
      .string()
      .min(1, '')
      .max(50, 'O campo excede a quantidade máxima de 50 caracteres'),
    nomeReduzido: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    matricula: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(15, 'O campo excede a quantidade máxima de 15 caracteres')
        .nullable(),
    ),
    numeroCnh: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .length(11, 'O campo não segue os requisitos informados')
        .nullable(),
    ),
    dataNascimento: z.preprocess(
      (value) => (!value ? null : value),
      z.date().nullable(),
    ),
    genero: z.nativeEnum(Genero).nullable(),
    estadoCivil: z.nativeEnum(EstadoCivil).nullable(),
    emailPessoal: z
      .string()
      .min(1, '')
      .max(100, 'O campo excede a quantidade máxima de 100 caracteres')
      .email('O campo não segue os requisitos informados')
      .nullable(),
    emailCorporativo: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(100, 'O campo excede a quantidade máxima de 100 caracteres')
        .email('O campo não segue os requisitos informados')
        .nullable(),
    ),
    telefonePessoal: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(25, 'O campo excede a quantidade máxima de 25 caracteres')
        .nullable(),
    ),
    telefoneCorporativo: z.preprocess(
      (value) => (value === '' ? null : value),
      z.string().min(1, '').nullable(),
    ),
    pais: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    estado: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    cidade: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    codigoPostal: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .regex(/^\d{5}-\d{3}$/, 'O campo não segue os requisitos informados')
        .nullable(),
    ),
    endereco: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(150, 'O campo excede a quantidade máxima de 150 caracteres')
        .nullable(),
    ),
    formacao: z.preprocess(
      (value) => (value === '' ? null : value),
      z.string().min(1, '').nullable(),
    ),
    resumoCurricular: z.preprocess(
      (value) => (value === '' ? null : value),
      z.string().min(1, '').nullable(),
    ),
    tamanhoSapato: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .regex(/^-?\d+$/, 'O campo deve conter apenas números')
        .refine((value) => Number(value) > 0, 'O campo deve ser positivo')
        .nullable(),
    ),
    tamanhoCamisa: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(3, 'O campo excede o máximo de 3 caracteres')
        .nullable(),
    ),
    funcao: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    remuneracao: currency({ optional: true }),
    remuneracaoPactuada: currency({ optional: true }),
    regimeContratacao: z.preprocess(
      (value) => (value === '' ? null : value),
      z.nativeEnum(TipoContratacao).nullable(),
    ),
    cnpj: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(30, 'O campo excede a quantidade máxima de 30 caracteres')
        .nullable(),
    ),
    nomeEmpresa: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(100, 'O campo excede a quantidade máxima de 100 caracteres')
        .nullable(),
    ),
    dataContratacao: z.preprocess(
      (value) => (!value ? null : value),
      z.date().nullable(),
    ),
    dataEncerramento: z.preprocess(
      (value) => (!value ? null : value),
      z.date().nullable(),
    ),
    status: z.boolean().default(true),
    nivelPermissao: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .regex(/^-?\d+$/, 'O campo deve conter apenas números')
        .refine(
          (value) => Number(value) >= 0,
          'O campo ser maior ou igual a 0!',
        )
        .refine(
          (value) => Number(value) <= 6,
          'O campo ser menor ou igual a 6!',
        )
        .nullable(),
    ),
    idColete: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(10, 'O campo excede a quantidade máxima de 10 caracteres')
        .nullable(),
    ),
    nomeCoordenador: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    frenteMedicao: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(50, 'O campo excede a quantidade máxima de 50 caracteres')
        .nullable(),
    ),
    pis: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(15, 'O campo excede a quantidade máxima de 15 caracteres')
        .nullable(),
    ),
    rg: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(25, 'O campo excede a quantidade máxima de 25 caracteres')
        .nullable(),
    ),
    categoriaCnh: z.preprocess(
      (value) => (value === '' ? null : value),
      z
        .string()
        .min(1, '')
        .max(5, 'O campo excede a quantidade máxima de 5 caracteres')
        .nullable(),
    ),
    dataVencimentoCnh: z.preprocess(
      (value) => (!value ? null : value),
      z.date().nullable(),
    ),
  })
  .superRefine(({ regimeContratacao, nivelPermissao }, ctx) => {
    if (!regimeContratacao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '',
        path: ['regimeContratacao'],
      });
    }
    if (!nivelPermissao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '',
        path: ['nivelPermissao'],
      });
    }
  });
