using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de relatórios financeiros.
/// Fornece consultas agregadas de receitas, despesas e saldo
/// agrupadas por pessoa e por categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RelatoriosController : ControllerBase
{
    private readonly IRelatorioService _relatorioService;

    public RelatoriosController(IRelatorioService relatorioService)
    {
        _relatorioService = relatorioService;
    }

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo para cada pessoa cadastrada,
    /// além do consolidado geral de todas as pessoas.
    /// </summary>
    [HttpGet("pessoas")]
    public async Task<IActionResult> TotaisPorPessoa()
    {
        var relatorio = await _relatorioService.ObterTotaisPorPessoaAsync();
        return Ok(relatorio);
    }

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo para cada categoria cadastrada,
    /// além do consolidado geral de todas as categorias.
    /// </summary>
    [HttpGet("categorias")]
    public async Task<IActionResult> TotaisPorCategoria()
    {
        var relatorio = await _relatorioService.ObterTotaisPorCategoriaAsync();
        return Ok(relatorio);
    }
}
