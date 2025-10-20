import { BrowserRouter, Route, Routes } from 'react-router';
import { RedirectHome } from './pages/RedirectHome';
import { Home } from './pages/home';
import { SignIn } from './pages/Entrar';
import { Pessoas } from './pages/Pessoas';
import { PessoaForm } from './pages/Pessoas/Form';
import { Atividades } from './pages/Atividades';
import { AtividadesForm } from './pages/Atividades/Form';
import { ExperienciasPessoa } from './pages/ExperienciasPessoa';
import { Aeroportos } from './pages/Aeroportos';
import { AeroportosForm } from './pages/Aeroportos/Form';
import { ExperienciasPessoaForm } from './pages/ExperienciasPessoa/Form';
import { PartidasOrcamentarias } from './pages/PartidasOrcamentarias';
import { PartidasOrcamentariasForm } from './pages/PartidasOrcamentarias/Form';
import { AlterarSenha } from './pages/AlterarSenha';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { RedefinirSenha } from './pages/RedefinirSenha';
import { BoletimMedicao } from './pages/BoletimMedicao/Resumos';
import { BoletimMedicaoDetalhes } from './pages/BoletimMedicao/Detalhes';
import { BoletimMedicaoResumoForm } from './pages/BoletimMedicao/Resumos/Form';
import { BoletimMedicaoDetalhesForm } from './pages/BoletimMedicao/Detalhes/Form';

export function ApplicationRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RedirectHome />} />
        <Route path="/siscontrol">
          <Route index element={<Home />} />
          <Route path="entrar" element={<SignIn />} />
          <Route path="alterar-senha" element={<AlterarSenha />} />
          <Route path="redefinir-senha">
            <Route path=":token" element={<RedefinirSenha />} />
            <Route index element={<RecuperarSenha />} />
          </Route>
          <Route path="pessoas">
            <Route index element={<Pessoas />} />
            <Route path="criar" element={<PessoaForm />} />
            <Route path="atualizar/:pessoaId" element={<PessoaForm />} />
          </Route>
          <Route path="atividades">
            <Route index element={<Atividades />} />
            <Route path="criar" element={<AtividadesForm />} />
            <Route path="atualizar/:atividadeId" element={<AtividadesForm />} />
            <Route
              path="visualizar/:atividadeId"
              element={<AtividadesForm />}
            />
          </Route>
          <Route path="experiencias-pessoa">
            <Route index element={<ExperienciasPessoa />} />
            <Route path="criar" element={<ExperienciasPessoaForm />} />
            <Route
              path="atualizar/:experienciaPessoaId"
              element={<ExperienciasPessoaForm />}
            />
          </Route>
          <Route path="aeroportos">
            <Route index element={<Aeroportos />} />
            <Route path="criar" element={<AeroportosForm />} />
            <Route path="atualizar/:aeroportoId" element={<AeroportosForm />} />
          </Route>
          <Route path="partidas-orcamentarias">
            <Route index element={<PartidasOrcamentarias />} />
            <Route path="criar" element={<PartidasOrcamentariasForm />} />
            <Route
              path="atualizar/:partidaOrcamentariaId"
              element={<PartidasOrcamentariasForm />}
            />
          </Route>
          <Route path="boletim-medicao">
            <Route index element={<BoletimMedicao />} />
            <Route path=":idBm" element={<BoletimMedicaoDetalhes />} />
            <Route
              path=":idBm/editar/:idDetalhe"
              element={<BoletimMedicaoDetalhesForm />}
            />
            <Route path="criar" element={<BoletimMedicaoResumoForm />} />
            <Route
              path="atualizar/:id"
              element={<BoletimMedicaoResumoForm />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
