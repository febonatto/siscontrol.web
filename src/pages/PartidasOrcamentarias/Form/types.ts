import { PartidaOrcamentaria } from '@/types';
import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { partidaOrcamentariaSchema } from './schema';

export type GetPartidaOrcamentariaResponse =
  AxiosResponse<PartidaOrcamentaria | null>;

export type PartidaOrcamentariaForm = z.infer<typeof partidaOrcamentariaSchema>;

export type MutatePartidaOrcamentariaParams = PartidaOrcamentariaForm;

export type MutateDemobilizePessoaParams = {
  partidaOrcamentariaId: number;
  pessoaId: number;
  pessoaPartidaId: number;
  dataDesmobilizacaoReal: Date;
};
