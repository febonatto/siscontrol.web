import { useMemo, useState } from 'react';
import {
  GetExperienciasPessoaInfinite,
  GetExperienciasPessoaParams,
  GetExperienciasPessoaResponse,
} from './types';
import { DEFAULT_PER_PAGE } from '@/configs/constants';
import { usePessoasOptions } from '@/hooks/usePessoasOptions';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteExperienciaPessoa, getExperienciasPessoa } from './service';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthProvider';
import { PESSOA_LIST_KEY } from '../Pessoas/usePessoa';
import { PersonRoles } from '@/types';

export const EXPERIENCIAS_PESSOA_LIST_KEY = 'experiencias-pessoa';

export function useExperienciasPessoa() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { auth } = useAuth();

  const authenticatedPessoaId = auth ? auth.pessoa.id : undefined;

  const loggedNivelPermissao = auth?.pessoa.nivelPermissao || 0;

  const hasExperienciaFullControl =
    loggedNivelPermissao === PersonRoles.PMO_WITH_BI ||
    loggedNivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITH_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  const [pessoaId, setPessoaId] = useState<string | undefined>(
    String(authenticatedPessoaId),
  );
  const [experienciaPessoaBeingDeletedId, setExperienciaPessoaBeingDeletedId] =
    useState<number | null>(null);

  const params: GetExperienciasPessoaParams = useMemo(
    () => ({
      ...(hasExperienciaFullControl
        ? { pessoaId: Number(pessoaId) }
        : { pessoaId: Number(authenticatedPessoaId) }),
      perPage: DEFAULT_PER_PAGE,
    }),
    [pessoaId],
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Experiências Profissionais' },
  ];
  const shouldShowDeleteConfirmation = !!experienciaPessoaBeingDeletedId;

  const { pessoasOptions, isFetchingPessoasOptions } = usePessoasOptions();

  function handleExecuteQuery(
    cursor?: number,
  ): Promise<GetExperienciasPessoaResponse> {
    const paramsWithCursor = {
      ...params,
      ...(cursor && { cursor }),
    };

    return getExperienciasPessoa(paramsWithCursor);
  }

  const {
    data,
    isFetching: isFetchingExperienciasPessoa,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    GetExperienciasPessoaResponse,
    AxiosError,
    GetExperienciasPessoaInfinite,
    [string, GetExperienciasPessoaParams],
    number | undefined
  >({
    queryFn: ({ pageParam }) => handleExecuteQuery(pageParam),
    queryKey: [EXPERIENCIAS_PESSOA_LIST_KEY, params],
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.data.cursor;
      return nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    enabled: !!pessoaId,
  });

  const experienciasPessoa =
    data?.pages.flatMap((page) => page.data.data || []) || [];
  const hasExperienciasPessoa = experienciasPessoa.length > 0;
  const showFetchingLoader =
    !hasExperienciasPessoa && isFetchingExperienciasPessoa;
  const showEmptyState =
    !isFetchingNextPage &&
    !isFetchingExperienciasPessoa &&
    !hasExperienciasPessoa;
  const emptyMessage =
    !!pessoaId && showEmptyState
      ? 'Nenhuma experiência profissional cadastrada para o colaborador selecionado!'
      : 'Selecione um colaborador para visualizar suas experiências profissionais.';

  function handlePessoaIdChange(pessoaId: string | undefined) {
    setPessoaId(pessoaId);
  }

  function handleExperienciaPessoaBeingEdited(experienciaPessoaId: number) {
    navigate(
      `/siscontrol/experiencias-pessoa/atualizar/${experienciaPessoaId}`,
    );
  }

  function handleDeleteExperienciaPessoa(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!experienciaPessoaBeingDeletedId) {
        reject();
        return;
      }

      resolve(deleteExperienciaPessoa(experienciaPessoaBeingDeletedId));
    });
  }

  const {
    mutate: executeDeleteExperienciaPessoa,
    isPending: isDeletingExperienciaPessoa,
  } = useMutation<void, AxiosError, void, unknown>({
    mutationFn: handleDeleteExperienciaPessoa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];

          const isPessoasListKey = key === PESSOA_LIST_KEY;
          const isExperienciaPessoaListKey =
            key === EXPERIENCIAS_PESSOA_LIST_KEY;

          if (isPessoasListKey || isExperienciaPessoaListKey) {
            return true;
          }

          return false;
        },
      });

      setExperienciaPessoaBeingDeletedId(null);
    },
  });

  function displayDeleteConfirmation(experienciaPessoaId: number) {
    setExperienciaPessoaBeingDeletedId(experienciaPessoaId);
  }

  function hideDeleteConfirmation() {
    setExperienciaPessoaBeingDeletedId(null);
  }

  return {
    pessoaId,
    breadcrumbItems,
    shouldShowDeleteConfirmation,
    pessoasOptions,
    isFetchingPessoasOptions,
    experienciasPessoa,
    hasExperienciasPessoa,
    hasExperienciaFullControl,
    showFetchingLoader,
    showEmptyState,
    emptyMessage,
    isFetchingNextPage,
    hasNextPage,
    isDeletingExperienciaPessoa,
    handlePessoaIdChange,
    fetchNextPage,
    handleExperienciaPessoaBeingEdited,
    executeDeleteExperienciaPessoa,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
  };
}
