using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.API.Models;

/// <summary>
/// Entidade que representa uma categoria de transação.
/// A finalidade restringe quais tipos de transação podem utilizar esta categoria:
///   - Despesa:  apenas transações do tipo Despesa.
///   - Receita:  apenas transações do tipo Receita.
///   - Ambas:    transações de qualquer tipo.
/// </summary>
public class Categoria
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public FinalidadeCategoria Finalidade { get; set; }

    /// <summary>
    /// Transações classificadas nesta categoria (relacionamento 1:N).
    /// A deleção de uma categoria é restrita se houver transações vinculadas.
    /// </summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
