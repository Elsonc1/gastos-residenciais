using System.ComponentModel.DataAnnotations;
using GastosResidenciais.API.Models;

namespace GastosResidenciais.API.DTOs;

/// <summary>
/// DTO de entrada para criação de uma transação.
/// As regras de negócio (menor de idade, compatibilidade de categoria) são
/// validadas na camada de serviço, não aqui.
/// </summary>
public record CriarTransacaoDto(
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(400, ErrorMessage = "Descrição deve ter no máximo 400 caracteres.")]
    string Descricao,

    [Required(ErrorMessage = "Valor é obrigatório.")]
    decimal Valor,

    [Required(ErrorMessage = "Tipo é obrigatório.")]
    TipoTransacao Tipo,

    [Required(ErrorMessage = "Categoria é obrigatória.")]
    Guid CategoriaId,

    [Required(ErrorMessage = "Pessoa é obrigatória.")]
    Guid PessoaId
);

/// <summary>
/// DTO de saída com os dados completos de uma transação,
/// incluindo os nomes denormalizados de categoria e pessoa para facilitar a exibição.
/// </summary>
public record TransacaoDto(
    Guid Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    Guid CategoriaId,
    string CategoriaDescricao,
    Guid PessoaId,
    string PessoaNome
);
