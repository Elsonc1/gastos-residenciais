import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PessoasPage from './pages/Pessoas/PessoasPage'
import CategoriasPage from './pages/Categorias/CategoriasPage'
import TransacoesPage from './pages/Transacoes/TransacoesPage'
import RelatoriosPessoasPage from './pages/Relatorios/RelatoriosPessoasPage'
import RelatoriosCategoriasPage from './pages/Relatorios/RelatoriosCategoriasPage'

/**
 * Componente raiz da aplicação.
 * Define o roteamento com React Router v6.
 * O Layout envolve todas as páginas (barra de navegação + área de conteúdo).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redireciona a raiz para a página de pessoas */}
          <Route index element={<Navigate to="/pessoas" replace />} />
          <Route path="pessoas" element={<PessoasPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="transacoes" element={<TransacoesPage />} />
          <Route path="relatorios/pessoas" element={<RelatoriosPessoasPage />} />
          <Route path="relatorios/categorias" element={<RelatoriosCategoriasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
