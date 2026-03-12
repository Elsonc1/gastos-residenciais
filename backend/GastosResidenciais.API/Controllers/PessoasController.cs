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

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PessoaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var pessoas = await _pessoaService.ListarAsync(cancellationToken);
        return Ok(pessoas);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PessoaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id, cancellationToken);
        return pessoa is null ? NotFound() : Ok(pessoa);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PessoaDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarPessoaDto dto, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.CriarAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, pessoa);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PessoaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] CriarPessoaDto dto, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.AtualizarAsync(id, dto, cancellationToken);
        return pessoa is null ? NotFound() : Ok(pessoa);
    }

    /// <summary>Remove uma pessoa e todas as suas transações (exclusão em cascata).</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(Guid id, CancellationToken cancellationToken)
    {
        var deletado = await _pessoaService.DeletarAsync(id, cancellationToken);
        return deletado ? NoContent() : NotFound();
    }
}
