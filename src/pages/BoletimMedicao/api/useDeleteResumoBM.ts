import { api } from '@/configs/httpClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

function deleteResumoById(idResumo: number): Promise<void> {
  return api.delete(`/bm/${idResumo}`);
}

export function useDeleteResumoBM() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<void, AxiosError, number, unknown>({
    mutationFn: deleteResumoById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bm-resumos'],
      });
    },
  });

  return {
    isDeletingResumo: isPending,
    handleDeleteResumo: mutate,
  };
}
