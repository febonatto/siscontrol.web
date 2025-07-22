import {
  AtividadePessoa,
  GetPaginatedQueryParams,
  InfiniteQuery,
  PaginatedQuery,
  Pessoa,
} from '@/types';
import { AxiosResponse } from 'axios';

type PickedPessoa = Pick<Pessoa, 'nomeCompleto'>;

type AtividadePessoaWithPessoa = AtividadePessoa & {
  pessoa: PickedPessoa;
};

export type GetAtividadesResponse = AxiosResponse<
  PaginatedQuery<AtividadePessoaWithPessoa>
>;

export type GetAtividadesParams = GetPaginatedQueryParams & {
  dataReferencia: string;
  pessoaId?: number;
};

export type GetAtividadesInfinite = InfiniteQuery<GetAtividadesResponse>;
