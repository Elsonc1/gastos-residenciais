import { useState, useEffect } from 'react'
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from '../../services/api'
import type { Pessoa } from '../../types'

/**
 * Página de gerenciamento de pessoas.
 * Funcionalidades: criação, edição inline, deleção e listagem.
 * Exibe aviso visual para pessoas menores de 18 anos (restrição de receitas).
 * Ao deletar, exibe confirmação antes de prosseguir (todas as transações são removidas).
 */
export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado do formulário de criação/edição
  const [editando, setEditando] = useState<Pessoa | null>(null)
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const carregarPessoas = async () => {
    try {
      setLoading(true)
      const data = await getPessoas()
      setPessoas(data)
    } catch {
      setError('Erro ao carregar pessoas. Verifique se a API está em execução.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPessoas()
  }, [])

  /** Popula o formulário com os dados da pessoa para edição. */
  const iniciarEdicao = (pessoa: Pessoa) => {
    setEditando(pessoa)
    setNome(pessoa.nome)
    setIdade(String(pessoa.idade))
    setFormError(null)
  }

  /** Limpa o formulário e cancela a edição. */
  const cancelarEdicao = () => {
    setEditando(null)
    setNome('')
    setIdade('')
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || idade === '') return

    setSubmitting(true)
    setFormError(null)

    try {
      if (editando) {
        await updatePessoa(editando.id, { nome: nome.trim(), idade: Number(idade) })
      } else {
        await createPessoa({ nome: nome.trim(), idade: Number(idade) })
      }
      cancelarEdicao()
      await carregarPessoas()
    } catch {
      setFormError('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (pessoa: Pessoa) => {
    if (!confirm(`Deletar "${pessoa.nome}"?\n\nAtenção: todas as transações desta pessoa também serão removidas.`)) return

    try {
      await deletePessoa(pessoa.id)
      await carregarPessoas()
    } catch {
      setError('Erro ao deletar pessoa.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Pessoas</h1>

      {/* ── Formulário de criação / edição ── */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editando ? `Editando: ${editando.nome}` : 'Nova Pessoa'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-gray-400 font-normal">(máx. 200 caracteres)</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={200}
              required
              placeholder="Nome completo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              min={0}
              max={150}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
            >
              {submitting ? 'Salvando...' : editando ? 'Atualizar' : 'Adicionar'}
            </button>
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        {formError && <p className="text-red-500 mt-3 text-sm">{formError}</p>}
      </div>

      {/* ── Lista de pessoas ── */}
      {loading ? (
        <p className="text-gray-400 text-center py-12">Carregando...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : pessoas.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma pessoa cadastrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Nome</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Idade</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pessoas.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium">{p.nome}</span>
                    {p.idade < 18 && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        Menor de idade
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.idade} anos</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Deletar
                    </button>
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
