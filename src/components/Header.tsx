
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Target, HelpCircle, MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/conscientizacao', label: 'Conscientização', icon: BookOpen },
    { path: '/desafios', label: 'Desafios', icon: Target },
    { path: '/quiz', label: 'Quiz', icon: HelpCircle },
    { path: '/pontos-coleta', label: 'Pontos de Coleta', icon: MapPin },
  ];

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-50 hover:text-white transition-colors">
            🌱 Sustenta Desafio
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === path
                    ? 'bg-green-700 text-white'
                    : 'text-green-100 hover:text-white hover:bg-green-500'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-green-100">
                <User size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-700 hover:bg-green-800 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-700 hover:bg-green-800 transition-colors"
            >
              <User size={16} />
              <span>Entrar</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <nav className="flex space-x-2">
              {navItems.map(({ path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`p-2 rounded-md transition-colors ${
                    location.pathname === path
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:text-white hover:bg-green-500'
                  }`}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
