import { DateISO, PartidaOrcamentaria } from '@/types';
import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { partidaOrcamentariaSchema } from './schema';

export type FindOnePartidaOrcamentaria = PartidaOrcamentaria & {
  isCurrent: boolean;
  current: {
    id: number;
    dataSME: DateISO | null;
    numeroSME: number | null;
  } | null;
  history: {
    id: number;
    dataSME: DateISO | null;
    numeroSME: number | null;
  }[];
};

export type GetPartidaOrcamentariaResponse =
  AxiosResponse<FindOnePartidaOrcamentaria | null>;

export type PartidaOrcamentariaForm = z.infer<typeof partidaOrcamentariaSchema>;

export type MutatePartidaOrcamentariaParams = PartidaOrcamentariaForm;

export type MutateDemobilizePessoaParams = {
  partidaOrcamentariaId: number;
  pessoaId: number;
  pessoaPartidaId: number;
  dataDesmobilizacaoReal: Date;
};
