import { api } from '@/configs/httpClient';
import { EntrarParams, EntrarResponse } from './types';

export function signIn(params: EntrarParams): Promise<EntrarResponse> {
  return api.post('/autenticacao/entrar', params);
}
