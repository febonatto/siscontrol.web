import { AuthLayout } from '@/layouts/auth-layout';
import { useExperienciasPessoa } from './useExperienciasPessoa';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { LoaderIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Filter } from '@/components/Filter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function ExperienciasPessoa() {
  const {
    pessoaId,
    breadcrumbItems,
    shouldShowDeleteConfirmation,
    pessoasOptions,
    isFetchingPessoasOptions,
    experienciasPessoa,
    hasExperienciasPessoa,
    hasExperienciaFullControl,
    showFetchingLoader,
    showEmptyState,
    emptyMessage,
    isFetchingNextPage,
    hasNextPage,
    isDeletingExperienciaPessoa,
    handlePessoaIdChange,
    fetchNextPage,
    handleExperienciaPessoaBeingEdited,
    executeDeleteExperienciaPessoa,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
  } = useExperienciasPessoa();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">
              Lista de Experiências Profissionais
            </h1>

            <p className="align-bottom leading-tight">
              Aqui estão listadas todas as experiẽncias profissionais criadas no
              sistema.
            </p>
          </div>

          <Link to="/siscontrol/experiencias-pessoa/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar experiência
            </Button>
          </Link>
        </div>

        {hasExperienciaFullControl && (
          <Filter.Select
            value={pessoaId}
            placeholder="Colaborador"
            items={pessoasOptions}
            filterable
            handleChange={handlePessoaIdChange}
            disabled={isFetchingPessoasOptions}
          />
        )}

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Responsabilidades</TableHead>
                <TableHead>Tempo de Cargo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasExperienciasPessoa &&
                experienciasPessoa.map((experienciaPessoa) => {
                  const {
                    id,
                    nomeEmpresa,
                    ocupacao,
                    responsabilidades,
                    tempoCargo,
                  } = experienciaPessoa;

                  return (
                    <TableRow key={id}>
                      <TableCell>{nomeEmpresa}</TableCell>
                      <TableCell>{ocupacao}</TableCell>
                      <TableCell className="max-w-60 whitespace-break-spaces">
                        <span className="line-clamp-3">
                          {responsabilidades}
                        </span>
                      </TableCell>
                      <TableCell>{(tempoCargo / 365).toFixed(2)}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="custom"
                          className="hover:text-blue-500"
                          onClick={() => handleExperienciaPessoaBeingEdited(id)}
                        >
                          <PencilIcon size={16} />
                        </Button>

                        <Button
                          variant="custom"
                          className="hover:text-red-500"
                          onClick={() => displayDeleteConfirmation(id)}
                        >
                          <Trash2Icon size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <div className="py-2">
            {showFetchingLoader && (
              <div className="flex w-full items-center justify-center py-4">
                <LoaderIcon className="size-4 animate-spin" />
              </div>
            )}

            {showEmptyState && (
              <span
                className={cn(
                  'ml-2',
                  !pessoaId ? 'text-zinc-600' : 'text-destructive',
                )}
              >
                {emptyMessage}
              </span>
            )}

            <InfiniteScroll
              hasNextPage={hasNextPage}
              isLoading={isFetchingNextPage}
              getNextPage={fetchNextPage}
            />
          </div>
        </div>
      </div>

      {shouldShowDeleteConfirmation && (
        <Dialog
          open={shouldShowDeleteConfirmation}
          onOpenChange={hideDeleteConfirmation}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tem certeza que deseja excluir essa experiência profissional?
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
                onClick={hideDeleteConfirmation}
              >
                Cancelar
              </Button>

              <Button
                variant="destructive"
                className="w-24"
                onClick={() => executeDeleteExperienciaPessoa()}
                disabled={isDeletingExperienciaPessoa}
              >
                {isDeletingExperienciaPessoa && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isDeletingExperienciaPessoa && 'Deletar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
