import {
  GetPaginatedQueryParams,
  InfiniteQuery,
  PaginatedQuery,
  PartidaOrcamentaria,
} from '@/types';
import { AxiosResponse } from 'axios';

export type GetPartidaOrcamentariasResponse = AxiosResponse<
  PaginatedQuery<PartidaOrcamentaria>
>;

export type GetPartidaOrcamentariaParams = GetPaginatedQueryParams & {
  query?: string;
};

export type GetPartidaOrcamentariasInfinite =
  InfiniteQuery<GetPartidaOrcamentariasResponse>;
