using System.ComponentModel.DataAnnotations;
using GastosResidenciais.API.Models;

namespace GastosResidenciais.API.DTOs;

/// <summary>
/// DTO de entrada para criação de uma categoria.
/// A finalidade define com quais tipos de transação a categoria é compatível.
/// </summary>
public record CriarCategoriaDto(
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(400, ErrorMessage = "Descrição deve ter no máximo 400 caracteres.")]
    string Descricao,

    [Required(ErrorMessage = "Finalidade é obrigatória.")]
    FinalidadeCategoria Finalidade
);

/// <summary>
/// DTO de saída com os dados completos de uma categoria.
/// </summary>
public record CategoriaDto(Guid Id, string Descricao, FinalidadeCategoria Finalidade);
