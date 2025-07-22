import { Aeroporto } from '@/types';
import { AxiosResponse } from 'axios';

type GetAeroportosData = {
  cursor: number | undefined;
  total: number;
  data: Aeroporto[];
};

export type GetAeroportosResponse = AxiosResponse<GetAeroportosData>;

export type GetAeroportosParams = {
  perPage: number;
  cursor?: number;
};

export type GetAeroportosInfinite = {
  pages: AxiosResponse<GetAeroportosData>[];
  pageParams: (number | undefined)[];
};
