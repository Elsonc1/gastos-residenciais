using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Implementação do serviço de pessoas.
/// A deleção em cascata das transações vinculadas é gerenciada pelo
/// banco de dados via configuração no AppDbContext (DeleteBehavior.Cascade),
/// portanto não requer lógica adicional aqui.
/// </summary>
public class PessoaService : IPessoaService
{
    private readonly AppDbContext _context;

    public PessoaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PessoaDto>> ListarAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Pessoas
            .AsNoTracking()
            .Select(p => new PessoaDto(p.Id, p.Nome, p.Idade))
            .ToListAsync(cancellationToken);
    }

    public async Task<PessoaDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var pessoa = await _context.Pessoas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        return pessoa is null ? null : new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    public async Task<PessoaDto> CriarAsync(CriarPessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync(cancellationToken);

        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    public async Task<PessoaDto?> AtualizarAsync(Guid id, CriarPessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoa = await _context.Pessoas.FindAsync([id], cancellationToken);
        if (pessoa is null) return null;

        pessoa.Nome = dto.Nome;
        pessoa.Idade = dto.Idade;

        await _context.SaveChangesAsync(cancellationToken);

        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    public async Task<bool> DeletarAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var pessoa = await _context.Pessoas.FindAsync([id], cancellationToken);
        if (pessoa is null) return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
