using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de categorias.
/// Categorias suportam apenas criação e listagem (não são editáveis nem deletáveis
/// enquanto possuírem transações vinculadas).
/// </summary>
public interface ICategoriaService
{
    Task<IEnumerable<CategoriaDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<CategoriaDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CategoriaDto> CriarAsync(CriarCategoriaDto dto, CancellationToken cancellationToken = default);
}
