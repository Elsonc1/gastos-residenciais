import { useState, useEffect, useId } from 'react'
import type { Pessoa } from '../../types'

interface PessoaFormProps {
  editando: Pessoa | null
  submitting: boolean
  formError: string | null
  onSubmit: (nome: string, idade: number) => Promise<void>
  onCancel: () => void
}

/**
 * Formulário de criação e edição de pessoa.
 * Usa useId() para gerar IDs únicos que associam <label> a <input> via htmlFor,
 * garantindo acessibilidade correta para leitores de tela.
 */
export default function PessoaForm({ editando, submitting, formError, onSubmit, onCancel }: PessoaFormProps) {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const formId = useId()

  useEffect(() => {
    if (editando) {
      setNome(editando.nome)
      setIdade(String(editando.idade))
    } else {
      setNome('')
      setIdade('')
    }
  }, [editando])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || idade === '') return
    await onSubmit(nome.trim(), Number(idade))
    if (!editando) {
      setNome('')
      setIdade('')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        {editando ? `Editando: ${editando.nome}` : 'Nova Pessoa'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor={`${formId}-nome`} className="block text-sm font-medium text-gray-700 mb-1">
            Nome <span className="text-gray-400 font-normal">(máx. 200 caracteres)</span>
          </label>
          <input
            id={`${formId}-nome`}
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
          <label htmlFor={`${formId}-idade`} className="block text-sm font-medium text-gray-700 mb-1">
            Idade
          </label>
          <input
            id={`${formId}-idade`}
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
            aria-busy={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {submitting ? 'Salvando...' : editando ? 'Atualizar' : 'Adicionar'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {formError && (
        <p className="text-red-500 mt-3 text-sm" role="alert">{formError}</p>
      )}
    </div>
  )
}
