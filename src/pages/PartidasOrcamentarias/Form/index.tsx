import { AuthLayout } from '@/layouts/auth-layout';
import { usePartidasOrcamentariasForm } from './usePartidasOrcamentariasForm';
import { Input } from '@/components/input';
import { coinMask } from '@/utils/masks';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LoaderIcon } from 'lucide-react';
import { addMonths, format } from 'date-fns';
import { useState } from 'react';
import { DesmobilizarPessoaDialog } from './DesmobilizarPessoaDialog';
import { toDate } from '@/utils/dates';

export function PartidasOrcamentariasForm() {
  const {
    breadcrumbItems,
    aeroportoOptions,
    isFetchingAeroportoOptions,
    pessoaPartida,
    pessoasOptions,
    isFetchingPessoasOptions,
    control,
    currentMobilizedPessoa,
    currentQuantidadeMeses,
    currentDataMobilizacaoPrevista,
    currentPrecoUnitario,
    isFieldsDisabled,
    isButtonDisabled,
    isDemobilizingPessoa,
    isDisabledChangePessoa,
    handleSubmit,
    onSubmit,
    mutateDemobilizePessoa,
  } = usePartidasOrcamentariasForm();

  const [
    isDesmobilizarPessoaDialogVisible,
    setIsDesmobilizarPessoaDialogVisible,
  ] = useState(false);

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="col-span-6">
          <Input.Text
            control={control}
            name="codigo"
            label="Código"
            maxLength={15}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-6">
          <Input.Select
            control={control}
            name="aeroportoId"
            label="Aeroporto"
            items={aeroportoOptions}
            filterable
            disabled={isFetchingAeroportoOptions || isFieldsDisabled}
          />
        </div>

        <div className="col-span-12">
          <Input.Text
            control={control}
            name="servico"
            label="Serviço"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="quantidadePessoas"
            label="Quantidade de Pessoas"
            onlyNumbers
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Text
            control={control}
            name="quantidadeMeses"
            label="Quantidade de Meses"
            onlyNumbers
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="col-span-3">
          <Input.Date
            control={control}
            name="dataMobilizacaoPrevista"
            label="Data de Mobilização Prevista"
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="relative col-span-3 flex items-center rounded-md border-zinc-50 pl-3 text-left font-normal shadow-sm">
          <span className="pointer-events-none absolute top-0 left-1.5 z-10 -translate-y-1/2 bg-white px-2 text-xs text-zinc-700 opacity-70 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs">
            Data de Desmobilização Prevista
          </span>

          {currentQuantidadeMeses && currentDataMobilizacaoPrevista && (
            <span className="text-sm">
              {format(
                addMonths(
                  currentDataMobilizacaoPrevista,
                  Number(currentQuantidadeMeses),
                ),
                'dd/MM/yyyy',
              )}
            </span>
          )}
        </div>

        <div className="col-span-2">
          <Input.Text
            control={control}
            name="precoUnitario"
            label="Preço Unitário"
            onlyNumbers
            applyMask={coinMask}
            disabled={isFieldsDisabled}
          />
        </div>

        <div className="relative col-span-2 flex items-center rounded-md border-zinc-50 pl-3 text-left font-normal shadow-sm">
          <span className="pointer-events-none absolute top-0 left-1.5 z-10 -translate-y-1/2 bg-white px-2 text-xs text-zinc-700 opacity-70 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs">
            Montante Contratual
          </span>

          {currentQuantidadeMeses && currentPrecoUnitario && (
            <span className="text-sm">
              {coinMask(
                String(
                  (Number(currentQuantidadeMeses) *
                    Number(currentPrecoUnitario.replace(/\D/g, ''))) /
                    100,
                ),
                true,
              )}
            </span>
          )}
        </div>

        <div className="col-span-2">
          <Input.Text
            control={control}
            name="tempoExperienciaRequisitado"
            label="Experiência mínima"
            onlyNumbers
            disabled={isFieldsDisabled}
          />
        </div>

        <Separator className="col-span-12 my-3" />

        <div className="col-span-6">
          <Input.Select
            control={control}
            name="pessoaPartida.pessoaId"
            label="Colaborador Responsável"
            items={pessoasOptions}
            filterable
            disabled={
              isFetchingPessoasOptions ||
              isFieldsDisabled ||
              isDisabledChangePessoa
            }
          />
          {currentMobilizedPessoa?.dataDesmobilizacaoReal && (
            <small className="mt-2 ml-4 inline-block text-xs">
              Será desmobilizado em:{' '}
              {format(
                toDate(currentMobilizedPessoa.dataDesmobilizacaoReal),
                'dd/MM/yyyy',
              )}
            </small>
          )}
        </div>

        <div className="col-span-6">
          <Input.Date
            control={control}
            name="pessoaPartida.dataMobilizacaoReal"
            label="Data de Mobilização Real"
            disabled={isFieldsDisabled || isDisabledChangePessoa}
          />
        </div>

        <div className="col-span-12 mt-4 flex justify-end gap-4">
          {isDisabledChangePessoa && (
            <Button
              type="button"
              variant="outline"
              className="border-destructive text-destructive hover:text-destructive/80 w-56 hover:bg-transparent"
              onClick={() => setIsDesmobilizarPessoaDialogVisible(true)}
            >
              {isDemobilizingPessoa ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                'Desmobilizar Colaborador'
              )}
            </Button>
          )}

          <Button type="submit" className="w-40" disabled={isButtonDisabled}>
            Salvar
          </Button>
        </div>
      </form>

      {pessoaPartida && pessoaPartida.length > 0 && (
        <div className="mt-8 rounded-lg border p-4">
          <strong className="mb-4 block">Histórico de colaboradores</strong>

          <div className="max-h-[576px] space-y-4 overflow-auto">
            {pessoaPartida.map(
              ({ id, dataMobilizacaoReal, dataDesmobilizacaoReal, pessoa }) => {
                const { matricula, nomeCompleto } = pessoa;

                return (
                  <div key={id}>
                    <span className="text-sm font-semibold">
                      {`${nomeCompleto} ${matricula ? `- ${matricula}` : ''}`}{' '}
                    </span>

                    {dataMobilizacaoReal && (
                      <span className="text-sm text-zinc-500">
                        | Mobilizado em{' '}
                        {format(toDate(dataMobilizacaoReal), 'dd/MM/yyyy')}{' '}
                      </span>
                    )}

                    {dataDesmobilizacaoReal && (
                      <span className="text-sm text-zinc-500">
                        | Desmobilizado em{' '}
                        {format(toDate(dataDesmobilizacaoReal), 'dd/MM/yyyy')}
                      </span>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      <DesmobilizarPessoaDialog
        isVisible={isDesmobilizarPessoaDialogVisible}
        onConfirm={mutateDemobilizePessoa}
        onClose={() => setIsDesmobilizarPessoaDialogVisible(false)}
      />
    </AuthLayout>
  );
}
