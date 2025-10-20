import { AuthLayout } from '@/layouts/auth-layout';
import { useBoletimMedicaoDetalhes } from './useBoletimMedicaoDetalhes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoaderIcon, PencilIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { toDate } from '@/utils/dates';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function BoletimMedicaoDetalhes() {
  const {
    hasAccessModule,
    idBm,
    breadcrumbItems,
    detalhes,
    hasDetalhes,
    showFetchingDetalhes,
    showEmptyDetalhes,
  } = useBoletimMedicaoDetalhes();

  if (!hasAccessModule) {
    return null;
  }

  const commonFixedCellClasses =
    'sticky overflow-hidden whitespace-break-spaces bg-white';

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 space-y-2">
          <h1 className="text-xl font-bold">
            Lista de Detalhes do Boletim de Medição
          </h1>

          <p className="align-bottom leading-tight">
            Aqui estão listados todos os detalhes do boletim de medição n°{' '}
            {idBm}
          </p>
        </div>

        <div className="relative overflow-hidden">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead
                  className={cn(
                    commonFixedCellClasses,
                    'left-0 w-[124px] max-w-[124px] min-w-[124px]',
                  )}
                >
                  Cod. Partida
                </TableHead>
                <TableHead
                  className={cn(
                    commonFixedCellClasses,
                    'left-[124px] w-[256px] max-w-[256px] min-w-[256px]',
                  )}
                >
                  Serviço
                </TableHead>
                <TableHead
                  className={cn(
                    commonFixedCellClasses,
                    'left-[calc(124px+256px)] w-[104px] max-w-[104px] min-w-[104px]',
                  )}
                >
                  Aeroporto
                </TableHead>
                <TableHead
                  className={cn(
                    commonFixedCellClasses,
                    'left-[calc(124px+256px+104px)] w-[168px] max-w-[168px] min-w-[168px]',
                  )}
                >
                  Colaborador
                </TableHead>
                <TableHead>Dt Mobilização</TableHead>
                <TableHead>Dt Desmobilização</TableHead>
                <TableHead>Vl Unitário</TableHead>
                <TableHead>% Trabalhado</TableHead>
                <TableHead>Experiência</TableHead>
                <TableHead>Diferença</TableHead>
                <TableHead>Vl Multa 7.1</TableHead>
                <TableHead>Vl Medição</TableHead>
                <TableHead>Dias Mobilização</TableHead>
                <TableHead>% Multa 7.2</TableHead>
                <TableHead>Vl Multa 7.2</TableHead>
                <TableHead>Vl Real</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasDetalhes &&
                detalhes.map((detalhe) => (
                  <TableRow key={detalhe.id}>
                    <TableCell
                      className={cn(
                        commonFixedCellClasses,
                        'left-0 w-[124px] max-w-[124px] min-w-[124px]',
                      )}
                    >
                      {detalhe.partidaOrcamentaria.codigo}
                    </TableCell>
                    <TableCell
                      className={cn(
                        commonFixedCellClasses,
                        'left-[124px] w-[256px] max-w-[256px] min-w-[256px]',
                      )}
                    >
                      {detalhe.partidaOrcamentaria.servico}
                    </TableCell>
                    <TableCell
                      className={cn(
                        commonFixedCellClasses,
                        'left-[calc(124px+256px)] w-[104px] max-w-[104px] min-w-[104px]',
                      )}
                    >
                      {detalhe.partidaOrcamentaria.aeroporto.sigla}
                    </TableCell>
                    <TableCell
                      className={cn(
                        commonFixedCellClasses,
                        'left-[calc(124px+256px+104px)] w-[168px] max-w-[168px] min-w-[168px]',
                      )}
                    >
                      {detalhe.pessoa?.nomeReduzido}
                    </TableCell>
                    <TableCell>
                      {detalhe.dataMobilizacaoReal &&
                        format(
                          toDate(detalhe.dataMobilizacaoReal),
                          'dd/MM/yyyy',
                        )}
                    </TableCell>
                    <TableCell>
                      {detalhe.dataDesmobilizacaoReal &&
                        format(
                          toDate(detalhe.dataDesmobilizacaoReal),
                          'dd/MM/yyyy',
                        )}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(detalhe.vlMedicaoPartidaOrcamentaria)}
                    </TableCell>
                    <TableCell>{detalhe.qtdMesTrabalho.toFixed(4)}</TableCell>
                    <TableCell>
                      {detalhe.tempoExperienciaPessoa.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {detalhe.diferencaExperiencia.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(detalhe.vlMultaExperiencia)}
                    </TableCell>
                    <TableCell>{formatCurrency(detalhe.vlMedicaoBm)}</TableCell>
                    <TableCell>{detalhe.diasMobilizacao}</TableCell>
                    <TableCell>{detalhe.percentualMobilizacao}%</TableCell>
                    <TableCell>
                      {formatCurrency(detalhe.vlMultaMobilizacao)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(detalhe.vlMedicaoReal)}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/siscontrol/boletim-medicao/${idBm}/editar/${detalhe.id}`}
                      >
                        <Button
                          variant="custom"
                          className="w-full hover:text-blue-500"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <div className="py-2">
            {showFetchingDetalhes && (
              <div className="flex w-full items-center justify-center py-4">
                <LoaderIcon className="size-4 animate-spin" />
              </div>
            )}

            {showEmptyDetalhes && (
              <span className="text-destructive ml-2">
                Nenhum detalhe para o Boletim de Medição n° {idBm} foi
                encontrado.
              </span>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
