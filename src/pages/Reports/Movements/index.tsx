import { Button } from '@/components/ui/button';
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
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { DownloadIcon, LoaderIcon } from 'lucide-react';
import { exportToSpreadsheet } from '../utils';

interface Movement {
  codigo: string;
  nomeCompleto: string;
  dataMobilizacaoReal: string;
  dataDesmobilizacaoReal: string | null;
}

interface FormattedMovement {
  codigo: string;
  nomeCompleto: string;
  dataMobilizacaoReal: Date;
  dataDesmobilizacaoReal: Date | null;
}

export function MovementsReport() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Relatório de Movimentações' },
  ];

  const { data, isFetching } = useQuery<
    FormattedMovement[],
    AxiosError,
    Movement[],
    [string]
  >({
    queryKey: ['movementsReport'],
    queryFn: async () => {
      const { data } = await api.get<Movement[]>(
        '/reports/budget-management/movements',
      );

      return data.map((movement) => ({
        ...movement,
        dataMobilizacaoReal: new Date(movement.dataMobilizacaoReal),
        dataDesmobilizacaoReal: movement.dataDesmobilizacaoReal
          ? new Date(movement.dataDesmobilizacaoReal)
          : null,
      }));
    },
  });

  function handleExportToSpreadsheet() {
    if (!data) {
      return;
    }

    const spreadsheetData = data.map((movement) => ({
      Código: movement.codigo,
      Colaborador: movement.nomeCompleto,
      'Data de Mobilização': format(movement.dataMobilizacaoReal, 'dd/MM/yyyy'),
      'Data de Desmobilização': movement.dataDesmobilizacaoReal
        ? format(movement.dataDesmobilizacaoReal, 'dd/MM/yyyy')
        : '',
    }));
    const columnSettings = {
      Colaborador: {
        width: 40,
      },
    };

    exportToSpreadsheet(
      spreadsheetData,
      columnSettings,
      'Relatório de Movimentações',
    );
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
            <TableHead>Código</TableHead>
            <TableHead>Colaborador</TableHead>
            <TableHead>Data de Mobilização</TableHead>
            <TableHead>Data de Desmobilização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((movement, index) => (
              <TableRow key={`${index}.${movement.codigo}`}>
                <TableCell>{movement.codigo}</TableCell>
                <TableCell>{movement.nomeCompleto}</TableCell>
                <TableCell>
                  {format(movement.dataMobilizacaoReal, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {movement.dataDesmobilizacaoReal
                    ? format(movement.dataDesmobilizacaoReal, 'dd/MM/yyyy')
                    : null}
                </TableCell>
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
