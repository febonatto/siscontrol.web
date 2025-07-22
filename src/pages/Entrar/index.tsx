import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import { useEntrar } from './useEntrar';
import { useState } from 'react';
import { Eye, EyeOff, LoaderIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router';

export function SignIn() {
  const {
    control,
    isValidatingCredentials,
    isError,
    message,
    handleSubmit,
    onSubmit,
  } = useEntrar();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisible = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-zinc-100">
      <div className="max-w-[512px] text-center text-zinc-600">
        <h1 className="mb-1.5 text-2xl font-bold text-zinc-700">
          Acesse sua conta
        </h1>

        <p>Informe suas credenciais para continuar</p>

        <small>
          Se ainda não possui uma conta, entre em contato com o suporte para
          mais informações
        </small>
      </div>

      <div className="w-[444px] rounded-lg bg-white p-8 shadow-md">
        <form
          className="grid grid-cols-1 gap-3.5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {message && (
            <Alert
              variant={isError ? 'destructive' : 'success'}
              className="mb-2"
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Input.Text control={control} name="email" label="E-mail" required />

          <div className="relative">
            <Input.Text
              control={control}
              name="senha"
              label="Senha"
              type={isPasswordVisible ? 'text' : 'password'}
              required
            />

            <Button
              type="button"
              variant="custom"
              className="absolute top-4.5 right-3 -translate-y-1/2 text-zinc-900"
              onClick={togglePasswordVisible}
            >
              {isPasswordVisible ? (
                <EyeOff className="text-zinc-600" />
              ) : (
                <Eye className="text-zinc-600" />
              )}
            </Button>
          </div>

          <Button variant="link" className="w-fit justify-self-end" asChild>
            <Link to="/siscontrol/redefinir-senha">Esqueceu sua senha?</Link>
          </Button>

          <Button className="mt-2 w-full" disabled={isValidatingCredentials}>
            {isValidatingCredentials ? (
              <LoaderIcon size={16} className="animate-spin" />
            ) : (
              'Acessar'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
