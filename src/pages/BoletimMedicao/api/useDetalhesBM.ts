import { api } from '@/configs/httpClient';
import { BmDetalhe } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type GetDetalhesResponse = AxiosResponse<BmDetalhe[]>;

function getDetalhes(
  idBm: string,
): Promise<AxiosResponse<GetDetalhesResponse>> {
  return api.get<GetDetalhesResponse>('/bm', {
    params: {
      idBm,
      type: 'detalhe',
    },
  });
}

export function useDetalhesBM(idBm?: string) {
  const { data, isFetching } = useQuery<
    AxiosResponse<GetDetalhesResponse>,
    AxiosError,
    GetDetalhesResponse,
    [string, string]
  >({
    queryFn: () => getDetalhes(idBm!),
    queryKey: ['bm-detalhes', idBm!],
    enabled: !!idBm,
  });

  const detalhes = data?.data ?? [];
  const hasDetalhes = detalhes.length > 0;
  const showFetchingDetalhes = !hasDetalhes && isFetching;
  const showEmptyDetalhes = !hasDetalhes && !isFetching;

  return {
    detalhes,
    hasDetalhes,
    showFetchingDetalhes,
    showEmptyDetalhes,
  };
}
