import { AuthLayout } from '@/layouts/auth-layout';
import { useAeroportos } from './useAeroportos';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { LoaderIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
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

export function Aeroportos() {
  const {
    breadcrumbItems,
    aeroportos,
    hasAeroportos,
    showFetchingLoader,
    showEmptyState,
    aeroportoBeingDeleted,
    isDeletingAeroporto,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleAeroportoBeingEdited,
    handleAeroportoBeingDeleted,
    handleCancelDelete,
    handleConfirmDelete,
  } = useAeroportos();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Lista de Aeroportos</h1>

            <p className="align-bottom leading-tight">
              Aqui estão listados todos os aeroportos criados no sistema.
            </p>
          </div>

          <Link to="/siscontrol/aeroportos/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar aeroporto
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead>Lote</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasAeroportos &&
                aeroportos.map((aeroporto) => {
                  const { id, sigla, nome, lote, estado } = aeroporto;

                  return (
                    <TableRow key={id}>
                      <TableCell>Lote {lote}</TableCell>
                      <TableCell>{sigla}</TableCell>
                      <TableCell>{nome}</TableCell>
                      <TableCell>{estado}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="custom"
                          className="hover:text-blue-500"
                          onClick={() => handleAeroportoBeingEdited(aeroporto)}
                        >
                          <PencilIcon size={16} />
                        </Button>

                        <Button
                          variant="custom"
                          className="hover:text-red-500"
                          onClick={() => handleAeroportoBeingDeleted(id)}
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
              <span className="text-destructive ml-2">
                Não existe nenhum aeroporto cadastrado no sistema.
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

      {aeroportoBeingDeleted && (
        <Dialog
          open={!!aeroportoBeingDeleted}
          onOpenChange={handleCancelDelete}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tem certeza que deseja excluir esse aeroporto?
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
                onClick={handleCancelDelete}
              >
                Cancelar
              </Button>

              <Button
                variant="destructive"
                className="w-24"
                onClick={handleConfirmDelete}
                disabled={isDeletingAeroporto}
              >
                {isDeletingAeroporto && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isDeletingAeroporto && 'Deletar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
