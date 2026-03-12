using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de pessoas.
/// Expõe os endpoints REST para o CRUD completo do cadastro de pessoas.
/// Ao deletar uma pessoa, todas as suas transações são removidas automaticamente (cascade).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>Lista todas as pessoas cadastradas.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var pessoas = await _pessoaService.ListarAsync();
        return Ok(pessoas);
    }

    /// <summary>Retorna uma pessoa pelo seu Id único.</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);
        return pessoa is null ? NotFound() : Ok(pessoa);
    }

    /// <summary>Cria uma nova pessoa. O Id é gerado automaticamente.</summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarPessoaDto dto)
    {
        var pessoa = await _pessoaService.CriarAsync(dto);
        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, pessoa);
    }

    /// <summary>Atualiza nome e/ou idade de uma pessoa existente.</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] CriarPessoaDto dto)
    {
        var pessoa = await _pessoaService.AtualizarAsync(id, dto);
        return pessoa is null ? NotFound() : Ok(pessoa);
    }

    /// <summary>
    /// Remove uma pessoa e todas as suas transações (exclusão em cascata).
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var deletado = await _pessoaService.DeletarAsync(id);
        return deletado ? NoContent() : NotFound();
    }
}
