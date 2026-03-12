using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de categorias.
/// Expõe os endpoints de criação, consulta por Id e listagem.
/// Categorias não são editáveis nem deletáveis pelo design do sistema,
/// pois servem como referências históricas das transações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoriaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var categorias = await _categoriaService.ListarAsync(cancellationToken);
        return Ok(categorias);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        var categoria = await _categoriaService.ObterPorIdAsync(id, cancellationToken);
        return categoria is null ? NotFound() : Ok(categoria);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarCategoriaDto dto, CancellationToken cancellationToken)
    {
        var categoria = await _categoriaService.CriarAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(ObterPorId), new { id = categoria.Id }, categoria);
    }
}
