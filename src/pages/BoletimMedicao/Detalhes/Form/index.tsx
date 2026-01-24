import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import { api } from '@/configs/httpClient';
import { AuthLayout } from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { BmDetalhe } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { toDate } from '@/utils/dates';
import { transformCurrency } from '@/utils/string';
import { currency } from '@/validators/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { HourglassIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

interface PageParams {
  idBm?: string;
  idDetalhe?: string;
  [key: string]: string | undefined;
}

const detalheSchema = z.object({
  vlMedicaoPartidaOrcamentaria: currency({
    allowNegative: true,
    optional: true,
  }),
  qtdMesTrabalho: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: 'A proporção de dias trabalhados deve ser um número',
    })
    .optional(),
  vlMultaExperiencia: currency({ allowNegative: true, optional: true }),
  vlMultaMobilizacao: currency({ allowNegative: true, optional: true }),
});

type DetalheForm = z.infer<typeof detalheSchema>;

type ReadDetalheResponse = AxiosResponse<BmDetalhe>;

export function BoletimMedicaoDetalhesForm() {
  const queryClient = useQueryClient();
  const { idBm, idDetalhe } = useParams<PageParams>();
  const navigate = useNavigate();

  if (!idDetalhe) {
    navigate(`/siscontrol/boletim-medicao/${idBm}`);
    return;
  }

  const { data, isFetched } = useQuery<
    ReadDetalheResponse,
    AxiosError,
    ReadDetalheResponse,
    [string, string]
  >({
    queryFn: () =>
      api.get('/bm/find-one', {
        params: {
          type: 'detalhe',
          id: idDetalhe,
        },
      }),
    queryKey: ['bm-detalhe', idDetalhe],
    enabled: !!idDetalhe,
  });

  const detalhe = data?.data || null;

  const { control, formState, handleSubmit } = useForm<DetalheForm>({
    resolver: zodResolver(detalheSchema),
    values: {
      vlMedicaoPartidaOrcamentaria: transformCurrency(
        detalhe?.vlMedicaoPartidaOrcamentaria.toString(),
      ),
      qtdMesTrabalho: detalhe?.qtdMesTrabalho.toString(),
      vlMultaExperiencia: transformCurrency(
        detalhe?.vlMultaExperiencia.toString(),
      ),
      vlMultaMobilizacao: transformCurrency(
        detalhe?.vlMultaMobilizacao.toString(),
      ),
    },
  });

  const { dirtyFields } = formState;

  const isFormDirty = Object.keys(dirtyFields).length > 0;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Boletim de Medição', href: '/siscontrol/boletim-medicao' },
    {
      label: 'Detalhes do Boletim de Medição',
      href: `/siscontrol/boletim-medicao/${idBm}`,
    },
    { label: 'Editar Detalhes' },
  ];

  const { mutate, isPending: isUpdating } = useMutation<
    void,
    AxiosError,
    Partial<DetalheForm>,
    unknown
  >({
    mutationKey: ['update-detalhe', idDetalhe],
    mutationFn: (data: Partial<DetalheForm>) =>
      api.patch(`/bm/update-detalhes/${idDetalhe}`, {
        ...data,
        ...(data.qtdMesTrabalho && {
          qtdMesTrabalho: Number(data.qtdMesTrabalho),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'bm-resumos' ||
          query.queryKey[0] === 'bm-detalhes' ||
          query.queryKey[0] === 'bm-detalhe',
      });
    },
  });

  function onSubmit(data: DetalheForm) {
    const value = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key as keyof DetalheForm] = data[key as keyof DetalheForm];
      return acc;
    }, {} as DetalheForm);

    mutate(value);
  }

  if (!detalhe && isFetched) {
    navigate(`/siscontrol/boletim-medicao/${idBm}`);
    return;
  }

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      {isUpdating && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border bg-gray-50 p-4">
          <HourglassIcon className="relative -top-px size-3.5" />
          <p className="text-sm text-gray-800">
            A atualização de um detalhe de boletim de medição é uma operação que
            pode levar alguns segundos, aguarde enquanto completamos a operação
            ...
          </p>
        </div>
      )}

      <form
        className="grid grid-cols-12 gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FakeInput
          label="Cod. Partida"
          value={detalhe?.partidaOrcamentaria.codigo}
        />

        <FakeInput
          label="Serviço"
          value={detalhe?.partidaOrcamentaria.servico}
          className="col-span-3"
        />

        <FakeInput
          label="Aeroporto"
          value={detalhe?.partidaOrcamentaria.aeroporto.nome}
          className="col-span-4"
        />

        <FakeInput
          label="Colaborador"
          value={detalhe?.pessoa?.nomeReduzido ?? ''}
          className="col-span-3"
        />

        <FakeInput
          label="Data Mobilização Real"
          value={
            detalhe?.dataMobilizacaoReal
              ? format(toDate(detalhe?.dataMobilizacaoReal), 'dd/MM/yyyy')
              : ''
          }
        />

        <FakeInput
          label="Data Desmobilização Real"
          value={
            detalhe?.dataDesmobilizacaoReal
              ? format(toDate(detalhe?.dataDesmobilizacaoReal), 'dd/MM/yyyy')
              : ''
          }
        />

        <div className="col-span-2">
          <Input.Currency
            control={control}
            name="vlMedicaoPartidaOrcamentaria"
            label="Preço Unitário"
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="qtdMesTrabalho"
            label="Proporção de Dias Trabalhados"
            onlyNumbers
          />
        </div>

        <FakeInput
          label="Valor da Medição"
          value={
            detalhe?.vlMedicaoBm
              ? formatCurrency(parseFloat(detalhe?.vlMedicaoBm.toString()))
              : ''
          }
          className="col-span-3"
        />

        <FakeInput
          label="Experiência do Colaborador"
          value={detalhe?.tempoExperienciaPessoa.toString() ?? ''}
        />

        <FakeInput
          label="Diferença Experiência"
          value={detalhe?.diferencaExperiencia.toString() ?? ''}
        />

        <div className="col-span-2">
          <Input.Currency
            control={control}
            name="vlMultaExperiencia"
            label="Multa por Experiência"
          />
        </div>

        <FakeInput
          label="Percentual de Multa por Mobilização"
          value={
            detalhe?.percentualMobilizacao
              ? `${detalhe.percentualMobilizacao}%`
              : '0%'
          }
          className="col-span-3"
        />

        <div className="col-span-3">
          <Input.Currency
            control={control}
            name="vlMultaMobilizacao"
            label="Multa por Mobilização"
          />
        </div>

        <FakeInput
          label="Valor Real da Medição"
          value={
            detalhe?.vlMedicaoReal
              ? formatCurrency(parseFloat(detalhe.vlMedicaoReal.toString()))
              : ''
          }
          className="col-span-3"
        />

        <div className="col-span-12 flex justify-end">
          <Button className="w-40" disabled={!isFormDirty || isUpdating}>
            Salvar
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

interface FakeInputProps {
  label: string;
  value: string | undefined;
  className?: string;
}

function FakeInput({ label, value, className }: FakeInputProps) {
  return (
    <div
      className={cn(
        'relative col-span-2 flex h-9 items-center rounded-lg border border-zinc-50 px-2 shadow-sm',
        className,
      )}
    >
      <strong className="pointer-events-none absolute -top-2 left-1 bg-white px-2 text-xs font-normal text-zinc-600">
        {label}
      </strong>
      <div className="max-w-full overflow-hidden">
        <span className="pointer-events-none text-sm whitespace-nowrap text-zinc-500">
          {value}
        </span>
      </div>
    </div>
  );
}
