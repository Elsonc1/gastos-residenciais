using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.API.Models;

/// <summary>
/// Entidade que representa uma transação financeira (receita ou despesa) de uma pessoa.
/// A criação de transações está sujeita às seguintes regras de negócio:
///   1. Menores de 18 anos só podem registrar despesas.
///   2. A finalidade da categoria deve ser compatível com o tipo da transação.
/// </summary>
public class Transacao
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = string.Empty;

    /// <summary>Valor monetário positivo da transação.</summary>
    [Required]
    public decimal Valor { get; set; }

    [Required]
    public TipoTransacao Tipo { get; set; }

    [Required]
    public Guid CategoriaId { get; set; }

    /// <summary>Categoria à qual a transação pertence.</summary>
    public Categoria Categoria { get; set; } = null!;

    [Required]
    public Guid PessoaId { get; set; }

    /// <summary>Pessoa dona desta transação.</summary>
    public Pessoa Pessoa { get; set; } = null!;
}
