import { AuthLayout } from '@/layouts/auth-layout';
import { useExperienciasPessoaForm } from './useExperienciasPessoaForm';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ExperienciasPessoaForm() {
  const {
    breadcrumbItems,
    pessoasOptions,
    isFetchingPessoasOptions,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    shouldShowPersonField,
    handleSubmit,
    onSubmit,
  } = useExperienciasPessoaForm();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {shouldShowPersonField && (
          <div className="col-span-4">
            <Input.Select
              control={control}
              name="pessoaId"
              label="Colaborador"
              items={pessoasOptions}
              filterable
              disabled={isFetchingPessoasOptions || isFieldsDisabled}
            />
          </div>
        )}

        <div
          className={cn('col-span-4', !shouldShowPersonField && 'col-span-6')}
        >
          <Input.Text
            control={control}
            name="nomeEmpresa"
            label="Nome da Empresa"
            disabled={isFieldsDisabled}
          />
        </div>

        <div
          className={cn('col-span-4', !shouldShowPersonField && 'col-span-6')}
        >
          <Input.Text
            control={control}
            name="ocupacao"
            label="Localização"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-12">
          <Input.TextArea
            control={control}
            name="responsabilidades"
            label="Responsabilidades"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-6">
          <Input.Date
            control={control}
            name="dataEntrada"
            label="Data de Entrada"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-6">
          <Input.Date
            control={control}
            name="dataSaida"
            label="Data de Saída"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-12 mt-4 flex justify-end">
          <Button type="submit" className="w-40" disabled={isButtonDisabled}>
            Salvar
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
