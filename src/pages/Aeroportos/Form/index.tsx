import { AuthLayout } from '@/layouts/auth-layout';
import { useAeroportosForm } from './useAeroportosForm';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import { cnpjMask } from '@/utils/masks';

export function AeroportosForm() {
  const {
    breadcrumbItems,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    handleSubmit,
    onSubmit,
  } = useAeroportosForm();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="col-span-4">
          <Input.Text
            control={control}
            name="sigla"
            label="Sigla"
            maxLength={4}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-8">
          <Input.Text
            control={control}
            name="nome"
            label="Nome"
            maxLength={150}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="lote"
            label="Lote"
            onlyNumbers
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="cnpj"
            label="CNPJ"
            onlyNumbers
            applyMask={cnpjMask}
            maxLength={18}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="cidade"
            label="Cidade"
            maxLength={50}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="estado"
            label="Estado"
            maxLength={50}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-12">
          <Input.Text
            control={control}
            name="endereco"
            label="Endereço"
            maxLength={150}
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
