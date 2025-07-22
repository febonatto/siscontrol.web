import { AuthLayout } from '@/layouts/auth-layout';
import { useAlterarSenha } from './useAlterarSenha';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AlterarSenha() {
  const {
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
  } = useAlterarSenha();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <section className="mx-auto w-[506px] space-y-6">
        <header className="space-y-1.5 text-center">
          <h1 className="text-lg font-bold">Alteração de senha</h1>

          <span className="block text-sm leading-tight text-zinc-600">
            Para alteração de senha é necessário que se identifique com a senha
            atual e a nova senha desejada.
          </span>
        </header>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {showAlertMessage && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Input.Text
              control={control}
              name="senhaAtual"
              label="Senha Atual"
              type={isSenhaAtualVisible ? 'text' : 'password'}
              className="pr-10"
            />

            <Button
              type="button"
              variant="custom"
              className="absolute top-2.5 right-4 h-fit"
              tabIndex={-1}
              onClick={toggleSenhaAtualVisibility}
            >
              {isSenhaAtualVisible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>

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

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-40"
              disabled={isMutatingAlterarSenha}
            >
              Salvar
            </Button>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
}
