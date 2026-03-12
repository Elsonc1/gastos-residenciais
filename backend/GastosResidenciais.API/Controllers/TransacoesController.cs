using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller de transações.
/// Expõe endpoints de criação e listagem.
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

    /// <summary>Lista todas as transações registradas.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var transacoes = await _transacaoService.ListarAsync();
        return Ok(transacoes);
    }

    /// <summary>
    /// Registra uma nova transação.
    /// Retorna 400 se alguma regra de negócio for violada.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarTransacaoDto dto)
    {
        var (transacao, erro) = await _transacaoService.CriarAsync(dto);

        if (erro is not null)
            return BadRequest(new { mensagem = erro });

        return CreatedAtAction(nameof(Listar), new { id = transacao!.Id }, transacao);
    }
}
