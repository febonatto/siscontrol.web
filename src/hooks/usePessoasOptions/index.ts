import { useQuery } from '@tanstack/react-query';
import { getPessoasOptions, GetPessoasOptionsResponse } from './service';
import { AxiosError } from 'axios';

export const PESSOA_OPTIONS_LIST_KEY = 'pessoas-options';

export function usePessoasOptions() {
  const { data, isPending: isFetchingPessoasOptions } = useQuery<
    GetPessoasOptionsResponse,
    AxiosError,
    GetPessoasOptionsResponse,
    [string]
  >({
    queryFn: getPessoasOptions,
    queryKey: [PESSOA_OPTIONS_LIST_KEY],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const options = data?.data || [];
  const pessoasOptions = options.map(({ id, nomeCompleto }) => ({
    value: String(id),
    label: nomeCompleto,
  }));

  return {
    pessoasOptions,
    isFetchingPessoasOptions,
  };
}
