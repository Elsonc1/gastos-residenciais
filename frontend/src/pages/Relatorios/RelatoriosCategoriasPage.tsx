import { getRelatorioCategorias } from '../../services/api'
import { useFetch } from '../../hooks/useFetch'
import RelatorioTable from '../../components/Common/RelatorioTable'
import type { RelatorioCategorias } from '../../types'

/**
 * Página de relatório por categoria.
 * Delega toda a renderização para o componente compartilhado RelatorioTable,
 * eliminando a duplicação que existia com RelatoriosPessoasPage.
 */
export default function RelatoriosCategoriasPage() {
  const { data: relatorio, loading, error } = useFetch<RelatorioCategorias>(getRelatorioCategorias)

  if (loading) return <p className="text-gray-400 text-center py-12" role="status">Carregando...</p>
  if (error) return <p className="text-red-500 text-center py-8" role="alert">{error}</p>
  if (!relatorio) return null

  const rows = relatorio.categorias.map((c) => ({
    id: c.categoriaId,
    label: c.descricao,
    totalReceitas: c.totalReceitas,
    totalDespesas: c.totalDespesas,
    saldo: c.saldo,
  }))

  return (
    <RelatorioTable
      titulo="Relatório por Categoria"
      caption="Totais de receitas, despesas e saldo agrupados por categoria"
      rows={rows}
      totalGeralReceitas={relatorio.totalGeralReceitas}
      totalGeralDespesas={relatorio.totalGeralDespesas}
      saldoLiquido={relatorio.saldoLiquido}
      emptyMessage="Nenhuma categoria cadastrada."
    />
  )
}
