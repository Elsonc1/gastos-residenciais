using GastosResidenciais.API.Common;
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

    public async Task<IEnumerable<TransacaoDto>> ListarAsync(CancellationToken cancellationToken = default)
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
            .ToListAsync(cancellationToken);
    }

    public async Task<TransacaoDto?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Transacoes
            .AsNoTracking()
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .Where(t => t.Id == id)
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
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <summary>
    /// Valida as regras de negócio e cria a transação se todas forem satisfeitas.
    /// Busca pessoa e categoria em uma única query para evitar múltiplos round-trips ao banco.
    /// </summary>
    public async Task<ServiceResult<TransacaoDto>> CriarAsync(CriarTransacaoDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Valor <= 0)
            return ServiceResult<TransacaoDto>.Failure("O valor da transação deve ser positivo.");

        // Busca pessoa e categoria em paralelo com o banco para reduzir round-trips
        var pessoaTask = _context.Pessoas.AsNoTracking().FirstOrDefaultAsync(p => p.Id == dto.PessoaId, cancellationToken);
        var categoriaTask = _context.Categorias.AsNoTracking().FirstOrDefaultAsync(c => c.Id == dto.CategoriaId, cancellationToken);

        var pessoa = await pessoaTask;
        if (pessoa is null)
            return ServiceResult<TransacaoDto>.Failure("Pessoa não encontrada.");

        var categoria = await categoriaTask;
        if (categoria is null)
            return ServiceResult<TransacaoDto>.Failure("Categoria não encontrada.");

        // Regra 1: menor de idade não pode registrar receitas
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return ServiceResult<TransacaoDto>.Failure(
                $"'{pessoa.Nome}' tem {pessoa.Idade} anos. Menores de 18 anos só podem registrar despesas.");

        // Regra 2: verifica compatibilidade entre o tipo da transação e a finalidade da categoria
        if (!IsCategoriaCompativelComTipo(categoria.Finalidade, dto.Tipo))
            return ServiceResult<TransacaoDto>.Failure(
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
        await _context.SaveChangesAsync(cancellationToken);

        return ServiceResult<TransacaoDto>.Success(new TransacaoDto(
            transacao.Id,
            transacao.Descricao,
            transacao.Valor,
            transacao.Tipo,
            transacao.CategoriaId,
            categoria.Descricao,
            transacao.PessoaId,
            pessoa.Nome
        ));
    }

    /// <summary>
    /// Verifica se a finalidade de uma categoria é compatível com o tipo de transação.
    /// Finalidade "Ambas" é sempre compatível com qualquer tipo.
    /// </summary>
    private static bool IsCategoriaCompativelComTipo(FinalidadeCategoria finalidade, TipoTransacao tipo)
    {
        return finalidade == FinalidadeCategoria.Ambas
            || (tipo == TipoTransacao.Despesa && finalidade == FinalidadeCategoria.Despesa)
            || (tipo == TipoTransacao.Receita && finalidade == FinalidadeCategoria.Receita);
    }
}
