import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getAeroportos } from './service';
import {
  GetAeroportosInfinite,
  GetAeroportosParams,
  GetAeroportosResponse,
} from './types';
import { AxiosError } from 'axios';
import { DEFAULT_PER_PAGE } from '@/configs/constants';
import { Aeroporto } from '@/types';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { deleteAeroporto } from './Form/service';
import { AEROPORTO_OPTIONS_LIST_KEY } from '@/hooks/useAeroportoOptions';

export const AEROPORTO_LIST_KEY = 'aeroportos';

export function useAeroportos() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [aeroportoBeingDeleted, setAeroportoBeingDeleted] = useState<
    number | null
  >(null);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Aeroportos' },
  ];

  function handleExecuteQuery(
    pageParam?: number,
  ): Promise<GetAeroportosResponse> {
    const params: GetAeroportosParams = {
      perPage: DEFAULT_PER_PAGE,
      ...(pageParam && { cursor: pageParam }),
    };

    return getAeroportos(params);
  }

  const {
    data,
    isFetching: isFetchingAeroportos,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    GetAeroportosResponse,
    AxiosError,
    GetAeroportosInfinite,
    [string],
    number | undefined
  >({
    queryFn: ({ pageParam }) => handleExecuteQuery(pageParam),
    queryKey: ['aeroportos'],
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.data.cursor;
      return nextCursor ?? undefined;
    },
    initialPageParam: undefined,
  });

  const aeroportos = data?.pages.flatMap((page) => page.data.data || []) || [];

  const hasAeroportos = aeroportos.length > 0;
  const showFetchingLoader = isFetchingAeroportos && !hasAeroportos;
  const showEmptyState =
    !isFetchingAeroportos && !isFetchingNextPage && !hasAeroportos;

  function handleAeroportoBeingEdited(aeroporto: Aeroporto) {
    navigate(`/siscontrol/aeroportos/atualizar/${aeroporto.id}`);
  }

  const { mutate, isPending: isDeletingAeroporto } = useMutation<
    void,
    AxiosError,
    number,
    unknown
  >({
    mutationFn: () => deleteAeroporto(Number(aeroportoBeingDeleted)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];

          const shouldInvalidate =
            key === AEROPORTO_LIST_KEY || key === AEROPORTO_OPTIONS_LIST_KEY;

          return shouldInvalidate;
        },
      });
      setAeroportoBeingDeleted(null);
    },
  });

  function handleAeroportoBeingDeleted(aeroportoId: number) {
    setAeroportoBeingDeleted(aeroportoId);
  }

  function handleCancelDelete() {
    setAeroportoBeingDeleted(null);
  }

  function handleConfirmDelete() {
    if (aeroportoBeingDeleted) {
      mutate(aeroportoBeingDeleted);
    }
  }

  return {
    breadcrumbItems,
    aeroportos,
    hasAeroportos,
    showFetchingLoader,
    showEmptyState,
    isFetchingNextPage,
    aeroportoBeingDeleted,
    isDeletingAeroporto,
    hasNextPage,
    fetchNextPage,
    handleAeroportoBeingEdited,
    handleAeroportoBeingDeleted,
    handleCancelDelete,
    handleConfirmDelete,
  };
}
