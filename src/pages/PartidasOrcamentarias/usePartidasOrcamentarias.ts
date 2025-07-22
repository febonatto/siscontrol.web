import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  GetPartidaOrcamentariaParams,
  GetPartidaOrcamentariasInfinite,
  GetPartidaOrcamentariasResponse,
} from './types';
import { DEFAULT_PER_PAGE } from '@/configs/constants';
import { AxiosError } from 'axios';
import { deletePartidaOrcamentaria, getPartidasOrcamentarias } from './service';
import useDebounce from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthProvider';
import { PersonRoles } from '@/types';

export const PARTIDA_ORCAMENTARIA_LIST_KEY = 'partidas-orcamentarias';

export function usePartidasOrcamentarias() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const nivelPermissao = auth?.pessoa?.nivelPermissao;
  const hasAuthorization =
    nivelPermissao === PersonRoles.PMO_WITH_BI ||
    nivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    nivelPermissao === PersonRoles.BOAB_WITH_BI ||
    nivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query);
  const [
    partidaOrcamentariaBeingDeletedId,
    setPartidaOrcamentariaBeingDeletedId,
  ] = useState<number | null>(null);

  const params: GetPartidaOrcamentariaParams = useMemo(
    () => ({
      ...(debouncedQuery && { query: debouncedQuery }),
      perPage: DEFAULT_PER_PAGE,
    }),
    [debouncedQuery],
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Partidas Orçamentárias' },
  ];

  const shouldShowDeleteConfirmation = !!partidaOrcamentariaBeingDeletedId;

  function handleExecuteQuery(cursor?: number) {
    const paramsWithCursor = {
      ...params,
      ...(cursor && { cursor }),
    };

    return getPartidasOrcamentarias(paramsWithCursor);
  }

  const {
    data,
    isFetching: isFetchingPartidasOrcamentaris,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    GetPartidaOrcamentariasResponse,
    AxiosError,
    GetPartidaOrcamentariasInfinite,
    [string, GetPartidaOrcamentariaParams],
    number | undefined
  >({
    queryFn: ({ pageParam }) => handleExecuteQuery(pageParam),
    queryKey: [PARTIDA_ORCAMENTARIA_LIST_KEY, params],
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.data.cursor;
      return nextCursor ?? undefined;
    },
    initialPageParam: undefined,
  });

  const partidasOrcamentarias =
    data?.pages.flatMap((page) => page.data.data || []) || [];
  const hasPartidasOrcamentarias = partidasOrcamentarias.length > 0;
  const showFetchingLoader =
    !hasPartidasOrcamentarias && isFetchingPartidasOrcamentaris;
  const showEmptyState =
    !isFetchingNextPage &&
    !isFetchingPartidasOrcamentaris &&
    !hasPartidasOrcamentarias;
  const emptyMessage =
    !!query && showEmptyState
      ? 'Nenhuma partida orçamentária encontrada para o filtro aplicado!'
      : 'Nenhuma partida orçamentária encontrada!';

  function handleQueryChange(value: string) {
    setQuery(value);
  }

  function handlePartidaOrcamentariaBeingEdited(partidaOrcamentariaId: number) {
    navigate(
      `/siscontrol/partidas-orcamentarias/atualizar/${partidaOrcamentariaId}`,
    );
  }

  function handleDeletePartidaOrcamentaria(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!partidaOrcamentariaBeingDeletedId) {
        reject();
        return;
      }

      resolve(deletePartidaOrcamentaria(partidaOrcamentariaBeingDeletedId));
    });
  }

  const {
    mutate: executePartidaOrcamentariaDeletion,
    isPending: isDeletingPartidaOrcamentaria,
  } = useMutation<void, AxiosError, void, unknown>({
    mutationFn: handleDeletePartidaOrcamentaria,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARTIDA_ORCAMENTARIA_LIST_KEY],
      });

      setPartidaOrcamentariaBeingDeletedId(null);
    },
  });

  function displayDeleteConfirmation(partidaOrcamentariaId: number) {
    setPartidaOrcamentariaBeingDeletedId(partidaOrcamentariaId);
  }

  function hideDeleteConfirmation() {
    setPartidaOrcamentariaBeingDeletedId(null);
  }

  useEffect(() => {
    if (!hasAuthorization) {
      navigate('/siscontrol');
    }
  }, []);

  return {
    query,
    breadcrumbItems,
    shouldShowDeleteConfirmation,
    partidasOrcamentarias,
    hasPartidasOrcamentarias,
    showFetchingLoader,
    showEmptyState,
    emptyMessage,
    isFetchingNextPage,
    hasNextPage,
    isDeletingPartidaOrcamentaria,
    handleQueryChange,
    fetchNextPage,
    handlePartidaOrcamentariaBeingEdited,
    executePartidaOrcamentariaDeletion,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
  };
}
