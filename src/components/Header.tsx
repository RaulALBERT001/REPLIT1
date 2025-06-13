
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Target, HelpCircle, MapPin } from 'lucide-react';

const Header = () => {
  const location = useLocation();

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
