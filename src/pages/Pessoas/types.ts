import {
  GetPaginatedQueryParams,
  InfiniteQuery,
  PaginatedQuery,
  Pessoa,
} from '@/types';
import { AxiosResponse } from 'axios';

type GetPessoasData = PaginatedQuery<Pessoa>;

export type GetPessoasResponse = AxiosResponse<GetPessoasData>;

export type GetPessoasParams = GetPaginatedQueryParams & {
  nome?: string;
};

export type GetPessoasInfinite = InfiniteQuery<GetPessoasResponse>;
