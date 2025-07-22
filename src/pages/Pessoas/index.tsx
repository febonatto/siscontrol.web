import { AuthLayout } from '@/layouts/auth-layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoaderIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router';
import { usePessoa } from './usePessoa';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { Filter } from '@/components/Filter';

export function Pessoas() {
  const {
    breadcrumbItems,
    pessoas,
    hasPessoas,
    showFetchingLoader,
    showEmptyState,
    emptyStateMessage,
    isFetchingNextPage,
    hasNextPage,
    handleChangeName,
    fetchNextPage,
    handlePessoaBeingEdited,
  } = usePessoa();

  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <div className="w-full space-y-5">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Lista de Colaboradores</h1>

            <p className="align-bottom leading-tight">
              Aqui estão listados todos os colaboradores criados no sistema.
            </p>
          </div>

          <Link to="/siscontrol/pessoas/criar">
            <Button size="sm">
              <PlusIcon size={14} />
              Adicionar colaborador
            </Button>
          </Link>
        </div>

        <Filter.Text
          placeholder="Filtrar por nome"
          handleChange={handleChangeName}
        />

        <div className="relative">
          <Table className="p-4">
            <TableHeader>
              <TableRow className="border-none text-xs uppercase hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>E-mail Corporativo</TableHead>
                <TableHead>Telefone Corporativo</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Tempo de Experiência</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {hasPessoas &&
                pessoas.map((pessoa) => {
                  const {
                    id,
                    nomeCompleto,
                    emailCorporativo,
                    telefoneCorporativo,
                    cidade,
                    tempoExperiencia,
                  } = pessoa;

                  return (
                    <TableRow key={id}>
                      <TableCell>{nomeCompleto}</TableCell>
                      <TableCell>{emailCorporativo}</TableCell>
                      <TableCell>{telefoneCorporativo}</TableCell>
                      <TableCell>{cidade}</TableCell>
                      <TableCell>{tempoExperiencia}</TableCell>
                      <TableCell>
                        <Button
                          variant="custom"
                          className="hover:text-blue-500"
                          onClick={() => handlePessoaBeingEdited(id)}
                        >
                          <PencilIcon size={16} />
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
              <span className="text-destructive ml-2">{emptyStateMessage}</span>
            )}

            <InfiniteScroll
              hasNextPage={hasNextPage}
              isLoading={isFetchingNextPage}
              getNextPage={fetchNextPage}
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
