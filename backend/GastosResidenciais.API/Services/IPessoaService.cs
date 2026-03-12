using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de pessoas.
/// Define as operações CRUD disponíveis para o cadastro de pessoas.
/// Todos os métodos recebem CancellationToken para suportar cancelamento cooperativo
/// de requisições HTTP encerradas prematuramente pelo cliente.
/// </summary>
public interface IPessoaService
{
    Task<IEnumerable<PessoaDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<PessoaDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PessoaDto> CriarAsync(CriarPessoaDto dto, CancellationToken cancellationToken = default);
    Task<PessoaDto?> AtualizarAsync(Guid id, CriarPessoaDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeletarAsync(Guid id, CancellationToken cancellationToken = default);
}
