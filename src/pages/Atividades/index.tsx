import { AuthLayout } from '@/layouts/auth-layout';
import { useAtividades } from './useAtividades';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  EyeIcon,
  LoaderIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { Filter } from '@/components/Filter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toDate } from '@/utils/dates';
import { cn } from '@/lib/utils';

export function Atividades() {
  const {
    dataReferencia,
    pessoaId,
    breadcrumbItems,
    authenticatedPessoaId,
    shouldShowDeleteConfirmation,
    pessoasOptions,
    isFetchingPessoasOptions,
    atividades,
    hasAtividades,
    hasAtividadeFullControl,
    showFetchingLoader,
    showEmptyState,
    isFetchingNextPage,
    hasNextPage,
    isDeletingAtividade,
    handleDataReferenciaChange,
    handlePessoaIdChange,
    fetchNextPage,
    handleAtividadeBeingSelected,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
    executeDeleteAtividade,
  } = useAtividades();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Lista de Atividades</h1>

            <p className="align-bottom leading-tight">
              Aqui estão listadas todas as atividades criadas no sistema.
            </p>
          </div>

          <Link to="/siscontrol/atividades/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar atividade
            </Button>
          </Link>
        </div>

        <div
          className={cn(
            'grid grid-cols-2 gap-4',
            !hasAtividadeFullControl && 'grid-cols-1',
          )}
        >
          <Filter.Date
            placeholder="Data de Referência"
            value={dataReferencia}
            handleChange={handleDataReferenciaChange}
          />

          {hasAtividadeFullControl && (
            <Filter.Select
              value={pessoaId}
              placeholder="Colaborador"
              items={pessoasOptions}
              filterable
              handleChange={handlePessoaIdChange}
              disabled={isFetchingPessoasOptions}
            />
          )}
        </div>

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead>Data de Referência</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasAtividades &&
                atividades.map((element) => {
                  const { id, dataReferencia, atividade, pessoaId } = element;

                  const isMyAtividade = authenticatedPessoaId === pessoaId;

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        {format(toDate(dataReferencia), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="whitespace-break-spaces">
                        <span className="line-clamp-3">{atividade}</span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="custom"
                          className="hover:text-blue-500"
                          onClick={() =>
                            handleAtividadeBeingSelected(id, isMyAtividade)
                          }
                        >
                          {isMyAtividade ? (
                            <PencilIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </Button>

                        {isMyAtividade && (
                          <Button
                            variant="custom"
                            className="hover:text-red-500"
                            onClick={() => displayDeleteConfirmation(id)}
                          >
                            <Trash2Icon size={16} />
                          </Button>
                        )}
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
              <span className="text-destructive ml-2">
                Nenhuma atividade cadastradada para o filtro aplicado!
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
                Tem certeza que deseja excluir essa atividade?
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
                onClick={() => executeDeleteAtividade()}
                disabled={isDeletingAtividade}
              >
                {isDeletingAtividade && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isDeletingAtividade && 'Deletar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
