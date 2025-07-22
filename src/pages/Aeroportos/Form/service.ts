import { api } from '@/configs/httpClient';
import { AeroportoForm, QueryAeroportoResponse } from './types';

export function createAeroporto(data: AeroportoForm): Promise<void> {
  return api.post('/aeroportos', data);
}

export function getAeroporto(
  aeroportoId: number,
): Promise<QueryAeroportoResponse> {
  return api.get(`/aeroportos/${aeroportoId}`);
}

export function updateAeroporto(
  aeroportoId: number,
  data: AeroportoForm,
): Promise<void> {
  return api.put(`/aeroportos/${aeroportoId}`, data);
}

export function deleteAeroporto(aeroportoId: number): Promise<void> {
  return api.delete(`/aeroportos/${aeroportoId}`);
}
