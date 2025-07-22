import { api } from '@/configs/httpClient';
import { GetPessoaResponse, PessoaForm } from './types';

export function createPessoa(data: PessoaForm): Promise<void> {
  return api.post('/pessoas', data);
}

export function getPessoa(pessoaId: number): Promise<GetPessoaResponse> {
  return api.get(`/pessoas/${pessoaId}`);
}

export function updatePessoa(
  pessoaId: number,
  data: PessoaForm,
): Promise<void> {
  return api.put(`/pessoas/${pessoaId}`, data);
}
