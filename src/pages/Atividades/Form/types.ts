import { z } from 'zod';
import { atividadeSchema } from './schema';
import { AtividadePessoa } from '@/types';
import { AxiosResponse } from 'axios';

export type GetAtividadeResponse = AxiosResponse<AtividadePessoa | null>;

export type AtividadeForm = z.infer<typeof atividadeSchema>;

export type MutateAtividadeParams = AtividadeForm;
