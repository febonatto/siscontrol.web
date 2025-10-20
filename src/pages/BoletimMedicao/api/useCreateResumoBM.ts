import { api } from '@/configs/httpClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface CreateBmResumoParams {
  numeroBm: number;
  dataReferencia: Date;
  qualidadeEntregaveis?: string;
  revisaoQualidadeEntregavelProjeto?: string;
  qualidadePrazoEntregaveis?: string;
  qualidadeSupervisaoObra?: string;
  qualidadeDfo?: string;
  qualidadeSegurancaOperacional?: string;
  qualidadeServico?: string;
  indiceReajusteAcumulado?: number;
  removeExistent?: boolean;
}

function createResumo(bmResumo: CreateBmResumoParams): Promise<void> {
  return api.post(`/bm`, bmResumo);
}

export function useCreateResumoBM() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    void,
    AxiosError,
    CreateBmResumoParams,
    unknown
  >({
    mutationFn: createResumo,
    onSuccess: () => {
      toast.success('Resumo criado com sucesso!');

      queryClient.invalidateQueries({
        queryKey: ['bm-resumos'],
      });
    },
  });

  return {
    isCreatingResumo: isPending,
    handleCreateResumo: mutate,
  };
}
