using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço de relatórios financeiros.
///
/// Estratégia de consulta:
///   O SQLite não suporta Sum() sobre colunas do tipo decimal em subqueries (ex.: GroupJoin com Sum).
///   A solução adotada é carregar as entidades com suas transações via Include e realizar
///   a agregação em memória com LINQ to Objects, que não tem essa limitação.
///   Isso é adequado para o volume esperado num sistema residencial.
///   Pessoas/categorias sem transações aparecem corretamente com totais zerados.
/// </summary>
public class RelatorioService : IRelatorioService
{
    private readonly AppDbContext _context;

    public RelatorioService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Carrega todas as pessoas com suas transações e agrega em memória.
    /// Garante que pessoas sem transações apareçam com valores zerados.
    /// </summary>
    public async Task<RelatorioPessoasDto> ObterTotaisPorPessoaAsync(CancellationToken cancellationToken = default)
    {
        // Include traz as transações em uma única query SQL (JOIN), sem N+1
        var pessoas = await _context.Pessoas
            .AsNoTracking()
            .Include(p => p.Transacoes)
            .ToListAsync(cancellationToken);

        // Agregação feita em memória (LINQ to Objects) para evitar limitação do SQLite com decimal
        var totais = pessoas.Select(p =>
        {
            var receitas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var despesas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return new TotalPorPessoaDto(p.Id, p.Nome, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitas = totais.Sum(t => t.TotalReceitas);
        var totalDespesas = totais.Sum(t => t.TotalDespesas);

        return new RelatorioPessoasDto(totais, totalReceitas, totalDespesas, totalReceitas - totalDespesas);
    }

    /// <summary>
    /// Carrega todas as categorias com suas transações e agrega em memória.
    /// Garante que categorias sem transações apareçam com valores zerados.
    /// </summary>
    public async Task<RelatorioCategoriasDto> ObterTotaisPorCategoriaAsync(CancellationToken cancellationToken = default)
    {
        var categorias = await _context.Categorias
            .AsNoTracking()
            .Include(c => c.Transacoes)
            .ToListAsync(cancellationToken);

        var totais = categorias.Select(c =>
        {
            var receitas = c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var despesas = c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return new TotalPorCategoriaDto(c.Id, c.Descricao, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitas = totais.Sum(t => t.TotalReceitas);
        var totalDespesas = totais.Sum(t => t.TotalDespesas);

        return new RelatorioCategoriasDto(totais, totalReceitas, totalDespesas, totalReceitas - totalDespesas);
    }
}
