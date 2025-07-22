import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { createAtividade, getAtividade, updateAtividade } from './service';
import { useForm } from 'react-hook-form';
import {
  AtividadeForm,
  GetAtividadeResponse,
  MutateAtividadeParams,
} from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { atividadeSchema } from './schema';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthProvider';
import { toDate } from '@/utils/dates';
import { ATIVIDADE_LIST_KEY } from '../useAtividades';

export const ATIVIDADE_UNIQUE_KEY = 'atividade';

enum PAGE_STATE {
  EDIT = 'Atualizar',
  VIEW = 'Visualizar',
  CREATE = 'Criar',
}

export function useAtividadesForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const { auth } = useAuth();

  if (window.scrollY) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let currentPage = PAGE_STATE.CREATE;
  if (location.pathname.includes('atualizar')) {
    currentPage = PAGE_STATE.EDIT;
  } else if (location.pathname.includes('visualizar')) {
    currentPage = PAGE_STATE.VIEW;
  }

  const isEditOrViewMode =
    currentPage === PAGE_STATE.EDIT || currentPage === PAGE_STATE.VIEW;

  const atividadeId =
    isEditOrViewMode && params.atividadeId ? Number(params.atividadeId) : null;

  const authenticatedPessoaId = auth ? auth.pessoa.id : undefined;

  const { data: atividadeResponse, isPending: isFetchingAtividade } = useQuery<
    GetAtividadeResponse,
    Error,
    GetAtividadeResponse,
    [string, number]
  >({
    queryFn: () => getAtividade(atividadeId!),
    queryKey: ['atividade', atividadeId!],
    enabled: isEditOrViewMode && !!atividadeId,
  });

  const currentAtividade = atividadeResponse?.data;

  if (isEditOrViewMode && !isFetchingAtividade && !currentAtividade) {
    navigate('/siscontrol/atividades');
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Atividades', href: '/siscontrol/atividades' },
    { label: `${currentPage} atividade` },
  ];

  const { pessoaId, dataReferencia, atividade } = currentAtividade || {};

  const initialValues: AtividadeForm = {
    dataReferencia: dataReferencia ? toDate(dataReferencia) : null,
    atividade: atividade || '',
  };

  const isViewerMode =
    location.pathname.includes('visualizar') &&
    !!currentAtividade &&
    authenticatedPessoaId !== pessoaId;

  const { control, formState, handleSubmit, reset, setError } =
    useForm<AtividadeForm>({
      resolver: zodResolver(atividadeSchema),
      values: initialValues,
    });

  function executeAtividadeMutation(data: AtividadeForm) {
    if (currentAtividade) {
      const { id } = currentAtividade;

      return updateAtividade(id, data);
    }

    return createAtividade(data);
  }

  const {
    mutate,
    error,
    isPending: isMutatingAtividade,
  } = useMutation<void, AxiosError, MutateAtividadeParams, unknown>({
    mutationFn: executeAtividadeMutation,
    onSuccess: () => {
      toast.success('A atividade foi salva com sucesso!');

      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, param] = [query.queryKey[0], query.queryKey[1]];

          const isAtividadeListKey = key === ATIVIDADE_LIST_KEY;
          const isCurrentAtividadeKey =
            key === ATIVIDADE_UNIQUE_KEY && param === atividadeId!;

          if (isAtividadeListKey || isCurrentAtividadeKey) {
            return true;
          }

          return false;
        },
      });

      if (!isEditOrViewMode) {
        reset();
      }
    },
  });

  const { isDirty } = formState;

  const isFieldsDisabled = isEditOrViewMode && isFetchingAtividade;
  const isButtonDisabled =
    (isEditOrViewMode && !isDirty) ||
    (isEditOrViewMode && isFetchingAtividade) ||
    isMutatingAtividade;

  function onSubmit(data: AtividadeForm) {
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
    isViewerMode,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    handleSubmit,
    onSubmit,
  };
}
