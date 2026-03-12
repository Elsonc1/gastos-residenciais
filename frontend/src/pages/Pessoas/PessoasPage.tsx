import { useState, useCallback } from 'react'
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from '../../services/api'
import { useFetch } from '../../hooks/useFetch'
import type { Pessoa } from '../../types'
import PessoaForm from './PessoaForm'
import PessoaList from './PessoaList'

/**
 * Página de gerenciamento de pessoas.
 * Coordena o fluxo entre formulário e lista, delegando renderização
 * para componentes menores (PessoaForm e PessoaList).
 */
export default function PessoasPage() {
  const { data: pessoas, loading, error, refetch } = useFetch<Pessoa[]>(getPessoas)
  const [editando, setEditando] = useState<Pessoa | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async (nome: string, idade: number) => {
    setSubmitting(true)
    setFormError(null)
    try {
      if (editando) {
        await updatePessoa(editando.id, { nome, idade })
      } else {
        await createPessoa({ nome, idade })
      }
      setEditando(null)
      await refetch()
    } catch {
      setFormError('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }, [editando, refetch])

  const handleDelete = useCallback(async (pessoa: Pessoa) => {
    if (!confirm(`Deletar "${pessoa.nome}"?\n\nAtenção: todas as transações desta pessoa também serão removidas.`)) return
    try {
      await deletePessoa(pessoa.id)
      await refetch()
    } catch {
      setFormError('Erro ao deletar pessoa.')
    }
  }, [refetch])

  const handleCancelEdit = useCallback(() => {
    setEditando(null)
    setFormError(null)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Pessoas</h1>

      <PessoaForm
        editando={editando}
        submitting={submitting}
        formError={formError}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />

      {loading ? (
        <p className="text-gray-400 text-center py-12" role="status">Carregando...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8" role="alert">{error}</p>
      ) : (
        <PessoaList
          pessoas={pessoas ?? []}
          onEdit={setEditando}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
