namespace GastosResidenciais.API.Models;

/// <summary>
/// Define a finalidade de uma categoria.
/// Determina quais tipos de transação podem usar a categoria:
///   - Despesa:  apenas transações do tipo Despesa.
///   - Receita:  apenas transações do tipo Receita.
///   - Ambas:    qualquer tipo de transação.
/// </summary>
public enum FinalidadeCategoria
{
    Despesa = 0,
    Receita = 1,
    Ambas = 2
}

/// <summary>
/// Define o tipo de uma transação financeira.
/// </summary>
public enum TipoTransacao
{
    Despesa = 0,
    Receita = 1
}
