import { useForm } from 'react-hook-form';
import { AlterarSenhaForm, MutationAlterarSenhaParams } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { alterarSenhaSchema } from './schema';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { alterarSenha } from './service';
import { useState } from 'react';

export function useAlterarSenha() {
  const [isSenhaAtualVisible, setIsSenhaAtualVisible] = useState(false);
  const [isNovaSenhaVisible, setIsNovaSenhaVisible] = useState(false);
  const [isConfirmacaoSenhaVisible, setIsConfirmacaoSenhaVisible] =
    useState(false);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Alterar senha' },
  ];

  const { control, handleSubmit, setError } = useForm<AlterarSenhaForm>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmacaoSenha: '',
    },
  });

  const {
    mutate,
    isPending: isMutatingAlterarSenha,
    isSuccess: isAlterarSenhaSuccess,
    error,
  } = useMutation<void, AxiosError, MutationAlterarSenhaParams, unknown>({
    mutationFn: alterarSenha,
  });

  function onSubmit(data: AlterarSenhaForm) {
    mutate(data);
  }

  function toggleSenhaAtualVisibility() {
    setIsSenhaAtualVisible((prevState) => !prevState);
  }

  function toggleNovaSenhaVisibility() {
    setIsNovaSenhaVisible((prevState) => !prevState);
  }

  function toggleConfirmacaoSenhaVisibility() {
    setIsConfirmacaoSenhaVisible((prevState) => !prevState);
  }

  const message = isAlterarSenhaSuccess && 'Senha alterada com sucesso!';
  const showAlertMessage = !!message;

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
    isSenhaAtualVisible,
    isNovaSenhaVisible,
    isConfirmacaoSenhaVisible,
    control,
    isMutatingAlterarSenha,
    showAlertMessage,
    message,
    handleSubmit,
    onSubmit,
    toggleSenhaAtualVisibility,
    toggleNovaSenhaVisibility,
    toggleConfirmacaoSenhaVisibility,
  };
}
