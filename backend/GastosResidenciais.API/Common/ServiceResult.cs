namespace GastosResidenciais.API.Common;

/// <summary>
/// Encapsula o resultado de uma operação de serviço que pode falhar por regras de negócio.
/// Substitui o uso de tuplas (T?, string?) por um tipo semântico que torna
/// a API dos serviços mais legível e extensível.
/// </summary>
/// <typeparam name="T">Tipo do dado retornado em caso de sucesso.</typeparam>
public class ServiceResult<T>
{
    public T? Data { get; }
    public string? ErrorMessage { get; }
    public bool IsSuccess => ErrorMessage is null;

    private ServiceResult(T? data, string? errorMessage)
    {
        Data = data;
        ErrorMessage = errorMessage;
    }

    /// <summary>Cria um resultado de sucesso com o dado retornado.</summary>
    public static ServiceResult<T> Success(T data) => new(data, null);

    /// <summary>Cria um resultado de falha com uma mensagem de erro descritiva.</summary>
    public static ServiceResult<T> Failure(string errorMessage) => new(default, errorMessage);
}
