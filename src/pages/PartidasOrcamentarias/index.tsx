import { AuthLayout } from '@/layouts/auth-layout';
import { usePartidasOrcamentarias } from './usePartidasOrcamentarias';
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

export function PartidasOrcamentarias() {
  const {
    breadcrumbItems,
    shouldShowDeleteConfirmation,
    partidasOrcamentarias,
    hasPartidasOrcamentarias,
    showFetchingLoader,
    showEmptyState,
    emptyMessage,
    isFetchingNextPage,
    hasNextPage,
    isDeletingPartidaOrcamentaria,
    handleQueryChange,
    fetchNextPage,
    handlePartidaOrcamentariaBeingEdited,
    executePartidaOrcamentariaDeletion,
    displayDeleteConfirmation,
    hideDeleteConfirmation,
  } = usePartidasOrcamentarias();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">
              Lista de Partidas Orçamentárias
            </h1>

            <p className="align-bottom leading-tight">
              Aqui estão listadas todas as partidas orçamentárias criadas no
              sistema.
            </p>
          </div>

          <Link to="/siscontrol/partidas-orcamentarias/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar partida
            </Button>
          </Link>
        </div>

        <Filter.Text
          placeholder="Filtrar por código ou serviço"
          handleChange={handleQueryChange}
        />

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead>Código</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Sigla do Aeroporto</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasPartidasOrcamentarias &&
                partidasOrcamentarias.map((partidaOrcamentaria) => {
                  const { id, codigo, servico, pessoa, aeroporto } =
                    partidaOrcamentaria;
                  const { nomeCompleto } = pessoa || {};
                  const { sigla } = aeroporto || {};

                  const colaborador = nomeCompleto ? nomeCompleto : undefined;

                  return (
                    <TableRow key={id}>
                      <TableCell>{codigo}</TableCell>
                      <TableCell className="max-w-[256px] whitespace-break-spaces">
                        {servico}
                      </TableCell>
                      <TableCell>{sigla}</TableCell>
                      <TableCell>{colaborador}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="custom"
                          className="hover:text-blue-500"
                          onClick={() =>
                            handlePartidaOrcamentariaBeingEdited(id)
                          }
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
              <span className="text-destructive ml-2">{emptyMessage}</span>
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
                Tem certeza que deseja excluir essa partida orçamentária?
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
                onClick={() => executePartidaOrcamentariaDeletion()}
                disabled={isDeletingPartidaOrcamentaria}
              >
                {isDeletingPartidaOrcamentaria && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {!isDeletingPartidaOrcamentaria && 'Deletar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AuthLayout>
  );
}
