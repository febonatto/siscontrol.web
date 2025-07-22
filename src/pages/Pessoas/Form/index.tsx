import { AuthLayout } from '@/layouts/auth-layout';
import { usePessoaForm } from './usePessoaForm';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon, Link2Icon } from 'lucide-react';
import { cnpjMask, coinMask, zipCodeMask } from '@/utils/masks';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

export function PessoaForm() {
  const {
    breadcrumbItems,
    pessoaBeingEdited,
    hasPartidaOrcamentaria,
    generoOptions,
    estadoCivilOptions,
    tipoContratacaoOptions,
    control,
    isFieldsDisabled,
    isButtonDisabled,
    shouldShowRoleField,
    handleSubmit,
    onSubmit,
  } = usePessoaForm();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <TooltipProvider>
        <form
          className="grid grid-cols-12 gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="col-span-6">
            <Input.Text
              control={control}
              name="nomeCompleto"
              label="Nome Completo *"
              maxLength={50}
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-6">
            <Input.Text
              control={control}
              name="nomeReduzido"
              label="Nome Reduzido"
              maxLength={50}
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-6 grid grid-cols-2 gap-4">
            <Input.Text
              control={control}
              name="matricula"
              label="Matricula"
              maxLength={6}
              disabled={isFieldsDisabled}
            />

            <div className="relative">
              <Input.Text
                control={control}
                name="numeroCnh"
                label="Numero da CNH"
                onlyNumbers
                maxLength={11}
                disabled={isFieldsDisabled}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute top-4.5 right-2 -translate-y-1/2">
                    <InfoIcon className="size-4 text-zinc-600" />
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  O número da cnh segue o seguinte padrão:
                  <strong className="ml-2 block">
                    • apenas números corridos com 11 dígitos
                  </strong>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="col-span-6 grid grid-cols-3 gap-4">
            <Input.Date
              control={control}
              name="dataNascimento"
              label="Data de Nascimento"
              disabled={isFieldsDisabled}
            />

            <Input.Select
              control={control}
              name="genero"
              label="Gênero"
              items={generoOptions}
              disabled={isFieldsDisabled}
            />

            <Input.Select
              control={control}
              name="estadoCivil"
              label="Estado Civil"
              items={estadoCivilOptions}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-4">
            <div className="relative">
              <Input.Text
                control={control}
                name="emailPessoal"
                label="E-mail Pessoal *"
                maxLength={100}
                disabled={isFieldsDisabled}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute top-4.5 right-2 -translate-y-1/2">
                    <InfoIcon className="size-4 text-zinc-600" />
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  O formato para um e-mail válido segue o seguinte padrão:
                  <strong className="ml-2 block">
                    • local (parte antes do arroba "@")
                  </strong>
                  <strong className="ml-2 block">
                    • domínio (parte após o arroba "@")
                  </strong>
                  <strong className="ml-2 block">
                    • ao menos um "@" (separação entre local e domínio)
                  </strong>
                  <strong className="ml-2 block">
                    • ao menos um "." (parte após o domínio ".com")
                  </strong>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="relative">
              <Input.Text
                control={control}
                name="emailCorporativo"
                label="E-mail Corporativo"
                maxLength={100}
                disabled={isFieldsDisabled}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute top-4.5 right-2 -translate-y-1/2">
                    <InfoIcon className="size-4 text-zinc-600" />
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  O formato para um e-mail válido segue o seguinte padrão:
                  <strong className="ml-2 block">
                    • local (parte antes do arroba "@")
                  </strong>
                  <strong className="ml-2 block">
                    • domínio (parte após o arroba "@")
                  </strong>
                  <strong className="ml-2 block">
                    • ao menos um "@" (separação entre local e domínio)
                  </strong>
                  <strong className="ml-2 block">
                    • ao menos um "." (parte após o domínio ".com")
                  </strong>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="col-span-6 grid grid-cols-2 gap-4">
            <Input.Text
              control={control}
              name="telefonePessoal"
              label="Telefone Pessoal"
              onlyNumbers
              maxLength={16}
              disabled={isFieldsDisabled}
            />

            <Input.Text
              control={control}
              name="telefoneCorporativo"
              label="Telefone Corporativo"
              onlyNumbers
              maxLength={16}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-6 grid grid-cols-3 gap-4">
            <Input.Text
              control={control}
              name="pais"
              label="País"
              maxLength={50}
              disabled={isFieldsDisabled}
            />

            <Input.Text
              control={control}
              name="estado"
              label="Estado"
              maxLength={50}
              disabled={isFieldsDisabled}
            />

            <Input.Text
              control={control}
              name="cidade"
              label="Cidade"
              maxLength={50}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-6 grid grid-cols-6 gap-4">
            <div className="relative col-span-2">
              <Input.Text
                control={control}
                name="codigoPostal"
                label="Código Postal"
                onlyNumbers
                applyMask={zipCodeMask}
                maxLength={9}
                disabled={isFieldsDisabled}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute top-4.5 right-2 -translate-y-1/2">
                    <InfoIcon className="size-4 text-zinc-600" />
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  O código postal brasileiro segue o seguinte padrão:
                  <strong className="ml-2 block">• 00000-000</strong>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="col-span-4">
              <Input.Text
                control={control}
                name="endereco"
                label="Endereço"
                maxLength={150}
                disabled={isFieldsDisabled}
              />
            </div>
          </div>
          <div className="col-span-12">
            <Input.Text
              control={control}
              name="formacao"
              label="Formação"
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-12">
            <Input.TextArea
              control={control}
              name="resumoCurricular"
              label="Resumo Curricular"
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-2">
            <Input.Text
              control={control}
              name="tamanhoSapato"
              label="Tamanho do Sapato"
              onlyNumbers
              maxLength={2}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-2">
            <Input.Text
              control={control}
              name="tamanhoCamisa"
              label="Tamanho da Camisa"
              maxLength={3}
              disabled={isFieldsDisabled}
            />
          </div>
          <div
            className={cn('col-span-6', !shouldShowRoleField && 'col-span-8')}
          >
            <Input.Text
              control={control}
              name="funcao"
              label="Função"
              maxLength={50}
              disabled={isFieldsDisabled}
            />
          </div>
          {shouldShowRoleField && (
            <div className="col-span-2">
              <Input.Text
                control={control}
                name="nivelPermissao"
                label="Nível de Permissão *"
                onlyNumbers
                maxLength={1}
                disabled={isFieldsDisabled}
              />
            </div>
          )}
          <div className="col-span-4">
            <Input.Text
              control={control}
              name="remuneracao"
              label="Remuneração"
              onlyNumbers
              applyMask={coinMask}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-4">
            <Input.Text
              control={control}
              name="remuneracaoPactuada"
              label="Remuneração Pactuada"
              onlyNumbers
              applyMask={coinMask}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-4">
            <Input.Select
              control={control}
              name="regimeContratacao"
              label="Regime de Contratação *"
              items={tipoContratacaoOptions}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-3">
            <Input.Text
              control={control}
              name="cnpj"
              label="CNPJ"
              onlyNumbers
              applyMask={cnpjMask}
              maxLength={18}
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-3">
            <Input.Text
              control={control}
              name="nomeEmpresa"
              label="Nome da Empresa"
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-3">
            <Input.Date
              control={control}
              name="dataContratacao"
              label="Data de Contratação"
              disabled={isFieldsDisabled}
            />
          </div>
          <div className="col-span-3">
            <Input.Date
              control={control}
              name="dataEncerramento"
              label="Data de Encerramento"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-4">
            <Input.Text
              control={control}
              name="idColete"
              label="Id Colete"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-4">
            <Input.Text
              control={control}
              name="nomeCoordenador"
              label="Nome do Coordenador"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-4">
            <Input.Text
              control={control}
              name="pis"
              label="PIS"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-5">
            <Input.Text
              control={control}
              name="rg"
              label="RG"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-2">
            <Input.Text
              control={control}
              name="categoriaCnh"
              label="Categoria CNH"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-5">
            <Input.Date
              control={control}
              name="dataVencimentoCnh"
              label="Data de Vencimento da CNH"
              disabled={isFieldsDisabled}
            />
          </div>

          <div className="col-span-12">
            <Input.Switch
              control={control}
              name="status"
              label="Status"
              disabled={isFieldsDisabled}
            />
          </div>

          {hasPartidaOrcamentaria && (
            <div className="col-span-12 space-y-2.5 rounded-lg border border-zinc-300 p-4">
              <strong className="flex items-center gap-2 text-zinc-800">
                Partida Orçamentária
                <Link
                  to={`/siscontrol/partidas-orcamentarias/atualizar/${pessoaBeingEdited?.partidaOrcamentaria?.id}`}
                >
                  <Link2Icon size={16} />
                </Link>
              </strong>

              <div className="5 space-y-1">
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">Código: </span>
                  {pessoaBeingEdited?.partidaOrcamentaria?.codigo}
                </p>

                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">Serviço: </span>
                  {pessoaBeingEdited?.partidaOrcamentaria?.servico}
                </p>

                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">Aeroporto: </span>
                  {pessoaBeingEdited?.partidaOrcamentaria?.aeroporto}
                </p>
              </div>
            </div>
          )}

          <div className="col-span-12 mt-4 flex justify-end">
            <Button type="submit" className="w-40" disabled={isButtonDisabled}>
              Salvar
            </Button>
          </div>
        </form>
      </TooltipProvider>
    </AuthLayout>
  );
}
