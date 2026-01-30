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

interface Balance {
  codigo: string;
  servico: string;
  precoUnitario: number;
  montanteContratual: number;
  dataMobilizacaoPrevista: string;
  dataDesmobilizacaoPrevista: string;
  quantidadeMeses: number;
  mesesTrabalhados: number;
  saldoMeses: number;
  saldoValor: number;
  saldoEmValor: number;
  totalMedido: number;
  totalMultaExperiencia: number;
  totalMultaMobilizacao: number;
  totalPago: number;
}

interface FormattedBalance
  extends Omit<
    Balance,
    'dataMobilizacaoPrevista' | 'dataDesmobilizacaoPrevista'
  > {
  dataMobilizacaoPrevista: Date;
  dataDesmobilizacaoPrevista: Date | null;
}

export function BalancesReport() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Relatório de Saldo' },
  ];

  const { data, isFetching } = useQuery<
    FormattedBalance[],
    AxiosError,
    Balance[],
    [string]
  >({
    queryKey: ['balancesReport'],
    queryFn: async () => {
      const { data } = await api.get<Balance[]>(
        '/reports/budget-management/balances',
      );

      return data.map((balance) => ({
        ...balance,
        dataMobilizacaoPrevista: new Date(balance.dataMobilizacaoPrevista),
        dataDesmobilizacaoPrevista: new Date(
          balance.dataDesmobilizacaoPrevista,
        ),
      }));
    },
  });

  function handleExportToSpreadsheet() {
    if (!data) {
      return;
    }

    const spreadsheetData = data.map((balance) => ({
      'Partida Orçamentária': balance.codigo,
      Serviço: balance.servico,
      'Valor Unitário': balance.precoUnitario,
      'Valor Contratual': balance.montanteContratual,
      'Data de Mobilização': format(
        balance.dataMobilizacaoPrevista,
        'dd/MM/yyyy',
      ),
      'Data de Desmobilização': format(
        balance.dataDesmobilizacaoPrevista,
        'dd/MM/yyyy',
      ),
      'Meses Contratual': balance.quantidadeMeses,
      'Meses Trabalhados': balance.mesesTrabalhados,
      'Saldo de Meses': balance.saldoMeses,
      'Saldo de Valor': balance.saldoValor,
      'Saldo em Valor': balance.saldoEmValor,
      'Total Medido': balance.totalMedido,
      'Total de Multas 71': balance.totalMultaExperiencia,
      'Total de Multas 72': balance.totalMultaMobilizacao,
      'Total Pago': balance.totalPago,
    }));
    const columnSettings = {
      Serviço: {
        width: 55,
      },
      'Valor Unitário': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Valor Contratual': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Meses Trabalhados': {
        format: '0.00',
      },
      'Saldo de Meses': {
        format: '0.00',
      },
      'Saldo de Valor': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Saldo em Valor': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Total Medido': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Total de Multas 71': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Total de Multas 72': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
      'Total Pago': {
        width: 30,
        format: '"R$"\ #,##0.00',
      },
    };

    exportToSpreadsheet(spreadsheetData, columnSettings, 'Relatório de Saldos');
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
            <TableHead>Partida Orçamentária</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Valor Unitário</TableHead>
            <TableHead>Valor Contratual</TableHead>
            <TableHead>Data de Mobilização</TableHead>
            <TableHead>Data de Desmobilização</TableHead>
            <TableHead>Meses Contratual</TableHead>
            <TableHead>Meses Trabalhados</TableHead>
            <TableHead>Saldo de Meses</TableHead>
            <TableHead>Saldo de Valor</TableHead>
            <TableHead>Saldo em Valor</TableHead>
            <TableHead>Total Medido</TableHead>
            <TableHead>Total de Multas 71</TableHead>
            <TableHead>Total de Multas 72</TableHead>
            <TableHead>Total Pago</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((balance) => (
              <TableRow key={balance.codigo}>
                <TableCell>{balance.codigo}</TableCell>
                <TableCell>{balance.servico}</TableCell>
                <TableCell>{formatCurrency(balance.precoUnitario)}</TableCell>
                <TableCell>
                  {formatCurrency(balance.montanteContratual)}
                </TableCell>
                <TableCell>
                  {format(balance.dataMobilizacaoPrevista, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {format(balance.dataDesmobilizacaoPrevista, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{balance.quantidadeMeses}</TableCell>
                <TableCell>{balance.mesesTrabalhados.toFixed(2)}</TableCell>
                <TableCell>{balance.saldoMeses.toFixed(2)}</TableCell>
                <TableCell>{formatCurrency(balance.saldoValor)}</TableCell>
                <TableCell>{formatCurrency(balance.saldoEmValor)}</TableCell>
                <TableCell>{formatCurrency(balance.totalMedido)}</TableCell>
                <TableCell>
                  {formatCurrency(balance.totalMultaExperiencia)}
                </TableCell>
                <TableCell>
                  {formatCurrency(balance.totalMultaMobilizacao)}
                </TableCell>
                <TableCell>{formatCurrency(balance.totalPago)}</TableCell>
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
