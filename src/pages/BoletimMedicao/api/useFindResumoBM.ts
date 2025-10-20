import { api } from '@/configs/httpClient';
import { BmResumo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type FindResumoBmResponse = AxiosResponse<BmResumo>;

function findResumoById(id: number): Promise<FindResumoBmResponse> {
  return api.get('/bm/find-one', {
    params: {
      type: 'resumo',
      id,
    },
  });
}

export function useFindResumoBM(id: number | undefined) {
  const { data, isFetching } = useQuery<
    FindResumoBmResponse,
    AxiosError,
    FindResumoBmResponse,
    [string, number]
  >({
    queryFn: () => findResumoById(id!),
    queryKey: ['bm-resumo', id!],
    enabled: Boolean(id),
  });

  const resumo = data?.data;

  return { resumo, showFetchingResumo: isFetching };
}
