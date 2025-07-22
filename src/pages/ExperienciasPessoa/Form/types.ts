import { ExperienciaPessoa } from '@/types';
import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { baseExperienciaPessoaSchema } from './schema';

export type GetExperienciaPessoaResponse =
  AxiosResponse<ExperienciaPessoa | null>;

export type ExperienciaPessoaForm = z.infer<typeof baseExperienciaPessoaSchema>;

export type MutateExperienciaPessoaParams = ExperienciaPessoaForm;
