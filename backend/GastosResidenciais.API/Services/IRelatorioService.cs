using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de relatórios financeiros.
/// Fornece totais agrupados por pessoa e por categoria.
/// </summary>
public interface IRelatorioService
{
    /// <summary>
    /// Retorna receitas, despesas e saldo de cada pessoa cadastrada,
    /// além do total geral consolidado.
    /// </summary>
    Task<RelatorioPessoasDto> ObterTotaisPorPessoaAsync();

    /// <summary>
    /// Retorna receitas, despesas e saldo de cada categoria cadastrada,
    /// além do total geral consolidado.
    /// </summary>
    Task<RelatorioCategoriasDto> ObterTotaisPorCategoriaAsync();
}
