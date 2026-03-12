import axios from 'axios';
import type {
  Pessoa,
  Categoria,
  Transacao,
  RelatorioPessoas,
  RelatorioCategorias,
  FinalidadeCategoria,
  TipoTransacao,
} from '../types';

/**
 * Instância do Axios configurada com a URL base da API .NET.
 * Altere a baseURL se a API estiver em outra porta ou host.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Pessoas ───────────────────────────────────────────────────────────────────

export const getPessoas = (): Promise<Pessoa[]> =>
  api.get<Pessoa[]>('/pessoas').then((r) => r.data);

export const getPessoa = (id: string): Promise<Pessoa> =>
  api.get<Pessoa>(`/pessoas/${id}`).then((r) => r.data);

export const createPessoa = (data: { nome: string; idade: number }): Promise<Pessoa> =>
  api.post<Pessoa>('/pessoas', data).then((r) => r.data);

export const updatePessoa = (
  id: string,
  data: { nome: string; idade: number }
): Promise<Pessoa> => api.put<Pessoa>(`/pessoas/${id}`, data).then((r) => r.data);

export const deletePessoa = (id: string): Promise<void> =>
  api.delete(`/pessoas/${id}`).then(() => undefined);

// ── Categorias ────────────────────────────────────────────────────────────────

export const getCategorias = (): Promise<Categoria[]> =>
  api.get<Categoria[]>('/categorias').then((r) => r.data);

export const createCategoria = (data: {
  descricao: string;
  finalidade: FinalidadeCategoria;
}): Promise<Categoria> => api.post<Categoria>('/categorias', data).then((r) => r.data);

// ── Transações ────────────────────────────────────────────────────────────────

export const getTransacoes = (): Promise<Transacao[]> =>
  api.get<Transacao[]>('/transacoes').then((r) => r.data);

export const createTransacao = (data: {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
}): Promise<Transacao> => api.post<Transacao>('/transacoes', data).then((r) => r.data);

// ── Relatórios ────────────────────────────────────────────────────────────────

export const getRelatorioPessoas = (): Promise<RelatorioPessoas> =>
  api.get<RelatorioPessoas>('/relatorios/pessoas').then((r) => r.data);

export const getRelatorioCategorias = (): Promise<RelatorioCategorias> =>
  api.get<RelatorioCategorias>('/relatorios/categorias').then((r) => r.data);
