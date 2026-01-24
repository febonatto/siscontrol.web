import { AuthLayout } from '@/layouts/auth-layout';
import { useBoletimMedicaoResumosForm } from './useBoletimMedicaoResumosForm';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HourglassIcon, LoaderIcon } from 'lucide-react';

export function BoletimMedicaoResumoForm() {
  const {
    breadcrumbItems,
    control,
    isCreatingResumo,
    showConfirmationDeletion,
    handleSubmit,
    onSubmit,
    handleConfirmDeletion,
    handleCancelDeletion,
  } = useBoletimMedicaoResumosForm();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      {isCreatingResumo && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border bg-gray-50 p-4">
          <HourglassIcon className="relative -top-px size-3.5" />
          <p className="text-sm text-gray-800">
            A criação de um boletim de medição é uma operação que pode levar
            alguns segundos, aguarde enquanto completamos a operação ...
          </p>
        </div>
      )}

      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="col-span-4">
          <Input.Text
            control={control}
            name="nrBm"
            label="Boletim de Medição"
            onlyNumbers
          />
        </div>

        <div className="col-span-4">
          <Input.Date
            control={control}
            name="periodoMedicaoFinal"
            label="Período de Medição"
          />
        </div>

        <div className="col-span-4">
          <Input.Text
            control={control}
            name="indiceReajusteAcumulado"
            label="Indíce de Reajuste Acumulado"
            onlyNumbers
          />
        </div>

        <div className="relative col-span-12 mt-4 grid grid-cols-12 gap-4 rounded-lg border p-4 pt-6">
          <strong className="absolute -top-3 left-2.5 bg-white px-2">
            Multas
          </strong>

          <div className="col-span-3">
            <Input.Currency
              control={control}
              name="qualidadeEntregaveis"
              label="Qualidade dos Entregáveis"
            />
          </div>

          <div className="col-span-3">
            <Input.Currency
              control={control}
              name="revisaoQualidadeEntregavelProjeto"
              label="Revisão da Qualidade dos Entregáveis"
            />
          </div>

          <div className="col-span-3">
            <Input.Currency
              control={control}
              name="qualidadePrazoEntregaveis"
              label="Qualidade no Prazo dos Entregáveis"
            />
          </div>

          <div className="col-span-3">
            <Input.Currency
              control={control}
              name="qualidadeSupervisaoObra"
              label="Qualidade da Supervisão da Obra"
            />
          </div>

          <div className="col-span-4">
            <Input.Currency
              control={control}
              name="qualidadeDfo"
              label="Qualidade do DFO"
            />
          </div>

          <div className="col-span-4">
            <Input.Currency
              control={control}
              name="qualidadeSegurancaOperacional"
              label="Qualidade da Segurança Operacional"
            />
          </div>

          <div className="col-span-4">
            <Input.Currency
              control={control}
              name="qualidadeServico"
              label="Qualidade do Serviço"
            />
          </div>
        </div>

        <div className="col-span-12 flex justify-end">
          <Button className="w-40" disabled={isCreatingResumo}>
            {isCreatingResumo ? <LoaderIcon className="size-4" /> : 'Salvar'}
          </Button>
        </div>
      </form>

      {showConfirmationDeletion && (
        <Dialog
          open={showConfirmationDeletion}
          onOpenChange={handleCancelDeletion}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Já existe um boletim de medição para esse intervalo de datas!
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Ao confirmar a criação do boletim de medição o registro já
              existente será excluído e substituído por um novo cálculo, não
              podendo mais ser encontrado na sua antiga versão!
            </DialogDescription>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                className="w-24"
                onClick={handleCancelDeletion}
              >
                Cancelar
              </Button>

              <Button
                variant="default"
                className="w-24"
                onClick={handleConfirmDeletion}
                disabled={isCreatingResumo}
              >
                {isCreatingResumo && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isCreatingResumo && 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
