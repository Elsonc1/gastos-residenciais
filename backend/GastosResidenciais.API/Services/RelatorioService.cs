using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço de relatórios financeiros.
/// A agregação (SUM/GROUP BY) é projetada diretamente no banco via LINQ-to-SQL,
/// evitando carregar todas as transações em memória.
/// Pessoas/categorias sem transações aparecem com totais zerados (LEFT JOIN via GroupJoin).
/// </summary>
public class RelatorioService : IRelatorioService
{
    private readonly AppDbContext _context;

    public RelatorioService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Agrega as transações no banco por pessoa usando GroupJoin,
    /// garantindo que pessoas sem transações também apareçam no resultado.
    /// </summary>
    public async Task<RelatorioPessoasDto> ObterTotaisPorPessoaAsync(CancellationToken cancellationToken = default)
    {
        var totais = await _context.Pessoas
            .AsNoTracking()
            .GroupJoin(
                _context.Transacoes,
                pessoa => pessoa.Id,
                transacao => transacao.PessoaId,
                (pessoa, transacoes) => new TotalPorPessoaDto(
                    pessoa.Id,
                    pessoa.Nome,
                    transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                    transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                    transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                    - transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
                ))
            .ToListAsync(cancellationToken);

        var totalReceitas = totais.Sum(t => t.TotalReceitas);
        var totalDespesas = totais.Sum(t => t.TotalDespesas);

        return new RelatorioPessoasDto(totais, totalReceitas, totalDespesas, totalReceitas - totalDespesas);
    }

    /// <summary>
    /// Agrega as transações no banco por categoria usando GroupJoin,
    /// garantindo que categorias sem transações também apareçam no resultado.
    /// </summary>
    public async Task<RelatorioCategoriasDto> ObterTotaisPorCategoriaAsync(CancellationToken cancellationToken = default)
    {
        var totais = await _context.Categorias
            .AsNoTracking()
            .GroupJoin(
                _context.Transacoes,
                categoria => categoria.Id,
                transacao => transacao.CategoriaId,
                (categoria, transacoes) => new TotalPorCategoriaDto(
                    categoria.Id,
                    categoria.Descricao,
                    transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                    transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                    transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                    - transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
                ))
            .ToListAsync(cancellationToken);

        var totalReceitas = totais.Sum(t => t.TotalReceitas);
        var totalDespesas = totais.Sum(t => t.TotalDespesas);

        return new RelatorioCategoriasDto(totais, totalReceitas, totalDespesas, totalReceitas - totalDespesas);
    }
}
