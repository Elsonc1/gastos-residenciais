import { getRelatorioPessoas } from '../../services/api'
import { useFetch } from '../../hooks/useFetch'
import RelatorioTable from '../../components/Common/RelatorioTable'
import type { RelatorioPessoas } from '../../types'

/**
 * Página de relatório por pessoa.
 * Delega toda a renderização para o componente compartilhado RelatorioTable,
 * eliminando a duplicação que existia com RelatoriosCategoriasPage.
 */
export default function RelatoriosPessoasPage() {
  const { data: relatorio, loading, error } = useFetch<RelatorioPessoas>(getRelatorioPessoas)

  if (loading) return <p className="text-gray-400 text-center py-12" role="status">Carregando...</p>
  if (error) return <p className="text-red-500 text-center py-8" role="alert">{error}</p>
  if (!relatorio) return null

  const rows = relatorio.pessoas.map((p) => ({
    id: p.pessoaId,
    label: p.nome,
    totalReceitas: p.totalReceitas,
    totalDespesas: p.totalDespesas,
    saldo: p.saldo,
  }))

  return (
    <RelatorioTable
      titulo="Relatório por Pessoa"
      caption="Totais de receitas, despesas e saldo agrupados por pessoa"
      rows={rows}
      totalGeralReceitas={relatorio.totalGeralReceitas}
      totalGeralDespesas={relatorio.totalGeralDespesas}
      saldoLiquido={relatorio.saldoLiquido}
      emptyMessage="Nenhuma pessoa cadastrada."
    />
  )
}
