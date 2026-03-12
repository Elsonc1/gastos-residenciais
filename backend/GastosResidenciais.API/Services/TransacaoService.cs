using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço de transações. Centraliza as duas principais regras de negócio:
///
///   Regra 1 — Menor de idade:
///     Pessoas com menos de 18 anos só podem registrar transações do tipo Despesa.
///     Qualquer tentativa de registrar uma Receita para um menor resulta em erro.
///
///   Regra 2 — Compatibilidade de categoria:
///     A finalidade da categoria selecionada deve ser compatível com o tipo da transação:
///       - Tipo Despesa → categoria com finalidade Despesa ou Ambas.
///       - Tipo Receita → categoria com finalidade Receita ou Ambas.
///     Isso impede, por exemplo, usar uma categoria "Salário" (Receita) para registrar uma despesa.
/// </summary>
public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _context;

    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Retorna todas as transações com os dados de categoria e pessoa.</summary>
    public async Task<IEnumerable<TransacaoDto>> ListarAsync()
    {
        return await _context.Transacoes
            .AsNoTracking()
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .Select(t => new TransacaoDto(
                t.Id,
                t.Descricao,
                t.Valor,
                t.Tipo,
                t.CategoriaId,
                t.Categoria.Descricao,
                t.PessoaId,
                t.Pessoa.Nome
            ))
            .ToListAsync();
    }

    /// <summary>
    /// Valida as regras de negócio e cria a transação se todas forem satisfeitas.
    /// </summary>
    public async Task<(TransacaoDto? Transacao, string? Erro)> CriarAsync(CriarTransacaoDto dto)
    {
        if (dto.Valor <= 0)
            return (null, "O valor da transação deve ser positivo.");

        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
            return (null, "Pessoa não encontrada.");

        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return (null, $"'{pessoa.Nome}' tem {pessoa.Idade} anos. Menores de 18 anos só podem registrar despesas.");

        var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
        if (categoria is null)
            return (null, "Categoria não encontrada.");

        bool compativel = dto.Tipo switch
        {
            TipoTransacao.Despesa => categoria.Finalidade == FinalidadeCategoria.Despesa
                                     || categoria.Finalidade == FinalidadeCategoria.Ambas,
            TipoTransacao.Receita => categoria.Finalidade == FinalidadeCategoria.Receita
                                     || categoria.Finalidade == FinalidadeCategoria.Ambas,
            _ => false
        };

        if (!compativel)
            return (null,
                $"A categoria '{categoria.Descricao}' (finalidade: {categoria.Finalidade}) " +
                $"não é compatível com transações do tipo {dto.Tipo}.");

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return (new TransacaoDto(
            transacao.Id,
            transacao.Descricao,
            transacao.Valor,
            transacao.Tipo,
            transacao.CategoriaId,
            categoria.Descricao,
            transacao.PessoaId,
            pessoa.Nome
        ), null);
    }
}