using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de relatórios financeiros.
/// Fornece totais agrupados por pessoa e por categoria,
/// com agregação realizada no banco de dados para melhor performance.
/// </summary>
public interface IRelatorioService
{
    Task<RelatorioPessoasDto> ObterTotaisPorPessoaAsync(CancellationToken cancellationToken = default);
    Task<RelatorioCategoriasDto> ObterTotaisPorCategoriaAsync(CancellationToken cancellationToken = default);
}
