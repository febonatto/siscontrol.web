import { Input } from '@/components/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { api } from '@/configs/httpClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router';
import { z } from 'zod';

type PasswordResetParams = {
  token: string;
};

type PasswordResetResponse = {
  message: string;
};

type PostPasswordResetArguments = {
  token: string;
  novaSenha: string;
  confirmacaoSenha: string;
};

type PostPasswordResetSuccess = AxiosResponse<PasswordResetResponse>;
type PostPasswordResetError = AxiosError<PasswordResetResponse>;

export function RedefinirSenha() {
  const { token } = useParams<PasswordResetParams>();

  const [isNovaSenhaVisible, setIsNovaSenhaVisible] = useState(false);
  const [isConfirmacaoSenhaVisible, setIsConfirmacaoSenhaVisible] =
    useState(false);

  function redefinirSenha(
    data: PostPasswordResetArguments,
  ): Promise<PostPasswordResetSuccess> {
    return api.post('/redefinir-senha', data);
  }

  const {
    isPending: isMutatingPasswordReset,
    isError: hasPasswordResetError,
    data,
    error,
    mutate,
  } = useMutation<
    PostPasswordResetSuccess,
    PostPasswordResetError,
    PostPasswordResetArguments,
    unknown
  >({
    mutationFn: redefinirSenha,
  });

  const message = hasPasswordResetError
    ? error?.response?.data?.message
    : data?.data?.message;

  const redefinirSenhaSchema = z
    .object({
      novaSenha: z
        .string()
        .min(1, '')
        .refine(
          (value) => value !== '@Padrao123',
          'A senha não pode ser a padrão do sistema.',
        )
        .refine(
          (value) => value.length >= 8,
          'O tamanho mínimo aceito para a senha é de 8 caracteres',
        ),
      confirmacaoSenha: z.string().min(1, ''),
    })
    .superRefine(({ novaSenha, confirmacaoSenha }, ctx) => {
      if (novaSenha !== confirmacaoSenha) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A confirmação de senha deve coincidir com a senha',
          path: ['confirmacaoSenha'],
        });
      }
    });

  type RedefinirSenhaForm = z.infer<typeof redefinirSenhaSchema>;

  const { control, handleSubmit } = useForm<RedefinirSenhaForm>({
    resolver: zodResolver(redefinirSenhaSchema),
    defaultValues: {
      novaSenha: '',
      confirmacaoSenha: '',
    },
  });

  function onSubmit(data: RedefinirSenhaForm) {
    if (!token) {
      return;
    }

    mutate({
      ...data,
      token,
    });
  }

  function toggleNovaSenhaVisibility() {
    setIsNovaSenhaVisible((prevState) => !prevState);
  }

  function toggleConfirmacaoSenhaVisibility() {
    setIsConfirmacaoSenhaVisible((prevState) => !prevState);
  }

  return (
    <section className="flex h-screen items-center justify-center bg-zinc-100">
      <div className="max-w-[512px] space-y-6">
        <header className="space-y-1.5 text-center">
          <h1 className="text-lg font-bold">Redefinição de senha</h1>

          <span className="block text-sm leading-tight text-zinc-600">
            Preencha a sua nova senha e confirme-a para executar a redefinição.
          </span>
        </header>

        <div className="w-[444px] rounded-lg bg-white p-8 shadow-md">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {message && (
              <Alert
                variant={hasPasswordResetError ? 'destructive' : 'success'}
                className="mb-6"
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <Input.Text
                control={control}
                name="novaSenha"
                label="Nova Senha"
                type={isNovaSenhaVisible ? 'text' : 'password'}
                className="pr-10"
              />

              <Button
                type="button"
                variant="custom"
                className="absolute top-2.5 right-4 h-fit"
                tabIndex={-1}
                onClick={toggleNovaSenhaVisibility}
              >
                {isNovaSenhaVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>

            <div className="relative">
              <Input.Text
                control={control}
                name="confirmacaoSenha"
                label="Confirmar Senha"
                type={isConfirmacaoSenhaVisible ? 'text' : 'password'}
                className="pr-10"
              />

              <Button
                type="button"
                variant="custom"
                className="absolute top-2.5 right-4 h-fit"
                tabIndex={-1}
                onClick={toggleConfirmacaoSenhaVisibility}
              >
                {isConfirmacaoSenhaVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isMutatingPasswordReset}
            >
              Salvar
            </Button>
          </form>
        </div>

        <div className="flex justify-center">
          <Button variant="link">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
