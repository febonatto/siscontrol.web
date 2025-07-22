import { api } from '@/configs/httpClient';
import { GetPessoasParams, GetPessoasResponse } from './types';

export function getPessoas(
  params: GetPessoasParams,
): Promise<GetPessoasResponse> {
  return api.get('/pessoas', { params });
}
