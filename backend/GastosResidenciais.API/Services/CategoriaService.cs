using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Implementação do serviço de categorias.
/// Categorias funcionam como classificadores imutáveis das transações:
/// uma vez criadas, não devem ser alteradas para preservar a integridade histórica.
/// </summary>
public class CategoriaService : ICategoriaService
{
    private readonly AppDbContext _context;

    public CategoriaService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Retorna todas as categorias cadastradas.</summary>
    public async Task<IEnumerable<CategoriaDto>> ListarAsync()
    {
        return await _context.Categorias
            .AsNoTracking()
            .Select(c => new CategoriaDto(c.Id, c.Descricao, c.Finalidade))
            .ToListAsync();
    }

    /// <summary>Cria uma nova categoria e retorna o registro com o Id gerado.</summary>
    public async Task<CategoriaDto> CriarAsync(CriarCategoriaDto dto)
    {
        var categoria = new Categoria
        {
            Descricao = dto.Descricao,
            Finalidade = dto.Finalidade
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade);
    }
}
