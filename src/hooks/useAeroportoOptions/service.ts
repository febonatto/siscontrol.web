import { api } from '@/configs/httpClient';
import { GetAeroportoOptionsResponse } from '.';

export function getAeroportoOptions(): Promise<GetAeroportoOptionsResponse> {
  return api.get('/aeroportos/options');
}
