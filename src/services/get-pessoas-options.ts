import { api } from '@/configs/httpClient';
import { AxiosResponse } from 'axios';

interface PessoaOption {
  id: number;
  nome: string;
  sobrenome: string | null;
}

export type GetPessoasOptionsResponse = AxiosResponse<PessoaOption[]>;

export function getPessoasOptions(): Promise<GetPessoasOptionsResponse> {
  return api.get('/pessoas/options');
}
