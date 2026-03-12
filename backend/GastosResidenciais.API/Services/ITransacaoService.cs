using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de transações.
/// A criação retorna uma tupla com o resultado ou uma mensagem de erro de negócio,
/// evitando o uso de exceções para fluxos esperados (menor de idade, categoria incompatível).
/// </summary>
public interface ITransacaoService
{
    Task<IEnumerable<TransacaoDto>> ListarAsync();

    /// <summary>
    /// Tenta criar uma transação aplicando as regras de negócio.
    /// Retorna (transacao, null) em caso de sucesso ou (null, mensagemDeErro) em caso de falha.
    /// </summary>
    Task<(TransacaoDto? Transacao, string? Erro)> CriarAsync(CriarTransacaoDto dto);
}
