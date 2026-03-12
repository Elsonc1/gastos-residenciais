using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.API.DTOs;

/// <summary>
/// DTO de entrada para criação e edição de uma pessoa.
/// Contém apenas os campos que o cliente pode definir (Id é gerado automaticamente).
/// </summary>
public record CriarPessoaDto(
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres.")]
    string Nome,

    [Required(ErrorMessage = "Idade é obrigatória.")]
    [Range(0, 150, ErrorMessage = "Idade deve ser entre 0 e 150.")]
    int Idade
);

/// <summary>
/// DTO de saída com os dados completos de uma pessoa.
/// </summary>
public record PessoaDto(Guid Id, string Nome, int Idade);
