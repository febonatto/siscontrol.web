import { api } from '@/configs/httpClient';
import {
  GetPartidaOrcamentariaParams,
  GetPartidaOrcamentariasResponse,
} from './types';

export function getPartidasOrcamentarias(
  params: GetPartidaOrcamentariaParams,
): Promise<GetPartidaOrcamentariasResponse> {
  return api.get('/partidas-orcamentarias', { params });
}

export function deletePartidaOrcamentaria(
  partidaOrcamentariaId: number,
): Promise<void> {
  return api.delete(`/partidas-orcamentarias/${partidaOrcamentariaId}`);
}
