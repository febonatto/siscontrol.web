import { Aeroporto } from '@/types';
import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { aeroportoSchema } from './schema';

export type QueryAeroportoResponse = AxiosResponse<Aeroporto | null>;

export type AeroportoForm = z.infer<typeof aeroportoSchema>;

export type MutationAeroportoParams = AeroportoForm;
