import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/Common/ErrorBoundary'
import Layout from './components/Layout/Layout'
import PessoasPage from './pages/Pessoas/PessoasPage'
import CategoriasPage from './pages/Categorias/CategoriasPage'
import TransacoesPage from './pages/Transacoes/TransacoesPage'
import RelatoriosPessoasPage from './pages/Relatorios/RelatoriosPessoasPage'
import RelatoriosCategoriasPage from './pages/Relatorios/RelatoriosCategoriasPage'

/**
 * Componente raiz da aplicação.
 * ErrorBoundary envolve todo o conteúdo para capturar erros de renderização
 * e exibir um fallback em vez de crashar a aplicação inteira.
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/pessoas" replace />} />
            <Route path="pessoas" element={<PessoasPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="transacoes" element={<TransacoesPage />} />
            <Route path="relatorios/pessoas" element={<RelatoriosPessoasPage />} />
            <Route path="relatorios/categorias" element={<RelatoriosCategoriasPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
