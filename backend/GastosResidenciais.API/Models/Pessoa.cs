using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.API.Models;

/// <summary>
/// Entidade que representa uma pessoa no sistema.
/// Uma pessoa pode ter múltiplas transações financeiras vinculadas.
/// Ao ser deletada, todas as suas transações são removidas automaticamente (cascade delete).
/// </summary>
public class Pessoa
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Range(0, 150)]
    public int Idade { get; set; }

    /// <summary>
    /// Transações vinculadas a esta pessoa (relacionamento 1:N).
    /// Configurado com DeleteBehavior.Cascade no DbContext.
    /// </summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
