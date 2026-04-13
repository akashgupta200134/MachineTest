import { NavLink } from 'react-router-dom';

export default function NavbarPage() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-gray-800 text-blue-400'
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 h-16
                    flex items-center gap-4 sticky top-0 z-50">
      <div className="text-lg font-bold tracking-tight mr-2">
        <span className="text-blue-400">Nimap</span>
        <span className="text-white">InfoTech</span>
      </div>

      <div className="w-px h-5 bg-gray-700" />

      <NavLink to="/categories" className={linkClass}>
        🗂 Categories
      </NavLink>
      <NavLink to="/products" className={linkClass}>
        📦 Products
      </NavLink>
    </nav>
  );
}