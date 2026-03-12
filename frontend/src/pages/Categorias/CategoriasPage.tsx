import { useState, useEffect } from 'react'
import { getCategorias, createCategoria } from '../../services/api'
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
 * Funcionalidades: criação e listagem.
 * A finalidade determina quais tipos de transação podem usar a categoria.
 */
export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Despesa)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const carregarCategorias = async () => {
    try {
      setLoading(true)
      const data = await getCategorias()
      setCategorias(data)
    } catch {
      setError('Erro ao carregar categorias. Verifique se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim()) return

    setSubmitting(true)
    setFormError(null)

    try {
      await createCategoria({ descricao: descricao.trim(), finalidade })
      setDescricao('')
      setFinalidade(FinalidadeCategoria.Despesa)
      await carregarCategorias()
    } catch {
      setFormError('Erro ao criar categoria.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Categorias</h1>

      {/* ── Formulário de criação ── */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Nova Categoria</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descricao <span className="text-gray-400 font-normal">(max. 400 caracteres)</span>
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              required
              placeholder="Ex.: Alimentacao, Salario, Transporte..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="w-44">
            <label className="block text-sm font-medium text-gray-700 mb-1">Finalidade</label>
            <select
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value as FinalidadeCategoria)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Object.values(FinalidadeCategoria).map((f) => (
                <option key={f} value={f}>
                  {finalidadeLabels[f]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {submitting ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
        {formError && <p className="text-red-500 mt-3 text-sm">{formError}</p>}
      </div>

      {/* ── Lista de categorias ── */}
      {loading ? (
        <p className="text-gray-400 text-center py-12">Carregando...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : categorias.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Descricao</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Finalidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{c.descricao}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${finalidadeBadge[c.finalidade]}`}
                    >
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
