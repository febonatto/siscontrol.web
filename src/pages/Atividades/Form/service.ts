import { api } from '@/configs/httpClient';
import { AtividadeForm, GetAtividadeResponse } from './types';

export function createAtividade(data: AtividadeForm): Promise<void> {
  return api.post('/atividades-pessoa', data);
}

export function getAtividade(
  atividadeId: number,
): Promise<GetAtividadeResponse> {
  return api.get(`/atividades-pessoa/${atividadeId}`);
}

export function updateAtividade(
  atividadeId: number,
  data: AtividadeForm,
): Promise<void> {
  return api.put(`/atividades-pessoa/${atividadeId}`, data);
}
