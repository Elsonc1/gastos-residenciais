using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de categorias.
/// Expõe os endpoints de criação e listagem.
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

    /// <summary>Lista todas as categorias cadastradas.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var categorias = await _categoriaService.ListarAsync();
        return Ok(categorias);
    }

    /// <summary>
    /// Cria uma nova categoria com sua finalidade (Despesa, Receita ou Ambas).
    /// O Id é gerado automaticamente.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCategoriaDto dto)
    {
        var categoria = await _categoriaService.CriarAsync(dto);
        return CreatedAtAction(nameof(Listar), new { id = categoria.Id }, categoria);
    }
}
