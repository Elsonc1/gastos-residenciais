import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * ErrorBoundary captura erros de renderização em componentes filhos,
 * impedindo que a aplicação inteira crashe por um erro localizado.
 * Exibe um fallback amigável em vez da tela branca padrão do React.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="text-center py-12" role="alert">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Algo deu errado</h2>
            <p className="text-gray-500">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
