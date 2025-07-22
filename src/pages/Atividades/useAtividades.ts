import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteAtividade, getAtividades } from './service';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthProvider';
import {
  GetAtividadesInfinite,
  GetAtividadesParams,
  GetAtividadesResponse,
} from './types';
import { useNavigate } from 'react-router';
import { DEFAULT_PER_PAGE } from '@/configs/constants';
import { usePessoasOptions } from '@/hooks/usePessoasOptions';
import { PersonRoles } from '@/types';

export const ATIVIDADE_LIST_KEY = 'atividades';

export function useAtividades() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { auth } = useAuth();

  const authenticatedPessoaId = auth ? auth.pessoa.id : undefined;

  const loggedNivelPermissao = auth?.pessoa.nivelPermissao || 0;

  const hasAtividadeFullControl =
    loggedNivelPermissao === PersonRoles.PMO_WITH_BI ||
    loggedNivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITH_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  const [dataReferencia, setDataReferencia] = useState<Date>(new Date());
  const [pessoaId, setPessoaId] = useState<string | undefined>(
    String(authenticatedPessoaId),
  );
  const [atividadeBeingDeletedId, setAtividadeBeingDeletedId] = useState<
    number | null
  >(null);

  const params: GetAtividadesParams = useMemo(
    () => ({
      dataReferencia: format(dataReferencia ?? new Date(), 'yyyy-MM-dd'),
      ...(!hasAtividadeFullControl && {
        pessoaId: Number(authenticatedPessoaId),
      }),
      ...(hasAtividadeFullControl &&
        pessoaId && {
          pessoaId: Number(pessoaId),
        }),
      perPage: DEFAULT_PER_PAGE,
    }),
    [dataReferencia, pessoaId],
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Atividades' },
  ];
  const shouldShowDeleteConfirmation = Boolean(atividadeBeingDeletedId);

  const { pessoasOptions, isFetchingPessoasOptions } = usePessoasOptions();

  function handleExecuteQuery(cursor?: number): Promise<GetAtividadesResponse> {
    const paramsWithCursor: GetAtividadesParams = {
      ...params,
      ...(cursor && { cursor }),
    };

    return getAtividades(paramsWithCursor);
  }

  const {
    data,
    isFetching: isFetchingAtividades,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    GetAtividadesResponse,
    AxiosError,
    GetAtividadesInfinite,
    [string, GetAtividadesParams],
    number | undefined
  >({
    queryFn: ({ pageParam }) => handleExecuteQuery(pageParam),
    queryKey: ['atividades', params],
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.data.cursor;
      return nextCursor ?? undefined;
    },
    initialPageParam: undefined,
  });

  const atividades = data?.pages.flatMap((page) => page.data.data || []) || [];
  const hasAtividades = atividades.length > 0;
  const showFetchingLoader = !hasAtividades && isFetchingAtividades;
  const showEmptyState =
    !isFetchingNextPage && !isFetchingAtividades && !hasAtividades;

  function handleDataReferenciaChange(date: Date | undefined) {
    setDataReferencia(date ?? new Date());
  }

  function handlePessoaIdChange(id: string | undefined) {
    setPessoaId(id);
  }

  function handleAtividadeBeingSelected(
    atividadeId: number,
    isMyAtividade: boolean = true,
  ) {
    if (!isMyAtividade) {
      navigate(`/siscontrol/atividades/visualizar/${atividadeId}`);
      return;
    }

    navigate(`/siscontrol/atividades/atualizar/${atividadeId}`);
  }

  function handleDeleteAtividade(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!atividadeBeingDeletedId) {
        reject();
        return;
      }

      resolve(deleteAtividade(atividadeBeingDeletedId));
    });
  }

  const { mutate: executeDeleteAtividade, isPending: isDeletingAtividade } =
    useMutation<void, AxiosError, void, unknown>({
      mutationFn: handleDeleteAtividade,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [ATIVIDADE_LIST_KEY],
        });
        setAtividadeBeingDeletedId(null);
      },
    });

  function displayDeleteConfirmation(atividadeId: number) {
    setAtividadeBeingDeletedId(atividadeId);
  }

  function hideDeleteConfirmation() {
    setAtividadeBeingDeletedId(null);
  }

  return {
    dataReferencia,
    pessoaId,
    breadcrumbItems,
    authenticatedPessoaId,
    shouldShowDeleteConfirmation,
    pessoasOptions,
    isFetchingPessoasOptions,
    atividades,
    hasAtividades,
    hasAtividadeFullControl,
    showFetchingLoader,
    showEmptyState,
    isFetchingNextPage,
    hasNextPage,
    isDeletingAtividade,
    handleDataReferenciaChange,
    handlePessoaIdChange,
    fetchNextPage,
    handleAtividadeBeingSelected,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
    executeDeleteAtividade,
  };
}
