import { api } from '@/configs/httpClient';
import {
  GetExperienciasPessoaParams,
  GetExperienciasPessoaResponse,
} from './types';

export function getExperienciasPessoa(
  params: GetExperienciasPessoaParams,
): Promise<GetExperienciasPessoaResponse> {
  return api.get('/experiencias-pessoa', { params });
}

export function deleteExperienciaPessoa(
  experienciaPessoaId: number,
): Promise<void> {
  return api.delete(`/experiencias-pessoa/${experienciaPessoaId}`);
}
