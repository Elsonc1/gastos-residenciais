using GastosResidenciais.API.DTOs;
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

    [HttpGet("pessoas")]
    [ProducesResponseType(typeof(RelatorioPessoasDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> TotaisPorPessoa(CancellationToken cancellationToken)
    {
        var relatorio = await _relatorioService.ObterTotaisPorPessoaAsync(cancellationToken);
        return Ok(relatorio);
    }

    [HttpGet("categorias")]
    [ProducesResponseType(typeof(RelatorioCategoriasDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> TotaisPorCategoria(CancellationToken cancellationToken)
    {
        var relatorio = await _relatorioService.ObterTotaisPorCategoriaAsync(cancellationToken);
        return Ok(relatorio);
    }
}
