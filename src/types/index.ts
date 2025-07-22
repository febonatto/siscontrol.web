export type DateISO = string;

export interface JWTToken {
  exp: number;
  pessoa: {
    id: number;
    nome: string;
    email: string;
    nivelPermissao: number;
  };
}

export interface PaginatedQuery<T> {
  data: T[];
  total: number;
  cursor?: number;
}

export interface GetPaginatedQueryParams {
  perPage: number;
  cursor?: number;
}

export interface InfiniteQuery<T> {
  pages: T[];
  pageParams: (number | undefined)[];
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  TBD = 'TBD',
}

export enum EstadoCivil {
  SOLTEIRO = 'SOLTEIRO',
  CASADO = 'CASADO',
  VIUVO = 'VIUVO',
  DIVORCIADO = 'DIVORCIADO',
  SEPARADO = 'SEPARADO',
  TBD = 'TBD',
}

export enum TipoContratacao {
  CLT = 'CLT',
  PJ = 'PJ',
  NDE = 'NDE',
  NDG = 'NDG',
  NDS = 'NDS',
}

export enum PersonRoles {
  PMO_WITH_BI = 1,
  PMO_WITHOUT_BI = 2,
  TECHNICIANS_WITH_BI = 3,
  TECHNICIANS_WITHOUT_BI = 4,
  BOAB_WITH_BI = 5,
  BOAB_WITHOUT_BI = 6,
}

export interface Pessoa {
  id: number;
  nomeCompleto: string;
  nomeReduzido: string | null;
  matricula: string | null;
  numeroCnh: string | null;
  dataNascimento: DateISO | null;
  genero: Genero | null;
  estadoCivil: EstadoCivil | null;
  emailPessoal: string | null;
  emailCorporativo: string | null;
  telefonePessoal: string | null;
  telefoneCorporativo: string | null;
  pais: string | null;
  estado: string | null;
  cidade: string | null;
  codigoPostal: string | null;
  endereco: string | null;
  formacao: string | null;
  resumoCurricular: string | null;
  tempoExperiencia: number | null;
  tamanhoSapato: number | null;
  tamanhoCamisa: string | null;
  funcao: string | null;
  regimeContratacao: TipoContratacao;
  remuneracao: number | null;
  remuneracaoPactuada: number | null;
  cnpj: string | null;
  nomeEmpresa: string | null;
  dataContratacao: DateISO | null;
  dataEncerramento: DateISO | null;
  nivelPermissao: number;
  status: boolean;
  idColete: string | null;
  nomeCoordenador: string | null;
  frenteMedicao: string | null;
  pis: string | null;
  rg: string | null;
  categoriaCnh: string | null;
  dataVencimentoCnh: DateISO | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface AtividadePessoa {
  id: number;
  pessoaId: number;
  dataReferencia: DateISO;
  atividade: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ExperienciaPessoa {
  id: number;
  pessoaId: number;
  nomeEmpresa: string;
  ocupacao: string;
  responsabilidades: string;
  dataEntrada: DateISO;
  dataSaida: DateISO;
  tempoCargo: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Aeroporto {
  id: number;
  sigla: string;
  nome: string;
  lote: number;
  cnpj: string | null;
  estado: string | null;
  cidade: string | null;
  endereco: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface PessoaPartida {
  id: number;
  dataMobilizacaoReal: DateISO | null;
  dataDesmobilizacaoReal: DateISO | null;
  pessoa: Pick<Pessoa, 'id' | 'matricula' | 'nomeCompleto'>;
}

export interface PartidaOrcamentaria {
  id: number;
  codigo: string;
  servico: string;
  tempoExperienciaRequisitado: number;
  dataMobilizacaoPrevista: DateISO;
  dataDesmobilizacaoPrevista: DateISO;
  quantidadePessoas: number;
  quantidadeMeses: number;
  precoUnitario: number;
  montanteContratual: number;
  multaAtraso: number;
  multaBaixaExperiencia: number;
  criadoEm: Date;
  atualizadoEm: Date;

  aeroporto: Aeroporto;
  pessoaPartida: PessoaPartida[];
  currentMobilizedPessoa: PessoaPartida | null;

  pessoa: Pessoa;
}
