import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LockIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserRoundIcon,
  UserRoundPenIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from './ui/button';
import { PersonRoles } from '@/types';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth, signOut } = useAuth();

  const nivelPermissao = auth?.pessoa?.nivelPermissao;

  const nome = auth?.pessoa.nome;
  const email = auth?.pessoa.email;

  const showColaboradoresOrPartidasOrcamentariasOrBoletimMedicao =
    nivelPermissao === PersonRoles.PMO_WITH_BI ||
    nivelPermissao === PersonRoles.PMO_WITHOUT_BI ||
    nivelPermissao === PersonRoles.BOAB_WITH_BI ||
    nivelPermissao === PersonRoles.BOAB_WITHOUT_BI;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-20">
        <div className="mt-2 h-full w-full overflow-hidden pl-2">
          <img src="/logo.svg" className="h-full object-contain" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {showColaboradoresOrPartidasOrcamentariasOrBoletimMedicao && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/siscontrol/pessoas">
                    Cadastro de Colaboradores
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/siscontrol/experiencias-pessoa">
                  Cadastro de Currículos
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/siscontrol/atividades">Controle de Atividades</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/siscontrol/aeroportos">Cadastro de Aeroportos</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {showColaboradoresOrPartidasOrcamentariasOrBoletimMedicao && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/siscontrol/partidas-orcamentarias">
                    Partidas Orçamentárias
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {showColaboradoresOrPartidasOrcamentariasOrBoletimMedicao && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/siscontrol/boletim-medicao">
                    Boletim de Medição
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {nivelPermissao === PersonRoles.PMO_WITH_BI && (
              <SidebarMenuItem>
                <SidebarMenuButton>Relatórios</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <Link
                        className="w-full"
                        to="https://app.powerbi.com/groups/c2fe2197-62cf-4349-bb38-7ddbd958cdd0/reports/27a589ba-d7f3-4499-b7ec-ed7544611fd4/3b05a611aee98be10019?experience=power-bi"
                        target="_blank"
                      >
                        Relatório BI
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="focus-visible:ring-0">
                  <div>
                    <UserRoundIcon />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{nome}</span>

                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>

                  <MoreVerticalIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div>
                      <UserRoundIcon />
                    </div>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{nome}</span>

                      <span className="text-muted-foreground truncate text-xs">
                        {email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <Link to={`/siscontrol/pessoas/atualizar/${auth?.pessoa.id}`}>
                  <DropdownMenuItem>
                    <UserRoundPenIcon />
                    Meu perfil
                  </DropdownMenuItem>
                </Link>

                <Link to="/siscontrol/alterar-senha">
                  <DropdownMenuItem>
                    <LockIcon />
                    Alterar senha
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Button
                    variant="custom"
                    className="h-fit w-full cursor-auto justify-start p-0 font-normal"
                    onClick={signOut}
                  >
                    <LogOutIcon />
                    Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
