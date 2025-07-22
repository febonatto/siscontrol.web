import { z } from 'zod';
import { alterarSenhaSchema } from './schema';

export type AlterarSenhaForm = z.infer<typeof alterarSenhaSchema>;

export type MutationAlterarSenhaParams = AlterarSenhaForm;
