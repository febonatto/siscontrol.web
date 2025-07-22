import { AuthLayout } from '@/layouts/auth-layout';
import { useAtividadesForm } from './useAtividadesForm';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';

export function AtividadesForm() {
  const {
    breadcrumbItems,
    isViewerMode,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    handleSubmit,
    onSubmit,
  } = useAtividadesForm();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="col-span-4">
          <Input.Date
            control={control}
            name="dataReferencia"
            label="Data de Referência"
            viewMode={isViewerMode}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-12">
          <Input.TextArea
            control={control}
            name="atividade"
            label="Atividade"
            viewMode={isViewerMode}
            disabled={isFieldsDisabled}
          />
        </div>

        {!isViewerMode && (
          <div className="col-span-12 mt-4 flex justify-end">
            <Button type="submit" className="w-40" disabled={isButtonDisabled}>
              Salvar
            </Button>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
