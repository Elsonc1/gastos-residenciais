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

    /// <summary>Retorna todas as pessoas cadastradas.</summary>
    public async Task<IEnumerable<PessoaDto>> ListarAsync()
    {
        return await _context.Pessoas
            .AsNoTracking()
            .Select(p => new PessoaDto(p.Id, p.Nome, p.Idade))
            .ToListAsync();
    }

    /// <summary>Retorna uma pessoa pelo Id, ou null se não encontrada.</summary>
    public async Task<PessoaDto?> ObterPorIdAsync(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        return pessoa is null ? null : new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    /// <summary>Cria uma nova pessoa e retorna o registro criado com o Id gerado.</summary>
    public async Task<PessoaDto> CriarAsync(CriarPessoaDto dto)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// Retorna null se a pessoa não for encontrada.
    /// </summary>
    public async Task<PessoaDto?> AtualizarAsync(Guid id, CriarPessoaDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null) return null;

        pessoa.Nome = dto.Nome;
        pessoa.Idade = dto.Idade;

        await _context.SaveChangesAsync();

        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }

    /// <summary>
    /// Remove uma pessoa pelo Id.
    /// As transações vinculadas são deletadas automaticamente pelo banco (cascade).
    /// Retorna false se a pessoa não for encontrada.
    /// </summary>
    public async Task<bool> DeletarAsync(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null) return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return true;
    }
}
