import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { getTransacoes, createTransacao, getPessoas, getCategorias } from '../../services/api'
import type { Transacao, Pessoa, Categoria } from '../../types'
import { TipoTransacao, FinalidadeCategoria } from '../../types'

/** Formata um valor decimal como moeda brasileira. */
const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

/** Classes CSS para o badge de tipo. */
const tipoBadge: Record<TipoTransacao, string> = {
  [TipoTransacao.Despesa]: 'bg-red-100 text-red-700',
  [TipoTransacao.Receita]: 'bg-green-100 text-green-700',
}

/**
 * Verifica se uma categoria é compatível com o tipo de transação selecionado.
 * Regra: categoria.finalidade deve ser igual ao tipo ou "Ambas".
 * Esta lógica espelha a validação do backend para dar feedback imediato ao usuário.
 */
function isCategoriaCompativel(finalidade: FinalidadeCategoria, tipo: TipoTransacao): boolean {
  if (finalidade === FinalidadeCategoria.Ambas) return true
  return (
    (tipo === TipoTransacao.Despesa && finalidade === FinalidadeCategoria.Despesa) ||
    (tipo === TipoTransacao.Receita && finalidade === FinalidadeCategoria.Receita)
  )
}

/**
 * Página de gerenciamento de transacoes.
 * Funcionalidades: criação e listagem.
 *
 * Regras de negocio aplicadas no front (feedback imediato) e validadas novamente no back:
 *   1. Pessoas menores de 18 anos: tipo "Receita" é desabilitado no formulário.
 *   2. Categorias incompatíveis com o tipo selecionado são filtradas do select.
 */
export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Campos do formulário
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa)
  const [pessoaId, setPessoaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  const carregar = async () => {
    try {
      setLoading(true)
      const [t, p, c] = await Promise.all([getTransacoes(), getPessoas(), getCategorias()])
      setTransacoes(t)
      setPessoas(p)
      setCategorias(c)
    } catch {
      setPageError('Erro ao carregar dados. Verifique se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  /** Pessoa atualmente selecionada no formulário. */
  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoas, pessoaId]
  )

  /** Indica se a pessoa selecionada é menor de idade. */
  const isMenorDeIdade = pessoaSelecionada !== null && pessoaSelecionada.idade < 18

  /**
   * Categorias filtradas conforme o tipo de transação selecionado.
   * Impede que o usuário selecione uma categoria incompatível antes mesmo de submeter.
   */
  const categoriasCompativeis = useMemo(
    () => categorias.filter((c) => isCategoriaCompativel(c.finalidade, tipo)),
    [categorias, tipo]
  )

  /** Ao mudar o tipo, limpa a categoria se ela não for mais compatível. */
  const handleTipoChange = (novoTipo: TipoTransacao) => {
    setTipo(novoTipo)
    setCategoriaId('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim() || !valor || !pessoaId || !categoriaId) return

    setSubmitting(true)
    setFormError(null)

    try {
      await createTransacao({
        descricao: descricao.trim(),
        valor: Number(valor),
        tipo,
        categoriaId,
        pessoaId,
      })
      // Limpa o formulário após sucesso
      setDescricao('')
      setValor('')
      setTipo(TipoTransacao.Despesa)
      setPessoaId('')
      setCategoriaId('')
      await carregar()
    } catch (err) {
      // Exibe a mensagem de erro retornada pela API (regra de negócio violada)
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        setFormError(err.response.data.mensagem)
      } else {
        setFormError('Erro ao registrar transacao.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Transacoes</h1>

      {/* ── Formulário de criação ── */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Nova Transacao</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Descricao (ocupa linha inteira em telas grandes) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descricao <span className="text-gray-400 font-normal">(max. 400 caracteres)</span>
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              required
              placeholder="Ex.: Compra de supermercado, Salario de marco..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min={0.01}
              step={0.01}
              required
              placeholder="0,00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => handleTipoChange(e.target.value as TipoTransacao)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={TipoTransacao.Despesa}>Despesa</option>
              <option value={TipoTransacao.Receita}>Receita</option>
            </select>
          </div>

          {/* Pessoa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa</label>
            <select
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione...</option>
              {pessoas.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  // Desabilita menores de idade para o tipo Receita no próprio select
                  disabled={tipo === TipoTransacao.Receita && p.idade < 18}
                >
                  {p.nome} ({p.idade} anos){p.idade < 18 ? ' — Menor de idade' : ''}
                </option>
              ))}
            </select>
            {/* Aviso visual quando menor de idade e tipo Receita */}
            {isMenorDeIdade && tipo === TipoTransacao.Receita && (
              <p className="text-yellow-600 text-xs mt-1 font-medium">
                Menores de 18 anos nao podem registrar receitas.
              </p>
            )}
          </div>

          {/* Categoria (filtrada pelo tipo selecionado) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione...</option>
              {categoriasCompativeis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao} ({c.finalidade})
                </option>
              ))}
            </select>
            {categoriasCompativeis.length === 0 && (
              <p className="text-gray-400 text-xs mt-1">
                Nenhuma categoria disponivel para este tipo.
              </p>
            )}
          </div>

          {/* Botão de submit */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting || (isMenorDeIdade && tipo === TipoTransacao.Receita)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
            >
              {submitting ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>

        {formError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{formError}</p>
          </div>
        )}
      </div>

      {/* ── Lista de transações ── */}
      {loading ? (
        <p className="text-gray-400 text-center py-12">Carregando...</p>
      ) : pageError ? (
        <p className="text-red-500 text-center py-8">{pageError}</p>
      ) : transacoes.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma transacao registrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Descricao</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Pessoa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transacoes.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{t.descricao}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${tipoBadge[t.tipo]}`}
                    >
                      {t.tipo}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-semibold ${
                      t.tipo === TipoTransacao.Despesa ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {t.tipo === TipoTransacao.Despesa ? '- ' : '+ '}
                    {formatBRL(t.valor)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.categoriaDescricao}</td>
                  <td className="px-4 py-3 text-gray-500">{t.pessoaNome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
