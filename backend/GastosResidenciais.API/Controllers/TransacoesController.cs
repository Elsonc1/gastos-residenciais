using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de transações.
/// Expõe endpoints de criação, consulta por Id e listagem.
/// As regras de negócio são validadas na camada de serviço:
///   - Menores de 18 anos só podem registrar despesas.
///   - A categoria deve ter finalidade compatível com o tipo da transação.
/// Violações retornam HTTP 400 com mensagem explicativa.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TransacaoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var transacoes = await _transacaoService.ListarAsync(cancellationToken);
        return Ok(transacoes);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TransacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        var transacao = await _transacaoService.ObterPorIdAsync(id, cancellationToken);
        return transacao is null ? NotFound() : Ok(transacao);
    }

    /// <summary>
    /// Registra uma nova transação.
    /// Retorna 400 se alguma regra de negócio for violada (menor de idade ou categoria incompatível).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarTransacaoDto dto, CancellationToken cancellationToken)
    {
        var result = await _transacaoService.CriarAsync(dto, cancellationToken);

        if (!result.IsSuccess)
            return BadRequest(new { mensagem = result.ErrorMessage });

        return CreatedAtAction(nameof(ObterPorId), new { id = result.Data!.Id }, result.Data);
    }
}
