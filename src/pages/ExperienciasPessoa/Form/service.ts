import { api } from '@/configs/httpClient';
import { ExperienciaPessoaForm, GetExperienciaPessoaResponse } from './types';

export function createExperienciaPessoa(
  data: ExperienciaPessoaForm,
): Promise<void> {
  return api.post('/experiencias-pessoa', data);
}

export function getExperienciasPessoa(
  experienciaPessoaId: number,
): Promise<GetExperienciaPessoaResponse> {
  return api.get(`/experiencias-pessoa/${experienciaPessoaId}`);
}

export function updateExperienciaPessoa(
  experienciaPessoaId: number,
  data: ExperienciaPessoaForm,
): Promise<void> {
  return api.put(`/experiencias-pessoa/${experienciaPessoaId}`, data);
}
