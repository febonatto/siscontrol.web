import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { useRecuperarSenha } from './useRecuperarSenha';
import { Input } from '@/components/input';
import { Link } from 'react-router';

export function RecuperarSenha() {
  const {
    isDispatchingEmail,
    control,
    handleSubmit,
    onSubmit,
    message,
    hasDispatchError,
  } = useRecuperarSenha();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-zinc-100">
      <div className="max-w-[512px] text-center text-zinc-600">
        <h1 className="mb-1.5 text-2xl font-bold text-zinc-700">
          Recuperar senha
        </h1>

        <p>
          Informe seu e-mail de cadastro para realizar a recuperação de senha
        </p>

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
              variant={hasDispatchError ? 'destructive' : 'success'}
              className="mb-2"
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Input.Text control={control} name="email" label="E-mail" required />

          <Button className="mt-2 w-full" disabled={isDispatchingEmail}>
            {isDispatchingEmail ? (
              <LoaderIcon size={16} className="animate-spin" />
            ) : (
              'Enviar'
            )}
          </Button>
        </form>
      </div>

      <Button variant="link">
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
