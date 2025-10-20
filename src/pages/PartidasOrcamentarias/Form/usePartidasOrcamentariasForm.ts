import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { PARTIDA_ORCAMENTARIA_LIST_KEY } from '../usePartidasOrcamentarias';
import {
  GetPartidaOrcamentariaResponse,
  MutatePartidaOrcamentariaParams,
  PartidaOrcamentariaForm,
} from './types';
import { AxiosError } from 'axios';
import {
  createPartidaOrcamentaria,
  demobilizePessoa,
  getPartidaOrcamentaria,
  updatePartidaOrcamentaria,
} from './service';
import { useAeroportoOptions } from '@/hooks/useAeroportoOptions';
import { partidaOrcamentariaSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { coinMask } from '@/utils/masks';
import { toast } from 'sonner';
import { usePessoasOptions } from '@/hooks/usePessoasOptions';
import { toDate } from '@/utils/dates';
import { useAuth } from '@/contexts/AuthProvider';
import { PersonRoles } from '@/types';
import { useEffect } from 'react';

export const PARTIDA_ORCAMENTARIA_UNIQUE_KEY = 'partida-orcamentaria';

export function usePartidasOrcamentariasForm() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const nivelPermissao = auth?.pessoa?.nivelPermissao;
  const hasAuthorization =
    nivelPermissao === PersonRoles.PMO_WITH_BI ||
    nivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    nivelPermissao === PersonRoles.BOAB_WITH_BI ||
    nivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  if (window.scrollY) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isEditionMode = location.pathname.includes('atualizar');

  const currentPage = isEditionMode
    ? 'Atualizar partida orçamentária'
    : 'Criar partida orçamentária';

  const partidaOrcamentariaId =
    isEditionMode && params.partidaOrcamentariaId
      ? Number(params.partidaOrcamentariaId)
      : null;

  const {
    data: partidaOrcamentariaResponse,
    isPending: isFetchingPartidaOrcamentaria,
  } = useQuery<
    GetPartidaOrcamentariaResponse,
    AxiosError,
    GetPartidaOrcamentariaResponse,
    [string, number]
  >({
    queryFn: () => getPartidaOrcamentaria(partidaOrcamentariaId!),
    queryKey: [PARTIDA_ORCAMENTARIA_UNIQUE_KEY, partidaOrcamentariaId!],
    enabled: isEditionMode && !!partidaOrcamentariaId,
  });

  const currentPartidaOrcamentaria = partidaOrcamentariaResponse?.data;

  if (
    isEditionMode &&
    !isFetchingPartidaOrcamentaria &&
    !currentPartidaOrcamentaria
  ) {
    navigate('/siscontrol/partidas-orcamentarias');
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    {
      label: 'Partidas Orçamentárias',
      href: '/siscontrol/partidas-orcamentarias',
    },
    { label: currentPage },
  ];

  const { aeroportoOptions, isFetchingAeroportoOptions } =
    useAeroportoOptions();

  const { pessoasOptions, isFetchingPessoasOptions } = usePessoasOptions();

  const {
    codigo,
    servico,
    tempoExperienciaRequisitado,
    dataMobilizacaoPrevista,
    quantidadePessoas,
    quantidadeMeses,
    precoUnitario,
    aeroporto,
    pessoaPartida,
    currentMobilizedPessoa,
  } = currentPartidaOrcamentaria || {};
  const { id: aeroportoId } = aeroporto || {};
  const { pessoa, dataMobilizacaoReal } = currentMobilizedPessoa || {};
  const { id: pessoaId } = pessoa || {};

  console.log({ currentPartidaOrcamentaria });

  const initialValues: PartidaOrcamentariaForm = {
    aeroportoId: aeroportoId ? String(aeroportoId) : '',
    codigo: codigo || '',
    servico: servico || '',
    tempoExperienciaRequisitado: tempoExperienciaRequisitado
      ? String(tempoExperienciaRequisitado)
      : '',
    dataMobilizacaoPrevista: dataMobilizacaoPrevista
      ? toDate(dataMobilizacaoPrevista)
      : null,
    quantidadePessoas: quantidadePessoas ? String(quantidadePessoas) : '',
    quantidadeMeses: quantidadeMeses ? String(quantidadeMeses) : '',
    precoUnitario: precoUnitario ? coinMask(String(precoUnitario), true) : '',
    pessoaPartida: {
      pessoaId: pessoaId ? String(pessoaId) : '',
      dataMobilizacaoReal: dataMobilizacaoReal
        ? toDate(dataMobilizacaoReal)
        : null,
    },
  };

  const { control, formState, handleSubmit, setError, reset, watch } =
    useForm<PartidaOrcamentariaForm>({
      resolver: zodResolver(partidaOrcamentariaSchema),
      values: initialValues,
    });

  const currentQuantidadeMeses = watch('quantidadeMeses');
  const currentDataMobilizacaoPrevista = watch('dataMobilizacaoPrevista');
  const currentPrecoUnitario = watch('precoUnitario');

  function executePartidaOrcamentariaMutation(data: PartidaOrcamentariaForm) {
    const { pessoaPartida: formPessoaPartida } = data;
    const shouldSendPessoaPartida =
      !!formPessoaPartida &&
      !!formPessoaPartida.pessoaId &&
      !!formPessoaPartida.dataMobilizacaoReal;

    const pessoaPartida = shouldSendPessoaPartida
      ? {
          pessoaId: formPessoaPartida.pessoaId,
          dataMobilizacaoReal: formPessoaPartida.dataMobilizacaoReal,
        }
      : undefined;

    const dataToSend = {
      ...data,
      pessoaPartida,
    };

    if (currentPartidaOrcamentaria) {
      const { id } = currentPartidaOrcamentaria;

      return updatePartidaOrcamentaria(id, dataToSend);
    }

    return createPartidaOrcamentaria(dataToSend);
  }

  const {
    mutate: mutatePartidaOrcamentaria,
    error,
    isPending: isMutatingPartidaOrcamentaria,
  } = useMutation<void, AxiosError, MutatePartidaOrcamentariaParams, unknown>({
    mutationFn: executePartidaOrcamentariaMutation,
    onSuccess: () => {
      toast.success('A partida orçamentária foi salva com sucesso!');

      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, param] = [query.queryKey[0], query.queryKey[1]];

          const isPartidaOrcamentariaListKey =
            key === PARTIDA_ORCAMENTARIA_LIST_KEY;
          const isCurrentPartidaOrcamentariaKey =
            key === PARTIDA_ORCAMENTARIA_UNIQUE_KEY &&
            param === partidaOrcamentariaId!;

          if (isPartidaOrcamentariaListKey || isCurrentPartidaOrcamentariaKey) {
            return true;
          }

          return false;
        },
      });

      if (!isEditionMode) {
        reset();
      }
    },
    onError: (error) => {
      if (error.response) {
        toast.error(
          (error.response.data as any)?.message ||
            'Erro ao salvar partida orçamentária',
        );
      }
    },
  });

  const { isDirty } = formState;

  const isFieldsDisabled = isEditionMode && isFetchingPartidaOrcamentaria;
  const isButtonDisabled =
    (isEditionMode && !isDirty) ||
    (isEditionMode && isFetchingPartidaOrcamentaria) ||
    isMutatingPartidaOrcamentaria;

  function onSubmit(data: PartidaOrcamentariaForm) {
    mutatePartidaOrcamentaria(data);
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

  function executeDemobilizePessoaMutation(
    dataDesmobilizacaoReal: Date,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        !currentPartidaOrcamentaria ||
        !pessoaId ||
        !currentMobilizedPessoa?.id
      ) {
        reject();
        return;
      }

      mutateDemobilizePessoa(dataDesmobilizacaoReal);
      resolve();
    });
  }

  const { mutate: mutateDemobilizePessoa, isPending: isDemobilizingPessoa } =
    useMutation<void, AxiosError, Date, unknown>({
      mutationFn: (dataDesmobilizacaoReal: Date) =>
        demobilizePessoa({
          partidaOrcamentariaId: partidaOrcamentariaId!,
          pessoaId: pessoaId!,
          pessoaPartidaId: currentMobilizedPessoa!.id,
          dataDesmobilizacaoReal,
        }),
      onSuccess: () => {
        toast.success('Colaborador desmobilizado com sucesso!');

        queryClient.invalidateQueries({
          predicate: (query) => {
            const [key, param] = [query.queryKey[0], query.queryKey[1]];

            const isPartidaOrcamentariaListKey =
              key === PARTIDA_ORCAMENTARIA_LIST_KEY;
            const isCurrentPartidaOrcamentariaKey =
              key === PARTIDA_ORCAMENTARIA_UNIQUE_KEY &&
              param === partidaOrcamentariaId!;

            if (
              isPartidaOrcamentariaListKey ||
              isCurrentPartidaOrcamentariaKey
            ) {
              return true;
            }

            return false;
          },
        });

        reset({
          ...initialValues,
        });
      },
    });

  const isDisabledChangePessoa =
    !!currentPartidaOrcamentaria &&
    !!currentPartidaOrcamentaria.currentMobilizedPessoa;

  useEffect(() => {
    if (!hasAuthorization) {
      navigate('/siscontrol');
    }
  }, []);

  return {
    breadcrumbItems,
    aeroportoOptions,
    isFetchingAeroportoOptions,
    pessoasOptions,
    pessoaPartida,
    isFetchingPessoasOptions,
    control,
    currentMobilizedPessoa,
    currentQuantidadeMeses,
    currentDataMobilizacaoPrevista,
    currentPrecoUnitario,
    isFieldsDisabled,
    isButtonDisabled,
    isDisabledChangePessoa,
    isDemobilizingPessoa,
    handleSubmit,
    onSubmit,
    mutateDemobilizePessoa: executeDemobilizePessoaMutation,
  };
}
