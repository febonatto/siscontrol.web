import {
  ExperienciaPessoa,
  GetPaginatedQueryParams,
  InfiniteQuery,
  PaginatedQuery,
} from '@/types';
import { AxiosResponse } from 'axios';

export type GetExperienciasPessoaResponse = AxiosResponse<
  PaginatedQuery<ExperienciaPessoa>
>;

export type GetExperienciasPessoaParams = GetPaginatedQueryParams & {
  pessoaId: number;
};

export type GetExperienciasPessoaInfinite =
  InfiniteQuery<GetExperienciasPessoaResponse>;
