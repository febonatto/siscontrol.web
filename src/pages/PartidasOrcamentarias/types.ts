import {
  GetPaginatedQueryParams,
  InfiniteQuery,
  PaginatedQuery,
  PartidaOrcamentaria,
  Pessoa,
} from '@/types';
import { AxiosResponse } from 'axios';

export type ListPartidasOrcamentarias = PartidaOrcamentaria & {
  pessoa: Pessoa | null;
};

export type GetPartidaOrcamentariasResponse = AxiosResponse<
  PaginatedQuery<ListPartidasOrcamentarias>
>;

export type GetPartidaOrcamentariaParams = GetPaginatedQueryParams & {
  query?: string;
};

export type GetPartidaOrcamentariasInfinite =
  InfiniteQuery<GetPartidaOrcamentariasResponse>;
