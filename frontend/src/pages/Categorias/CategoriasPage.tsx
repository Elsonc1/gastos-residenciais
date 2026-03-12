import { useState, useCallback, useId } from 'react'
import { getCategorias, createCategoria } from '../../services/api'
import { useFetch } from '../../hooks/useFetch'
import type { Categoria } from '../../types'
import { FinalidadeCategoria } from '../../types'

/** Rótulos legíveis para a finalidade da categoria. */
const finalidadeLabels: Record<FinalidadeCategoria, string> = {
  [FinalidadeCategoria.Despesa]: 'Despesa',
  [FinalidadeCategoria.Receita]: 'Receita',
  [FinalidadeCategoria.Ambas]: 'Ambas',
}

/** Classes CSS para colorir o badge de finalidade. */
const finalidadeBadge: Record<FinalidadeCategoria, string> = {
  [FinalidadeCategoria.Despesa]: 'bg-red-100 text-red-700',
  [FinalidadeCategoria.Receita]: 'bg-green-100 text-green-700',
  [FinalidadeCategoria.Ambas]: 'bg-blue-100 text-blue-700',
}

/**
 * Página de gerenciamento de categorias.
 * Usa useFetch para gerenciar o ciclo de carregamento.
 * Labels corretamente associadas a inputs via htmlFor/id.
 */
export default function CategoriasPage() {
  const { data: categorias, loading, error, refetch } = useFetch<Categoria[]>(getCategorias)
  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Despesa)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const formId = useId()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim()) return

    setSubmitting(true)
    setFormError(null)

    try {
      await createCategoria({ descricao: descricao.trim(), finalidade })
      setDescricao('')
      setFinalidade(FinalidadeCategoria.Despesa)
      await refetch()
    } catch {
      setFormError('Erro ao criar categoria.')
    } finally {
      setSubmitting(false)
    }
  }, [descricao, finalidade, refetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Categorias</h1>

      {/* Formulário de criação */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Nova Categoria</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
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
              placeholder="Ex.: Alimentação, Salário, Transporte..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="w-44">
            <label htmlFor={`${formId}-finalidade`} className="block text-sm font-medium text-gray-700 mb-1">
              Finalidade
            </label>
            <select
              id={`${formId}-finalidade`}
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value as FinalidadeCategoria)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Object.values(FinalidadeCategoria).map((f) => (
                <option key={f} value={f}>{finalidadeLabels[f]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {submitting ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
        {formError && <p className="text-red-500 mt-3 text-sm" role="alert">{formError}</p>}
      </div>

      {/* Lista de categorias */}
      {loading ? (
        <p className="text-gray-400 text-center py-12" role="status">Carregando...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8" role="alert">{error}</p>
      ) : !categorias || categorias.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <caption className="sr-only">Lista de categorias cadastradas</caption>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Descrição</th>
                <th scope="col" className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Finalidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-6 py-4 text-left font-medium">{c.descricao}</th>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${finalidadeBadge[c.finalidade]}`}>
                      {finalidadeLabels[c.finalidade]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
