/**
 * Tipos TypeScript que espelham os modelos e enums do backend C#.
 * Os valores dos enums são strings para corresponder à serialização JSON
 * configurada na API (JsonStringEnumConverter).
 */

/** Finalidade de uma categoria: restringe os tipos de transação que podem usá-la. */
export enum FinalidadeCategoria {
  Despesa = 'Despesa',
  Receita = 'Receita',
  Ambas = 'Ambas',
}

/** Tipo de uma transação financeira. */
export enum TipoTransacao {
  Despesa = 'Despesa',
  Receita = 'Receita',
}

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  categoriaDescricao: string;
  pessoaId: string;
  pessoaNome: string;
}

/** Totais financeiros de uma pessoa no relatório. */
export interface TotalPorPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

/** Relatório completo por pessoa com total geral consolidado. */
export interface RelatorioPessoas {
  pessoas: TotalPorPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

/** Totais financeiros de uma categoria no relatório. */
export interface TotalPorCategoria {
  categoriaId: string;
  descricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

/** Relatório completo por categoria com total geral consolidado. */
export interface RelatorioCategorias {
  categorias: TotalPorCategoria[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}
