import { useNavigate } from 'react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPessoas } from './service';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { DEFAULT_PER_PAGE } from '@/configs/constants';
import {
  GetPessoasInfinite,
  GetPessoasParams,
  GetPessoasResponse,
} from './types';
import { useAuth } from '@/contexts/AuthProvider';
import { PersonRoles } from '@/types';

export const PESSOA_LIST_KEY = 'pessoas';

export function usePessoa() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const nivelPermissao = auth?.pessoa?.nivelPermissao;
  const hasAuthorization =
    nivelPermissao === PersonRoles.PMO_WITH_BI ||
    nivelPermissao === PersonRoles.PMO_WITHOUT_BI;

  const [nomeCompleto, setNomeCompleto] = useState('');
  const debouncedNomeCompleto = useDebounce(nomeCompleto);

  const params: GetPessoasParams = useMemo(
    () => ({
      ...(debouncedNomeCompleto && { nomeCompleto: debouncedNomeCompleto }),
      perPage: DEFAULT_PER_PAGE,
    }),
    [debouncedNomeCompleto],
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Colaboradores' },
  ];

  function handleExecuteQuery(pageParam?: number): Promise<GetPessoasResponse> {
    const paramsWithCursor: GetPessoasParams = {
      ...params,
      ...(pageParam && { cursor: pageParam }),
    };

    return getPessoas(paramsWithCursor);
  }

  const {
    data,
    isFetching: isFetchingPessoas,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    GetPessoasResponse,
    Error,
    GetPessoasInfinite,
    [string, GetPessoasParams],
    number | undefined
  >({
    queryFn: ({ pageParam }) => handleExecuteQuery(pageParam),
    queryKey: ['pessoas', params],
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.data.cursor;
      return nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    enabled: hasAuthorization,
  });

  const pessoas = data?.pages.flatMap((page) => page.data.data || []) || [];
  const hasPessoas = pessoas.length > 0;
  const showFetchingLoader = !hasPessoas && isFetchingPessoas;
  const showEmptyState =
    !isFetchingNextPage && !isFetchingPessoas && !hasPessoas;
  const emptyStateMessage = !debouncedNomeCompleto
    ? 'Nenhum colaborador cadastrado no sistema!'
    : 'Nenhum colaborador cadastrado para o filtro aplicado!';

  function handleChangeName(name: string) {
    setNomeCompleto(name);
  }

  function handlePessoaBeingEdited(pessoaId: number) {
    navigate(`/siscontrol/pessoas/atualizar/${pessoaId}`);
  }

  useEffect(() => {
    if (!hasAuthorization) {
      navigate('/siscontrol');
    }
  }, []);

  return {
    breadcrumbItems,
    pessoas,
    hasPessoas,
    showFetchingLoader,
    showEmptyState,
    emptyStateMessage,
    isFetchingNextPage,
    hasNextPage,
    handleChangeName,
    fetchNextPage,
    handlePessoaBeingEdited,
  };
}
