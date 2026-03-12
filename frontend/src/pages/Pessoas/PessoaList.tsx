import type { Pessoa } from '../../types'

interface PessoaListProps {
  pessoas: Pessoa[]
  onEdit: (pessoa: Pessoa) => void
  onDelete: (pessoa: Pessoa) => void
}

/**
 * Tabela de pessoas cadastradas com ações de editar e deletar.
 * Separada do formulário para responsabilidade única e facilitação de testes.
 *
 * Acessibilidade:
 *   - scope="col"/"row" nos cabeçalhos.
 *   - aria-label nos botões de ação.
 *   - <caption> descritiva.
 */
export default function PessoaList({ pessoas, onEdit, onDelete }: PessoaListProps) {
  if (pessoas.length === 0) {
    return <p className="text-gray-400 text-center py-12">Nenhuma pessoa cadastrada.</p>
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <caption className="sr-only">Lista de pessoas cadastradas</caption>
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Nome</th>
            <th scope="col" className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Idade</th>
            <th scope="col" className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pessoas.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <th scope="row" className="px-6 py-4 text-left font-medium">
                {p.nome}
                {p.idade < 18 && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    Menor de idade
                  </span>
                )}
              </th>
              <td className="px-6 py-4 text-gray-600">{p.idade} anos</td>
              <td className="px-6 py-4 text-right space-x-3">
                <button
                  onClick={() => onEdit(p)}
                  aria-label={`Editar ${p.nome}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p)}
                  aria-label={`Deletar ${p.nome}`}
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
  )
}
