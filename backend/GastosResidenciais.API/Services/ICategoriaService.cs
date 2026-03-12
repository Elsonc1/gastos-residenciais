using GastosResidenciais.API.DTOs;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Contrato do serviço de categorias.
/// Categorias suportam apenas criação e listagem (não são editáveis nem deletáveis
/// enquanto possuírem transações vinculadas).
/// </summary>
public interface ICategoriaService
{
    Task<IEnumerable<CategoriaDto>> ListarAsync();
    Task<CategoriaDto> CriarAsync(CriarCategoriaDto dto);
}
