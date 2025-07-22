import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { getAeroportoOptions } from './service';

interface AeroportoOption {
  id: number;
  nome: string;
}

export type GetAeroportoOptionsResponse = AxiosResponse<AeroportoOption[]>;

export const AEROPORTO_OPTIONS_LIST_KEY = 'aeroporto-options';

export function useAeroportoOptions() {
  const { data, isPending: isFetchingAeroportoOptions } = useQuery<
    GetAeroportoOptionsResponse,
    AxiosError,
    GetAeroportoOptionsResponse,
    [string]
  >({
    queryFn: getAeroportoOptions,
    queryKey: [AEROPORTO_OPTIONS_LIST_KEY],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const options = data?.data || [];
  const aeroportoOptions = options.map(({ id, nome }) => ({
    value: String(id),
    label: nome,
  }));

  return {
    aeroportoOptions,
    isFetchingAeroportoOptions,
  };
}
