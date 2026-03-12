import type { ReactNode } from 'react'
import { formatBRL } from '../../utils/format'

interface RelatorioRow {
  id: string
  label: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

interface RelatorioTableProps {
  titulo: string
  caption: string
  rows: RelatorioRow[]
  totalGeralReceitas: number
  totalGeralDespesas: number
  saldoLiquido: number
  emptyMessage?: string
  children?: ReactNode
}

/**
 * Tabela de relatório reutilizável para exibir totais por entidade (pessoa ou categoria).
 * Elimina a duplicação que existia entre RelatoriosPessoasPage e RelatoriosCategoriasPage.
 *
 * Acessibilidade:
 *   - <caption> para descrever a tabela.
 *   - scope="col"/"row" nos cabeçalhos.
 *   - role="status" nos cards de resumo.
 */
export default function RelatorioTable({
  titulo,
  caption,
  rows,
  totalGeralReceitas,
  totalGeralDespesas,
  saldoLiquido,
  emptyMessage = 'Nenhum registro encontrado.',
}: RelatorioTableProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{titulo}</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <table className="w-full">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Nome
              </th>
              <th scope="col" className="text-right px-6 py-3 text-sm font-semibold text-green-600">
                Receitas
              </th>
              <th scope="col" className="text-right px-6 py-3 text-sm font-semibold text-red-600">
                Despesas
              </th>
              <th scope="col" className="text-right px-6 py-3 text-sm font-semibold text-gray-600">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-6 py-4 font-medium text-left">
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-right text-green-600 font-mono">
                    {formatBRL(row.totalReceitas)}
                  </td>
                  <td className="px-6 py-4 text-right text-red-600 font-mono">
                    {formatBRL(row.totalDespesas)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-mono font-semibold ${
                      row.saldo >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {formatBRL(row.saldo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="border-t-2 border-indigo-200 bg-indigo-50">
            <tr>
              <th scope="row" className="px-6 py-4 font-bold text-indigo-900 text-left">
                Total Geral
              </th>
              <td className="px-6 py-4 text-right font-bold text-green-700 font-mono">
                {formatBRL(totalGeralReceitas)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-red-700 font-mono">
                {formatBRL(totalGeralDespesas)}
              </td>
              <td
                className={`px-6 py-4 text-right font-bold font-mono ${
                  saldoLiquido >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formatBRL(saldoLiquido)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cards de resumo com role="status" para acessibilidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="status" aria-label="Resumo financeiro">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-700">{formatBRL(totalGeralReceitas)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <p className="text-sm text-red-600 font-medium mb-1">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-700">{formatBRL(totalGeralDespesas)}</p>
        </div>
        <div
          className={`rounded-xl p-5 border ${
            saldoLiquido >= 0
              ? 'bg-indigo-50 border-indigo-200'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <p
            className={`text-sm font-medium mb-1 ${
              saldoLiquido >= 0 ? 'text-indigo-600' : 'text-orange-600'
            }`}
          >
            Saldo Líquido
          </p>
          <p
            className={`text-2xl font-bold ${
              saldoLiquido >= 0 ? 'text-indigo-700' : 'text-orange-700'
            }`}
          >
            {formatBRL(saldoLiquido)}
          </p>
        </div>
      </div>
    </div>
  )
}
