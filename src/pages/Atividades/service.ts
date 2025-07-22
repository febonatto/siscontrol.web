import { api } from '@/configs/httpClient';
import { GetAtividadesParams, GetAtividadesResponse } from './types';

export function getAtividades(
  params: GetAtividadesParams,
): Promise<GetAtividadesResponse> {
  return api.get('/atividades-pessoa', { params });
}

export function deleteAtividade(id: number): Promise<void> {
  return api.delete(`/atividades-pessoa/${id}`);
}
