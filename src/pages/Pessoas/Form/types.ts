import { z } from 'zod';
import { pessoaSchema } from './schema';
import { PartidaOrcamentaria, Pessoa } from '@/types';
import { AxiosResponse } from 'axios';

type PessoaWithPartidaOrcamentaria = Pessoa & {
  partidaOrcamentaria?: PartidaOrcamentaria & {
    aeroporto: string;
  };
};

export type GetPessoaResponse =
  AxiosResponse<PessoaWithPartidaOrcamentaria | null>;

export type PessoaForm = z.infer<typeof pessoaSchema>;

export type MutatePessoaParams = PessoaForm;
