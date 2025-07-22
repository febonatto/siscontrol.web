import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  AeroportoForm,
  QueryAeroportoResponse,
  MutationAeroportoParams,
} from './types';
import { AxiosError } from 'axios';
import { createAeroporto, getAeroporto, updateAeroporto } from './service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aeroportoSchema } from './schema';
import { toast } from 'sonner';
import { cnpjMask } from '@/utils/masks';
import { AEROPORTO_LIST_KEY } from '../useAeroportos';
import { AEROPORTO_OPTIONS_LIST_KEY } from '@/hooks/useAeroportoOptions';

const AEROPORTO_UNIQUE_KEY = 'aeroporto';

export function useAeroportosForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  if (window.scrollY) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isEditionMode = location.pathname.includes('atualizar');
  const aeroportoId =
    isEditionMode && params.aeroportoId ? Number(params.aeroportoId) : null;

  const { data: aeroportoResponse, isPending: isFetchingAeroporto } = useQuery<
    QueryAeroportoResponse,
    AxiosError,
    QueryAeroportoResponse,
    [string, number]
  >({
    queryFn: () => getAeroporto(aeroportoId!),
    queryKey: [AEROPORTO_UNIQUE_KEY, aeroportoId!],
    enabled: isEditionMode && Boolean(aeroportoId),
  });

  const aeroportoBeingEdited = aeroportoResponse?.data;

  if (isEditionMode && !isFetchingAeroporto && !aeroportoBeingEdited) {
    navigate('/siscontrol/aeroportos');
  }

  const currentPage = isEditionMode ? 'Atualizar aeroporto' : 'Criar aeroporto';

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Aeroportos', href: '/siscontrol/aeroportos' },
    { label: currentPage },
  ];

  const { sigla, nome, lote, cnpj, estado, cidade, endereco } =
    aeroportoBeingEdited || {};

  const initialValues: AeroportoForm = {
    sigla: sigla || '',
    nome: nome || '',
    lote: lote ? String(lote) : '',
    cnpj: cnpj ? cnpjMask(cnpj) : '',
    estado: estado || '',
    cidade: cidade || '',
    endereco: endereco || '',
  };

  const { control, formState, handleSubmit, reset, setError } =
    useForm<AeroportoForm>({
      resolver: zodResolver(aeroportoSchema),
      values: initialValues,
    });

  function executeAeroportoMutation(data: AeroportoForm) {
    if (aeroportoBeingEdited) {
      const { id } = aeroportoBeingEdited;

      return updateAeroporto(id, data);
    }

    return createAeroporto(data);
  }

  const {
    mutate,
    error,
    isPending: isMutatingAeroporto,
  } = useMutation<void, AxiosError, MutationAeroportoParams, unknown>({
    mutationFn: executeAeroportoMutation,
    onSuccess: () => {
      toast.success('Os dados do aeroporto foram salvos com sucesso!');

      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, param] = [query.queryKey[0], query.queryKey[1]];

          const isAeroportoListKey = key === AEROPORTO_LIST_KEY;
          const isCurrentAeroportoUniqueKey =
            key === AEROPORTO_UNIQUE_KEY && param === aeroportoId!;
          const isAeroportoOptionsListKey = key === AEROPORTO_OPTIONS_LIST_KEY;

          if (
            isAeroportoListKey ||
            isAeroportoOptionsListKey ||
            isCurrentAeroportoUniqueKey
          ) {
            return true;
          }

          return false;
        },
      });

      if (!isEditionMode) {
        reset();
      }
    },
  });

  const { isDirty } = formState;

  const isFieldsDisabled =
    (isEditionMode && isFetchingAeroporto) || isMutatingAeroporto;
  const isButtonDisabled =
    (isEditionMode && !isDirty) ||
    (isEditionMode && isFetchingAeroporto) ||
    isMutatingAeroporto;

  function onSubmit(data: AeroportoForm) {
    mutate(data);
  }

  if (error && error.response) {
    const errorData = error.response.data as any;

    if (
      errorData.type === 'Validation Exception' ||
      errorData.error === 'Conflict'
    ) {
      const validationErrors = errorData.data as any[];

      validationErrors.forEach((validationError) => {
        const { path, message } = validationError;

        setError(path, { message });
      });
    }
  }

  return {
    breadcrumbItems,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    handleSubmit,
    onSubmit,
  };
}
