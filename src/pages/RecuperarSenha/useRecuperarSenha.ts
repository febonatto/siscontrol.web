import { api } from '@/configs/httpClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function useRecuperarSenha() {
  const {
    isPending: isDispatchingEmail,
    isError: hasDispatchError,
    data,
    error,
    mutate,
  } = useMutation<
    AxiosResponse<{ message: string }>,
    AxiosError<{ message: string }>,
    string,
    unknown
  >({
    mutationFn: async (email: string): Promise<AxiosResponse> => {
      return api.post('/redefinir-senha/disparar-email', { email });
    },
  });

  const recuperarSenhaSchema = z.object({
    email: z.string().min(1, '').email('O e-mail digitado é inválido'),
  });

  const { control, handleSubmit } = useForm<
    z.infer<typeof recuperarSenhaSchema>
  >({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: z.infer<typeof recuperarSenhaSchema>) {
    mutate(data.email);
  }

  const message = hasDispatchError
    ? error?.response?.data?.message
    : data?.data?.message;

  return {
    isDispatchingEmail,
    control,
    handleSubmit,
    onSubmit,
    message,
    hasDispatchError,
  };
}
