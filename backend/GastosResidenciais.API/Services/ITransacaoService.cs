using GastosResidenciais.API.Common;
using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de transações.
/// A criação retorna um <see cref="ServiceResult{T}"/> que encapsula
/// sucesso ou erro de negócio de forma tipada e extensível.
/// </summary>
public interface ITransacaoService
{
    Task<IEnumerable<TransacaoDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<TransacaoDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Tenta criar uma transação aplicando as regras de negócio.
    /// Retorna ServiceResult.Success em caso de sucesso ou ServiceResult.Failure com mensagem de erro.
    /// </summary>
    Task<ServiceResult<TransacaoDto>> CriarAsync(CriarTransacaoDto dto, CancellationToken cancellationToken = default);
}
