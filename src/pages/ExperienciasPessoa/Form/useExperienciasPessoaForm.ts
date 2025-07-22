import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { EXPERIENCIAS_PESSOA_LIST_KEY } from '../useExperienciasPessoa';
import {
  ExperienciaPessoaForm,
  GetExperienciaPessoaResponse,
  MutateExperienciaPessoaParams,
} from './types';
import { AxiosError } from 'axios';
import {
  createExperienciaPessoa,
  getExperienciasPessoa,
  updateExperienciaPessoa,
} from './service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePessoasOptions } from '@/hooks/usePessoasOptions';
import { baseExperienciaPessoaSchema } from './schema';
import { toast } from 'sonner';
import { toDate } from '@/utils/dates';
import { PESSOA_LIST_KEY } from '@/pages/Pessoas/usePessoa';
import { useAuth } from '@/contexts/AuthProvider';
import { PersonRoles } from '@/types';
import { ZodIssueCode } from 'zod';

export const EXPERIENCIA_PESSOA_UNIQUE_KEY = 'experiencia-pessoa';

export function useExperienciasPessoaForm() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  if (window.scrollY) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isEditionMode = location.pathname.includes('atualizar');

  const currentPage = isEditionMode
    ? 'Atualizar experiência profissional'
    : 'Criar experiência profissional';

  const experienciaPessoaId =
    isEditionMode && params.experienciaPessoaId
      ? Number(params.experienciaPessoaId)
      : null;

  const loggedNivelPermissao = auth?.pessoa.nivelPermissao || 0;

  const hasExperiencesFullControl =
    loggedNivelPermissao === PersonRoles.PMO_WITH_BI ||
    loggedNivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITH_BI ||
    loggedNivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  const {
    data: experienciaPessoaResponse,
    error: experienciaPessoaError,
    isPending: isFetchingExperienciaPessoa,
  } = useQuery<
    GetExperienciaPessoaResponse,
    AxiosError,
    GetExperienciaPessoaResponse,
    [string, number]
  >({
    queryFn: () => getExperienciasPessoa(experienciaPessoaId!),
    queryKey: [EXPERIENCIA_PESSOA_UNIQUE_KEY, experienciaPessoaId!],
    retry: false,
    enabled: isEditionMode && !!experienciaPessoaId,
  });

  const isUnauthorizedException =
    experienciaPessoaError?.response?.status === 401;

  if (isUnauthorizedException) {
    navigate('/siscontrol/experiencias-pessoa');
  }

  const currentExperienciaPessoa = experienciaPessoaResponse?.data;

  if (
    isEditionMode &&
    !isFetchingExperienciaPessoa &&
    !currentExperienciaPessoa
  ) {
    navigate('/siscontrol/experiencias-pessoa');
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    {
      label: 'Experiências Profissionais',
      href: '/siscontrol/experiencias-pessoa',
    },
    { label: currentPage },
  ];

  const { pessoasOptions, isFetchingPessoasOptions } = usePessoasOptions();

  const {
    pessoaId,
    nomeEmpresa,
    ocupacao,
    responsabilidades,
    dataEntrada,
    dataSaida,
  } = currentExperienciaPessoa || {};

  const initialValues: ExperienciaPessoaForm = {
    pessoaId: pessoaId ? String(pessoaId) : '',
    nomeEmpresa: nomeEmpresa || '',
    ocupacao: ocupacao || '',
    responsabilidades: responsabilidades || '',
    dataEntrada: dataEntrada ? toDate(dataEntrada) : null,
    dataSaida: dataSaida ? toDate(dataSaida) : null,
  };

  const experienciaPessoaSchema = baseExperienciaPessoaSchema.superRefine(
    ({ pessoaId }, ctx) => {
      if (hasExperiencesFullControl && !pessoaId) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'O campo "Pessoa" é obrigatório',
        });
      }
    },
  );

  const { control, formState, handleSubmit, reset, setError } =
    useForm<ExperienciaPessoaForm>({
      resolver: zodResolver(experienciaPessoaSchema),
      values: initialValues,
    });

  function executeExperienciaPessoaMutation(data: ExperienciaPessoaForm) {
    if (currentExperienciaPessoa) {
      const { id } = currentExperienciaPessoa;

      return updateExperienciaPessoa(id, data);
    }

    const finalData = {
      ...data,
      ...(hasExperiencesFullControl
        ? { pessoaId: data.pessoaId }
        : { pessoaId: String(auth?.pessoa.id) }),
    };
    return createExperienciaPessoa(finalData);
  }

  const {
    mutate,
    error,
    isPending: isMutatingExperienciaPessoa,
  } = useMutation<void, AxiosError, MutateExperienciaPessoaParams, unknown>({
    mutationFn: executeExperienciaPessoaMutation,
    onSuccess: () => {
      toast.success('A experiência profissional foi salva com sucesso!');

      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, param] = [query.queryKey[0], query.queryKey[1]];

          const isPessoasListKey = key === PESSOA_LIST_KEY;
          const isExperienciasPessoaListKey =
            key === EXPERIENCIAS_PESSOA_LIST_KEY;
          const isCurrentExperienciaPessoaKey =
            key === EXPERIENCIA_PESSOA_UNIQUE_KEY &&
            param === experienciaPessoaId!;

          if (
            isPessoasListKey ||
            isExperienciasPessoaListKey ||
            isCurrentExperienciaPessoaKey
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

  const isFieldsDisabled = isEditionMode && isFetchingExperienciaPessoa;
  const isButtonDisabled =
    (isEditionMode && !isDirty) ||
    (isEditionMode && isFetchingExperienciaPessoa) ||
    isMutatingExperienciaPessoa;
  const shouldShowPersonField = hasExperiencesFullControl && !isEditionMode;

  function onSubmit(data: ExperienciaPessoaForm) {
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
    pessoasOptions,
    isFetchingPessoasOptions,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    shouldShowPersonField,
    handleSubmit,
    onSubmit,
  };
}
