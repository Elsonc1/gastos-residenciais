import { useState, useEffect, useMemo, useCallback, useId } from 'react'
import axios from 'axios'
import { getTransacoes, createTransacao, getPessoas, getCategorias } from '../../services/api'
import type { Transacao, Pessoa, Categoria } from '../../types'
import { TipoTransacao, FinalidadeCategoria } from '../../types'
import { formatBRL } from '../../utils/format'

/** Classes CSS para o badge de tipo de transação. */
const tipoBadge: Record<TipoTransacao, string> = {
  [TipoTransacao.Despesa]: 'bg-red-100 text-red-700',
  [TipoTransacao.Receita]: 'bg-green-100 text-green-700',
}

/**
 * Verifica se uma categoria é compatível com o tipo de transação selecionado.
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
 * Página de gerenciamento de transações.
 *
 * Regras de negócio aplicadas no front (feedback imediato) e revalidadas no back:
 *   1. Menores de 18 anos: tipo "Receita" é desabilitado no select de pessoas.
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
  const formId = useId()

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa)
  const [pessoaId, setPessoaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  const carregar = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoas, pessoaId]
  )

  const isMenorDeIdade = pessoaSelecionada !== null && pessoaSelecionada.idade < 18

  const categoriasCompativeis = useMemo(
    () => categorias.filter((c) => isCategoriaCompativel(c.finalidade, tipo)),
    [categorias, tipo]
  )

  /** Ao mudar o tipo, limpa a categoria se ela não for mais compatível. */
  const handleTipoChange = useCallback((novoTipo: TipoTransacao) => {
    setTipo(novoTipo)
    setCategoriaId('')
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      setDescricao('')
      setValor('')
      setTipo(TipoTransacao.Despesa)
      setPessoaId('')
      setCategoriaId('')
      await carregar()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        setFormError(err.response.data.mensagem)
      } else {
        setFormError('Erro ao registrar transação.')
      }
    } finally {
      setSubmitting(false)
    }
  }, [descricao, valor, tipo, categoriaId, pessoaId, carregar])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Transações</h1>

      {/* Formulário de criação */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Nova Transação</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor={`${formId}-descricao`} className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-gray-400 font-normal">(máx. 400 caracteres)</span>
            </label>
            <input
              id={`${formId}-descricao`}
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              required
              placeholder="Ex.: Compra de supermercado, Salário de março..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-valor`} className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              id={`${formId}-valor`}
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

          <div>
            <label htmlFor={`${formId}-tipo`} className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              id={`${formId}-tipo`}
              value={tipo}
              onChange={(e) => handleTipoChange(e.target.value as TipoTransacao)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={TipoTransacao.Despesa}>Despesa</option>
              <option value={TipoTransacao.Receita}>Receita</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${formId}-pessoa`} className="block text-sm font-medium text-gray-700 mb-1">Pessoa</label>
            <select
              id={`${formId}-pessoa`}
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              required
              aria-describedby={isMenorDeIdade && tipo === TipoTransacao.Receita ? `${formId}-menor-aviso` : undefined}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione...</option>
              {pessoas.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={tipo === TipoTransacao.Receita && p.idade < 18}
                >
                  {p.nome} ({p.idade} anos){p.idade < 18 ? ' — Menor de idade' : ''}
                </option>
              ))}
            </select>
            {isMenorDeIdade && tipo === TipoTransacao.Receita && (
              <p id={`${formId}-menor-aviso`} className="text-yellow-600 text-xs mt-1 font-medium" role="alert">
                Menores de 18 anos não podem registrar receitas.
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${formId}-categoria`} className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              id={`${formId}-categoria`}
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione...</option>
              {categoriasCompativeis.map((c) => (
                <option key={c.id} value={c.id}>{c.descricao} ({c.finalidade})</option>
              ))}
            </select>
            {categoriasCompativeis.length === 0 && (
              <p className="text-gray-400 text-xs mt-1">Nenhuma categoria disponível para este tipo.</p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting || (isMenorDeIdade && tipo === TipoTransacao.Receita)}
              aria-busy={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
            >
              {submitting ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>

        {formError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-red-600 text-sm font-medium">{formError}</p>
          </div>
        )}
      </div>

      {/* Lista de transações */}
      {loading ? (
        <p className="text-gray-400 text-center py-12" role="status">Carregando...</p>
      ) : pageError ? (
        <p className="text-red-500 text-center py-8" role="alert">{pageError}</p>
      ) : transacoes.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma transação registrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Lista de transações registradas</caption>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Descrição</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Categoria</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Pessoa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transacoes.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-4 py-3 text-left font-medium">{t.descricao}</th>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tipoBadge[t.tipo]}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${
                    t.tipo === TipoTransacao.Despesa ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {t.tipo === TipoTransacao.Despesa ? '- ' : '+ '}{formatBRL(t.valor)}
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
