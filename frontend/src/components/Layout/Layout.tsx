import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Componente de layout principal.
 * Renderiza a barra de navegação no topo e o conteúdo da rota ativa via <Outlet>.
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
}
