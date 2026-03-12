import { NavLink } from 'react-router-dom'

/**
 * Links de navegação definidos fora do componente para evitar
 * recriação do array a cada render.
 */
const links = [
  { to: '/pessoas', label: 'Pessoas' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/relatorios/pessoas', label: 'Rel. Pessoas' },
  { to: '/relatorios/categorias', label: 'Rel. Categorias' },
] as const

/**
 * Barra de navegação global da aplicação.
 * Usa NavLink do React Router para destacar a rota ativa automaticamente.
 * O atributo aria-current="page" é definido automaticamente pelo NavLink
 * quando a rota está ativa, melhorando a acessibilidade para leitores de tela.
 */
export default function Navbar() {
  return (
    <nav className="bg-indigo-700 text-white shadow-lg" aria-label="Navegação principal">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center h-16 gap-2 overflow-x-auto">
          <span className="text-base font-bold mr-4 whitespace-nowrap shrink-0">
            Gastos Residenciais
          </span>
          <div className="flex gap-1" role="menubar">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                role="menuitem"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'hover:bg-indigo-600 text-indigo-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
