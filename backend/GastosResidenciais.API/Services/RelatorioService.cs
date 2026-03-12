using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço de relatórios financeiros.
/// Calcula totais de receitas, despesas e saldo (receita − despesa)
/// agrupados por pessoa e por categoria, incluindo os totais gerais consolidados.
/// </summary>
public class RelatorioService : IRelatorioService
{
    private readonly AppDbContext _context;

    public RelatorioService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Agrega as transações de cada pessoa e calcula:
    ///   - TotalReceitas: soma de todas as transações do tipo Receita.
    ///   - TotalDespesas: soma de todas as transações do tipo Despesa.
    ///   - Saldo: TotalReceitas − TotalDespesas (pode ser negativo).
    /// Ao final, inclui o consolidado de todas as pessoas.
    /// </summary>
    public async Task<RelatorioPessoasDto> ObterTotaisPorPessoaAsync()
    {
        var pessoas = await _context.Pessoas
            .AsNoTracking()
            .Include(p => p.Transacoes)
            .ToListAsync();

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
    /// Agrega as transações de cada categoria e calcula:
    ///   - TotalReceitas: soma de todas as transações do tipo Receita nesta categoria.
    ///   - TotalDespesas: soma de todas as transações do tipo Despesa nesta categoria.
    ///   - Saldo: TotalReceitas − TotalDespesas.
    /// Ao final, inclui o consolidado de todas as categorias.
    /// </summary>
    public async Task<RelatorioCategoriasDto> ObterTotaisPorCategoriaAsync()
    {
        var categorias = await _context.Categorias
            .AsNoTracking()
            .Include(c => c.Transacoes)
            .ToListAsync();

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
