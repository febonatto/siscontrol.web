import { api } from '@/configs/httpClient';
import { GetAeroportosParams, GetAeroportosResponse } from './types';

export function getAeroportos(
  params: GetAeroportosParams,
): Promise<GetAeroportosResponse> {
  return api.get('/aeroportos', { params });
}
