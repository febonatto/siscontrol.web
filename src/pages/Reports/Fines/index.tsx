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
import { DownloadIcon, LoaderIcon } from 'lucide-react';
import { exportToSpreadsheet } from '../utils';
import { Button } from '@/components/ui/button';

interface Fine {
  idBm: number;
  codigo: string;
  nomeCompleto: string;
  vlMultaExperiencia: number;
  vlMultaMobilizacao: number;
}

export function FinesReport() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Relatório de Multas' },
  ];

  const { data, isFetching } = useQuery<Fine[], AxiosError, Fine[], [string]>({
    queryKey: ['finesReport'],
    queryFn: async () => {
      const { data } = await api.get<Fine[]>(
        '/reports/budget-management/fines',
      );

      return data;
    },
  });

  function handleExportToSpreadsheet() {
    if (!data) {
      return;
    }

    const spreadsheetData = data.map((fine) => ({
      'Número do BM': fine.idBm,
      Código: fine.codigo,
      Colaborador: fine.nomeCompleto,
      'Multa por Experiência': fine.vlMultaExperiencia,
      'Multa por Mobilização': fine.vlMultaMobilizacao,
    }));
    const columnSettings = {
      'Número do BM': {
        width: 15,
      },
      Colaborador: {
        width: 40,
      },
      'Multa por Experiência': {
        format: '"R$"\ #,##0.00',
      },
      'Multa por Mobilização': {
        format: '"R$"\ #,##0.00',
      },
    };

    exportToSpreadsheet(spreadsheetData, columnSettings, 'Relatório de Multas');
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
            <TableHead>Número do BM</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Colaborador</TableHead>
            <TableHead>Multa por Experiência</TableHead>
            <TableHead>Multa por Mobilização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((fine, index) => (
              <TableRow key={`${index}.${fine.codigo}`}>
                <TableCell>{fine.idBm}</TableCell>
                <TableCell>{fine.codigo}</TableCell>
                <TableCell>{fine.nomeCompleto}</TableCell>
                <TableCell>{formatCurrency(fine.vlMultaExperiencia)}</TableCell>
                <TableCell>{formatCurrency(fine.vlMultaMobilizacao)}</TableCell>
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
