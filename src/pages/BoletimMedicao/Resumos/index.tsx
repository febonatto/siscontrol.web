import { AuthLayout } from '@/layouts/auth-layout';
import { useBoletimMedicaoResumos } from './useBoletimMedicaoResumos';
import {
  DownloadIcon,
  EyeIcon,
  LoaderIcon,
  // PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/currency';
import { toDate } from '@/utils/dates';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function BoletimMedicao() {
  const {
    hasAccessModule,
    breadcrumbItems,
    resumos,
    hasResumos,
    showFetchingResumos,
    showEmptyResumos,
    isDeletingResumo,
    shouldShowDeleteModal,
    handleResumoBeingDeleted,
    handleConfirmDelete,
    handleCancelDelete,
    handleGenerateMeasurementReport,
  } = useBoletimMedicaoResumos();

  if (!hasAccessModule) {
    return null;
  }

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">
              Lista de Resumos do Boletim de Medição
            </h1>

            <p className="align-bottom leading-tight">
              Aqui estão listadas todos os Resumos do Boletim de Medição criados
              no sistema.
            </p>
          </div>

          <Link to="/siscontrol/boletim-medicao/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar BM
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent [&>th]:align-bottom">
                <TableHead>N° BM</TableHead>
                <TableHead>Período Final</TableHead>
                <TableHead>(a) Vl Multa 7.1</TableHead>
                <TableHead>
                  <div className="space-y-0.5">
                    <small className="block text-xs font-normal">
                      ((PO - a) * %)
                    </small>
                    <p>(b) Vl Medição</p>
                  </div>
                </TableHead>
                <TableHead>(c) Vl Multa 7.2</TableHead>
                <TableHead>(d) Vl Outras Multas</TableHead>
                <TableHead>(e) Vl do Reajuste</TableHead>
                <TableHead>
                  <div className="space-y-0.5">
                    <small className="block text-xs font-normal">
                      (b - c - d + e)
                    </small>
                    <p>(f) Vl Real Reajustado</p>
                  </div>
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasResumos &&
                resumos.map((bmResumo) => {
                  const {
                    qualidadeEntregaveis,
                    revisaoQualidadeEntregavelProjeto,
                    qualidadePrazoEntregaveis,
                    qualidadeSupervisaoObra,
                    qualidadeDfo,
                    qualidadeSegurancaOperacional,
                    qualidadeServico,
                  } = bmResumo;

                  const outrasMultas =
                    qualidadeEntregaveis +
                    revisaoQualidadeEntregavelProjeto +
                    qualidadePrazoEntregaveis +
                    qualidadeSupervisaoObra +
                    qualidadeDfo +
                    qualidadeSegurancaOperacional +
                    qualidadeServico;

                  return (
                    <TableRow key={bmResumo.id}>
                      <TableCell>{bmResumo.nrBm}</TableCell>
                      <TableCell>
                        {format(
                          toDate(bmResumo.periodoMedicaoFinal),
                          'dd/MM/yyyy',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bmResumo.vlTotalMultaExperiencia)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bmResumo.vlTotalMedicaoSemPenalizacao)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bmResumo.vlTotalMultaMobilizacao)}
                      </TableCell>
                      <TableCell>{formatCurrency(outrasMultas)}</TableCell>
                      <TableCell>
                        {formatCurrency(bmResumo.vlReajuste)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bmResumo.vlMedicaoReajustado)}
                      </TableCell>
                      <TableCell className="space-x-3.5">
                        <Button
                          variant="custom"
                          className="hover:text-green-400"
                          onClick={() =>
                            handleGenerateMeasurementReport(bmResumo.nrBm)
                          }
                        >
                          <DownloadIcon className="size-4" />
                        </Button>

                        <Link
                          to={`/siscontrol/boletim-medicao/${bmResumo.nrBm}`}
                        >
                          <Button
                            variant="custom"
                            className="hover:text-yellow-500"
                          >
                            <EyeIcon className="size-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="custom"
                          className="hover:text-red-500"
                          onClick={() => handleResumoBeingDeleted(bmResumo.id)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <div className="py-2">
            {showFetchingResumos && (
              <div className="flex w-full items-center justify-center py-4">
                <LoaderIcon className="size-4 animate-spin" />
              </div>
            )}

            {showEmptyResumos && (
              <span className="text-destructive ml-2">
                Nenhum Resumo de Boletim de Medição foi encontrado!
              </span>
            )}
          </div>
        </div>
      </div>

      {shouldShowDeleteModal && (
        <Dialog open={shouldShowDeleteModal} onOpenChange={handleCancelDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tem certeza que deseja excluir esse boletim de medição?
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Essa ação é única e não poderá ser desfeita, sendo impossível
              encontrar novamente esse registro posteriormente!
            </DialogDescription>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                className="w-24"
                onClick={handleCancelDelete}
              >
                Cancelar
              </Button>

              <Button
                variant="destructive"
                className="w-24"
                onClick={handleConfirmDelete}
                disabled={isDeletingResumo}
              >
                {isDeletingResumo && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isDeletingResumo && 'Deletar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
