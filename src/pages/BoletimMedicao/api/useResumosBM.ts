import { api } from '@/configs/httpClient';
import { BmResumo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type GetResumosResponse = AxiosResponse<BmResumo[]>;

function getResumos(): Promise<GetResumosResponse> {
  return api.get('/bm', {
    params: {
      type: 'resumo',
    },
  });
}

export function useResumosBM() {
  const { data, isFetching } = useQuery<
    GetResumosResponse,
    AxiosError,
    GetResumosResponse,
    [string]
  >({
    queryFn: getResumos,
    queryKey: ['bm-resumos'],
  });

  const resumos = data?.data ?? [];
  const hasResumos = resumos.length > 0;
  const showFetchingResumos = !hasResumos && isFetching;
  const showEmptyResumos = !hasResumos && !isFetching;

  return {
    resumos,
    hasResumos,
    showFetchingResumos,
    showEmptyResumos,
  };
}
