import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/configs/httpClient';
import { AuthLayout } from '@/layouts/auth-layout';
import { formatCurrency } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { DownloadIcon, LoaderIcon } from 'lucide-react';
import { exportToSpreadsheet } from '../utils';
import { Button } from '@/components/ui/button';

interface BudgetLine {
  sigla: string;
  codigo: string;
  servico: string;
  precoUnitario: number;
  montanteContratual: number;
  dataMobilizacaoPrevista: string | null;
  dataDesmobilizacaoPrevista: string | null;
  quantidadeMeses: number;
}

interface FormattedBudgetLine
  extends Omit<
    BudgetLine,
    'dataMobilizacaoPrevista' | 'dataDesmobilizacaoPrevista'
  > {
  dataMobilizacaoPrevista: Date | null;
  dataDesmobilizacaoPrevista: Date | null;
}

export function BudgetLinesReport() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Relatório de Partidas Orçamentárias' },
  ];

  const { data, isFetching } = useQuery<
    FormattedBudgetLine[],
    AxiosError,
    BudgetLine[],
    [string]
  >({
    queryKey: ['budgetLinesReport'],
    queryFn: async () => {
      const { data } = await api.get<BudgetLine[]>(
        '/reports/budget-management/budget-lines',
      );

      return data.map((budgetLine) => ({
        ...budgetLine,
        dataMobilizacaoPrevista: budgetLine.dataMobilizacaoPrevista
          ? new Date(budgetLine.dataMobilizacaoPrevista)
          : null,
        dataDesmobilizacaoPrevista: budgetLine.dataDesmobilizacaoPrevista
          ? new Date(budgetLine.dataDesmobilizacaoPrevista)
          : null,
      }));
    },
  });

  function handleExportToSpreadsheet() {
    if (!data) {
      return;
    }

    const spreadsheetData = data.map((budgetLine) => ({
      Sigla: budgetLine.sigla,
      Código: budgetLine.codigo,
      Serviço: budgetLine.servico,
      'Preço Unitário': budgetLine.precoUnitario,
      'Montante Contratual': budgetLine.montanteContratual,
      'Data de Mobilização': budgetLine.dataMobilizacaoPrevista
        ? format(budgetLine.dataMobilizacaoPrevista, 'dd/MM/yyyy')
        : '',
      'Data de Desmobilização': budgetLine.dataDesmobilizacaoPrevista
        ? format(budgetLine.dataDesmobilizacaoPrevista, 'dd/MM/yyyy')
        : '',
      'Quantidade de Meses': budgetLine.quantidadeMeses,
    }));
    const columnSettings = {
      Sigla: {
        width: 15,
      },
      Serviço: {
        width: 55,
      },
      'Preço Unitário': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Montante Contratual': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
    };

    exportToSpreadsheet(spreadsheetData, columnSettings, 'Relatório de POs');
  }

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleExportToSpreadsheet}
        >
          <span className="relative top-px font-semibold">
            Exportar para Excel
          </span>
          <DownloadIcon strokeWidth={2} />
        </Button>
      </div>
      <Table className="p-4">
        <TableHeader>
          <TableRow className="border-none text-xs uppercase hover:bg-transparent">
            <TableHead>Sigla</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Montante Contratual</TableHead>
            <TableHead>Data de Mobilização</TableHead>
            <TableHead>Data de Desmobilização</TableHead>
            <TableHead>Quantidade de Meses</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((budgetLine) => (
              <TableRow key={budgetLine.codigo}>
                <TableCell>{budgetLine.sigla}</TableCell>
                <TableCell>{budgetLine.codigo}</TableCell>
                <TableCell>{budgetLine.servico}</TableCell>
                <TableCell>
                  {formatCurrency(budgetLine.precoUnitario)}
                </TableCell>
                <TableCell>
                  {formatCurrency(budgetLine.montanteContratual)}
                </TableCell>
                <TableCell>
                  {budgetLine.dataMobilizacaoPrevista
                    ? format(budgetLine.dataMobilizacaoPrevista, 'dd/MM/yyyy')
                    : null}
                </TableCell>
                <TableCell>
                  {budgetLine.dataDesmobilizacaoPrevista
                    ? format(
                        budgetLine.dataDesmobilizacaoPrevista,
                        'dd/MM/yyyy',
                      )
                    : null}
                </TableCell>
                <TableCell>{budgetLine.quantidadeMeses}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="py-2">
        {isFetching && (
          <div className="flex w-full items-center justify-center py-4">
            <LoaderIcon className="size-4 animate-spin" />
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
