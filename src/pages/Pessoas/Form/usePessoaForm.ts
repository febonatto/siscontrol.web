import { useForm } from 'react-hook-form';
import { GetPessoaResponse, MutatePessoaParams, PessoaForm } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { pessoaSchema } from './schema';
import { EstadoCivil, Genero, PersonRoles, TipoContratacao } from '@/types';
import { createPessoa, getPessoa, updatePessoa } from './service';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { cnpjMask, zipCodeMask } from '@/utils/masks';
import { toast } from 'sonner';
import { toDate } from '@/utils/dates';
import { PESSOA_LIST_KEY } from '../usePessoa';
import { PESSOA_OPTIONS_LIST_KEY } from '@/hooks/usePessoasOptions';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';
import { transformCurrency } from '@/utils/string';

export const PESSOA_BEING_EDITED_TOKEN = '@siscontrol::pessoa/being-edited';

export const PESSOA_UNIQUE_KEY = 'pessoa';

export function usePessoaForm() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  if (window.scrollY) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isEditionMode = location.pathname.includes('atualizar');
  const pessoaId =
    isEditionMode && params.pessoaId ? Number(params.pessoaId) : null;

  const loggedNivelPermissao = auth?.pessoa.nivelPermissao || 0;

  const hasPersonFullControl =
    loggedNivelPermissao === PersonRoles.PMO_WITH_BI ||
    loggedNivelPermissao === PersonRoles.PMO_WITHOUT_BI;
  const hasPersonSelfControl =
    (loggedNivelPermissao === PersonRoles.TECHNICIANS_WITH_BI &&
      pessoaId === auth?.pessoa.id) ||
    (loggedNivelPermissao === PersonRoles.TECHNICIANS_WITHOUT_BI &&
      pessoaId === auth?.pessoa.id);

  const hasAuthorization =
    (isEditionMode && (hasPersonFullControl || hasPersonSelfControl)) ||
    (!isEditionMode && hasPersonFullControl);

  const { data: pessoaResponse, isPending: isFetchingPessoa } = useQuery<
    GetPessoaResponse,
    Error,
    GetPessoaResponse,
    [string, number]
  >({
    queryFn: () => getPessoa(pessoaId!),
    queryKey: ['pessoa', pessoaId!],
    enabled: isEditionMode && !!pessoaId,
  });

  const pessoaBeingEdited = pessoaResponse?.data;

  if (isEditionMode && !isFetchingPessoa && !pessoaBeingEdited) {
    navigate('/siscontrol/pessoas');
  }

  const currentPage = isEditionMode
    ? 'Atualizar colaborador'
    : 'Criar colaborador';

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Colaboradores', href: '/siscontrol/pessoas' },
    { label: currentPage },
  ];

  const hasPartidaOrcamentaria =
    Object.keys(pessoaBeingEdited?.partidaOrcamentaria || {}).length > 0;

  const enumGeneroValues = new Map<Genero, string>([
    [Genero.MASCULINO, 'Masculino'],
    [Genero.FEMININO, 'Feminino'],
    [Genero.TBD, 'TBD'],
  ]);

  const enumEstadoCivilValues = new Map<EstadoCivil, string>([
    [EstadoCivil.SOLTEIRO, 'Solteiro(a)'],
    [EstadoCivil.CASADO, 'Casado(a)'],
    [EstadoCivil.VIUVO, 'Viúvo(a)'],
    [EstadoCivil.DIVORCIADO, 'Divorciado(a)'],
    [EstadoCivil.SEPARADO, 'Separado(a)'],
    [EstadoCivil.TBD, 'TBD'],
  ]);

  const generoOptions = Object.values(Genero).map((key) => ({
    label: enumGeneroValues.get(key) as string,
    value: key,
  }));

  const estadoCivilOptions = Object.values(EstadoCivil).map((key) => ({
    label: enumEstadoCivilValues.get(key) as string,
    value: key,
  }));

  const tipoContratacaoOptions = Object.values(TipoContratacao).map((key) => ({
    label: key,
    value: key,
  }));

  const {
    nomeCompleto,
    nomeReduzido,
    matricula,
    numeroCnh,
    dataNascimento,
    genero,
    estadoCivil,
    emailPessoal,
    emailCorporativo,
    telefonePessoal,
    telefoneCorporativo,
    pais,
    estado,
    cidade,
    codigoPostal,
    endereco,
    formacao,
    resumoCurricular,
    tamanhoSapato,
    tamanhoCamisa,
    funcao,
    remuneracao,
    remuneracaoPactuada,
    regimeContratacao,
    cnpj,
    nomeEmpresa,
    dataContratacao,
    dataEncerramento,
    status,
    nivelPermissao,
    idColete,
    nomeCoordenador,
    frenteMedicao,
    pis,
    rg,
    categoriaCnh,
    dataVencimentoCnh,
  } = pessoaBeingEdited || {};

  const initialValues: PessoaForm = {
    nomeCompleto: nomeCompleto ?? '',
    nomeReduzido: nomeReduzido ?? '',
    matricula: matricula ?? '',
    numeroCnh: numeroCnh ?? '',
    dataNascimento: dataNascimento ? toDate(dataNascimento) : null,
    genero: genero ?? null,
    estadoCivil: estadoCivil ?? null,
    emailPessoal: emailPessoal ?? '',
    emailCorporativo: emailCorporativo ?? '',
    telefonePessoal: telefonePessoal ?? '',
    telefoneCorporativo: telefoneCorporativo ?? '',
    pais: pais ?? '',
    estado: estado ?? '',
    cidade: cidade ?? '',
    codigoPostal: codigoPostal ? zipCodeMask(codigoPostal) : '',
    endereco: endereco ?? '',
    formacao: formacao ?? '',
    resumoCurricular: resumoCurricular ?? '',
    tamanhoSapato: tamanhoSapato ? String(tamanhoSapato) : '',
    tamanhoCamisa: tamanhoCamisa ?? '',
    funcao: funcao ?? '',
    remuneracao: transformCurrency(remuneracao),
    remuneracaoPactuada: transformCurrency(remuneracaoPactuada),
    regimeContratacao: regimeContratacao ?? null,
    cnpj: cnpj ? cnpjMask(cnpj) : '',
    nomeEmpresa: nomeEmpresa ?? '',
    dataContratacao: dataContratacao ? toDate(dataContratacao) : null,
    dataEncerramento: dataEncerramento ? toDate(dataEncerramento) : null,
    status: status ?? true,
    nivelPermissao: nivelPermissao ? String(nivelPermissao) : null,
    idColete: idColete ?? '',
    nomeCoordenador: nomeCoordenador ?? '',
    frenteMedicao: frenteMedicao ?? '',
    pis: pis ?? '',
    rg: rg ?? '',
    categoriaCnh: categoriaCnh ?? '',
    dataVencimentoCnh: dataVencimentoCnh ? toDate(dataVencimentoCnh) : null,
  };

  const { control, formState, handleSubmit, reset, setError } =
    useForm<PessoaForm>({
      resolver: zodResolver(pessoaSchema),
      values: initialValues,
    });

  function executePessoaMutation(data: PessoaForm) {
    if (pessoaBeingEdited) {
      const { id } = pessoaBeingEdited;

      return updatePessoa(id, data);
    }

    return createPessoa(data);
  }

  const {
    mutate,
    error,
    isPending: isMutatingPessoa,
  } = useMutation<void, AxiosError, MutatePessoaParams, unknown>({
    mutationFn: executePessoaMutation,
    onSuccess: () => {
      toast.success('O colaborador foi salvo com sucesso!');

      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, param] = [query.queryKey[0], query.queryKey[1]];

          const isPessoasListKey = key === PESSOA_LIST_KEY;
          const isPessoaOptionsListKey = key === PESSOA_OPTIONS_LIST_KEY;
          const isCurrentPessoaKey =
            key === PESSOA_UNIQUE_KEY && param === pessoaId!;

          if (
            isPessoasListKey ||
            isPessoaOptionsListKey ||
            isCurrentPessoaKey
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

  const isFieldsDisabled = isEditionMode && isFetchingPessoa;
  const isButtonDisabled =
    (isEditionMode && !isDirty) ||
    (isEditionMode && isFetchingPessoa) ||
    isMutatingPessoa;

  const shouldShowRoleField =
    loggedNivelPermissao === PersonRoles.PMO_WITH_BI ||
    loggedNivelPermissao === PersonRoles.PMO_WITHOUT_BI;

  function onSubmit(data: PessoaForm) {
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

  useEffect(() => {
    if (!hasAuthorization) {
      navigate(hasPersonFullControl ? '/siscontrol/pessoas' : '/siscontrol');
    }
  }, []);

  return {
    breadcrumbItems,
    pessoaBeingEdited,
    hasPartidaOrcamentaria,
    generoOptions,
    estadoCivilOptions,
    tipoContratacaoOptions,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    shouldShowRoleField,
    handleSubmit,
    onSubmit,
  };
}
