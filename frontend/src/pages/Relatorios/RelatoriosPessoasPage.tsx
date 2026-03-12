import { useState, useEffect } from 'react'
import { getRelatorioPessoas } from '../../services/api'
import type { RelatorioPessoas } from '../../types'

/** Formata um valor decimal como moeda brasileira (R$). */
const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

/**
 * Pagina de relatorio por pessoa.
 * Exibe receitas, despesas e saldo de cada pessoa cadastrada,
 * seguido de um rodape com o total geral consolidado.
 * Cards de resumo destacam os valores totais ao final.
 */
export default function RelatoriosPessoasPage() {
  const [relatorio, setRelatorio] = useState<RelatorioPessoas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRelatorioPessoas()
      .then(setRelatorio)
      .catch(() => setError('Erro ao carregar relatorio. Verifique se a API esta em execucao.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400 text-center py-12">Carregando...</p>
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>
  if (!relatorio) return null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Relatorio por Pessoa</h1>

      {/* ── Tabela de totais ── */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Pessoa</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-green-600">Receitas</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-red-600">Despesas</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {relatorio.pessoas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            ) : (
              relatorio.pessoas.map((p) => (
                <tr key={p.pessoaId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{p.nome}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-mono">
                    {formatBRL(p.totalReceitas)}
                  </td>
                  <td className="px-6 py-4 text-right text-red-600 font-mono">
                    {formatBRL(p.totalDespesas)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-mono font-semibold ${
                      p.saldo >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {formatBRL(p.saldo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Rodapé com total geral de todas as pessoas */}
          <tfoot className="border-t-2 border-indigo-200 bg-indigo-50">
            <tr>
              <td className="px-6 py-4 font-bold text-indigo-900">Total Geral</td>
              <td className="px-6 py-4 text-right font-bold text-green-700 font-mono">
                {formatBRL(relatorio.totalGeralReceitas)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-red-700 font-mono">
                {formatBRL(relatorio.totalGeralDespesas)}
              </td>
              <td
                className={`px-6 py-4 text-right font-bold font-mono ${
                  relatorio.saldoLiquido >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formatBRL(relatorio.saldoLiquido)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Cards de resumo ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-700">
            {formatBRL(relatorio.totalGeralReceitas)}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <p className="text-sm text-red-600 font-medium mb-1">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-700">
            {formatBRL(relatorio.totalGeralDespesas)}
          </p>
        </div>
        <div
          className={`rounded-xl p-5 border ${
            relatorio.saldoLiquido >= 0
              ? 'bg-indigo-50 border-indigo-200'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <p
            className={`text-sm font-medium mb-1 ${
              relatorio.saldoLiquido >= 0 ? 'text-indigo-600' : 'text-orange-600'
            }`}
          >
            Saldo Liquido
          </p>
          <p
            className={`text-2xl font-bold ${
              relatorio.saldoLiquido >= 0 ? 'text-indigo-700' : 'text-orange-700'
            }`}
          >
            {formatBRL(relatorio.saldoLiquido)}
          </p>
        </div>
      </div>
    </div>
  )
}
