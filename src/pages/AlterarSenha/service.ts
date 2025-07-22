import { api } from '@/configs/httpClient';
import { MutationAlterarSenhaParams } from './types';

export function alterarSenha(data: MutationAlterarSenhaParams): Promise<void> {
  return api.patch('/pessoas/alterar-senha', data);
}
