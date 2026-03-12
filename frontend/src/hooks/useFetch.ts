import { useState, useEffect, useCallback } from 'react'

/**
 * Hook genérico para buscar dados de uma API com gerenciamento de estado (loading, error, data).
 *
 * Melhorias sobre o padrão useState+useEffect direto:
 *   - Evita setState em componente desmontado via flag isMounted.
 *   - Oferece função `refetch` estável (useCallback) para recarregar sob demanda.
 *   - Centraliza o padrão repetido de loading/error/data em um único lugar.
 *
 * @param fetchFn Função async que retorna os dados desejados.
 */
export function useFetch<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    let isMounted = true

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      if (isMounted) setData(result)
    } catch {
      if (isMounted) setError('Erro ao carregar dados. Verifique se a API está em execução.')
    } finally {
      if (isMounted) setLoading(false)
    }

    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch } as const
}
