import { api } from '@/configs/httpClient';
import {
  GetPartidaOrcamentariaResponse,
  MutateDemobilizePessoaParams,
  PartidaOrcamentariaForm,
} from './types';

export function createPartidaOrcamentaria(
  data: PartidaOrcamentariaForm,
): Promise<void> {
  return api.post('/partidas-orcamentarias', data);
}

export function getPartidaOrcamentaria(
  partidaOrcamentariaId: number,
): Promise<GetPartidaOrcamentariaResponse> {
  return api.get(`/partidas-orcamentarias/${partidaOrcamentariaId}`);
}

export function updatePartidaOrcamentaria(
  partidaOrcamentariaId: number,
  data: PartidaOrcamentariaForm,
): Promise<void> {
  return api.patch(`/partidas-orcamentarias/${partidaOrcamentariaId}`, {
    ...data,
    dataSME: new Date(),
    numeroSME: 1,
  });
}

export function demobilizePessoa(
  data: MutateDemobilizePessoaParams,
): Promise<void> {
  return api.post('/partidas-orcamentarias/desmobilizar-pessoa', data);
}
