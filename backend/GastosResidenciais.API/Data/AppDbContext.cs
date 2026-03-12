using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Data;

/// <summary>
/// Contexto principal do Entity Framework Core.
/// Configura os mapeamentos das entidades para o banco SQLite e define
/// o comportamento de exclusão em cascata para a relação Pessoa → Transações.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Categoria>()
            .HasMany(c => c.Transacoes)
            .WithOne(t => t.Categoria)
            .HasForeignKey(t => t.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Categoria>()
            .Property(c => c.Finalidade)
            .HasConversion<int>();

        modelBuilder.Entity<Transacao>()
            .Property(t => t.Tipo)
            .HasConversion<int>();
    }
}
