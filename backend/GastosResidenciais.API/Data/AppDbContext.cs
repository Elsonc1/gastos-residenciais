using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Data;

/// <summary>
/// Contexto principal do Entity Framework Core.
/// Configura mapeamentos, relacionamentos, índices e comportamentos de exclusão.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Pessoa ────────────────────────────────────────────────────────────────
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Categoria ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Categoria>()
            .HasMany(c => c.Transacoes)
            .WithOne(t => t.Categoria)
            .HasForeignKey(t => t.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Categoria>()
            .Property(c => c.Finalidade)
            .HasConversion<int>();

        // ── Transação ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Transacao>()
            .Property(t => t.Tipo)
            .HasConversion<int>();

        // Precisão decimal para valores monetários (18 dígitos, 2 casas decimais)
        modelBuilder.Entity<Transacao>()
            .Property(t => t.Valor)
            .HasPrecision(18, 2);

        // Índices nas foreign keys melhoram performance de JOINs e relatórios
        modelBuilder.Entity<Transacao>()
            .HasIndex(t => t.PessoaId);

        modelBuilder.Entity<Transacao>()
            .HasIndex(t => t.CategoriaId);

        // Índice composto para consultas de relatório que filtram por tipo
        modelBuilder.Entity<Transacao>()
            .HasIndex(t => new { t.PessoaId, t.Tipo });
    }
}
