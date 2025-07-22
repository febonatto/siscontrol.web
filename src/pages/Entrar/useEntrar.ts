import { useForm } from 'react-hook-form';
import { EntrarError, EntrarForm, EntrarParams, EntrarResponse } from './types';
import { entrarSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from './service';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function useEntrar() {
  const { signIn: authSignIn } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<EntrarForm>({
    resolver: zodResolver(entrarSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const {
    data,
    isError,
    isPending: isValidatingCredentials,
    mutate,
  } = useMutation<EntrarResponse, EntrarError, EntrarParams, unknown>({
    mutationFn: signIn,
    onSuccess: (data) => {
      const { status } = data;
      if (status === 202) {
        setMessage(data.data.message);
        reset();
      } else {
        const { accessToken } = data.data;
        authSignIn(accessToken);
        navigate('/');
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data.message || 'Erro ao entrar. Tente novamente.';
      setMessage(errorMessage);
    },
  });

  function onSubmit(data: EntrarForm) {
    mutate(data);
  }

  const accessToken = data?.data.accessToken;

  return {
    control,
    accessToken,
    isValidatingCredentials,
    isError,
    message,
    handleSubmit,
    onSubmit,
  };
}
