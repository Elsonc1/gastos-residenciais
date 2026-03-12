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

    public async Task<IEnumerable<CategoriaDto>> ListarAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Categorias
            .AsNoTracking()
            .Select(c => new CategoriaDto(c.Id, c.Descricao, c.Finalidade))
            .ToListAsync(cancellationToken);
    }

    public async Task<CategoriaDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var categoria = await _context.Categorias
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return categoria is null
            ? null
            : new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade);
    }

    public async Task<CategoriaDto> CriarAsync(CriarCategoriaDto dto, CancellationToken cancellationToken = default)
    {
        var categoria = new Categoria
        {
            Descricao = dto.Descricao,
            Finalidade = dto.Finalidade
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync(cancellationToken);

        return new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade);
    }
}
