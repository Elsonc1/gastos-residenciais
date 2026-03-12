namespace GastosResidenciais.API.DTOs;

/// <summary>
/// Totais financeiros de uma pessoa: soma de receitas, despesas e saldo líquido.
/// </summary>
public record TotalPorPessoaDto(
    Guid PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

/// <summary>
/// Relatório consolidado por pessoa.
/// Inclui o detalhamento individual e o total geral de todas as pessoas.
/// </summary>
public record RelatorioPessoasDto(
    IEnumerable<TotalPorPessoaDto> Pessoas,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquido
);

/// <summary>
/// Totais financeiros de uma categoria: soma de receitas, despesas e saldo líquido.
/// </summary>
public record TotalPorCategoriaDto(
    Guid CategoriaId,
    string Descricao,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

/// <summary>
/// Relatório consolidado por categoria.
/// Inclui o detalhamento individual e o total geral de todas as categorias.
/// </summary>
public record RelatorioCategoriasDto(
    IEnumerable<TotalPorCategoriaDto> Categorias,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquido
);
