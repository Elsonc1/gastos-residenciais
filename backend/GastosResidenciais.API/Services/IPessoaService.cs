using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de pessoas.
/// Define as operações CRUD disponíveis para o cadastro de pessoas.
/// </summary>
public interface IPessoaService
{
    Task<IEnumerable<PessoaDto>> ListarAsync();
    Task<PessoaDto?> ObterPorIdAsync(Guid id);
    Task<PessoaDto> CriarAsync(CriarPessoaDto dto);
    Task<PessoaDto?> AtualizarAsync(Guid id, CriarPessoaDto dto);
    Task<bool> DeletarAsync(Guid id);
}
