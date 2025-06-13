
import { Link, useLocation } from 'wouter';
import { Home, Target, HelpCircle, LogOut, User, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserScore } from '@/hooks/useScoring';
import RankMedal from './RankMedal';

const Header = () => {
  const [location] = useLocation();
  const { user, signOut, loading } = useAuth();
  const { data: userScore } = useUserScore();

  console.log('Header - Current user:', user?.email, 'Loading:', loading);

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/desafios', label: 'Desafios', icon: Target },
    { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  ];

  const handleSignOut = async () => {
    console.log('Sign out clicked');
    await signOut();
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border-b-4 border-green-500">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 text-white hover:text-green-100 transition-colors group">
            <div className="bg-white text-green-600 p-2 rounded-full group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sustenta Desafio</h1>
              <p className="text-xs text-green-200 hidden sm:block">Seu app de sustentabilidade</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-green-700/30 rounded-full px-6 py-2 backdrop-blur-sm">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  location === path
                    ? 'bg-white text-green-700 shadow-lg font-semibold'
                    : 'text-green-100 hover:text-white hover:bg-green-600/50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="hidden lg:flex items-center space-x-3 bg-green-700/30 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="bg-white text-green-600 p-1.5 rounded-full">
                    <User size={14} />
                  </div>
                  <div className="text-sm">
                    <p className="text-green-100 truncate max-w-32">{user.email}</p>
                    {userScore && (
                      <div className="flex items-center space-x-2">
                        <Trophy size={12} className="text-yellow-300" />
                        <span className="text-xs text-green-200">{userScore.total_points} pts</span>
                      </div>
                    )}
                  </div>
                  {userScore && (
                    <RankMedal 
                      rank={userScore.rank} 
                      points={userScore.total_points}
                      size="small"
                    />
                  )}
                </div>
                
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline font-medium">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-6 py-2 rounded-full bg-white text-green-700 hover:bg-green-50 transition-colors font-medium shadow-lg"
              >
                <User size={16} />
                <span>Entrar</span>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <nav className="flex space-x-1 bg-green-700/30 rounded-full p-1 backdrop-blur-sm">
              {navItems.map(({ path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    location === path
                      ? 'bg-white text-green-700 shadow-lg'
                      : 'text-green-100 hover:text-white hover:bg-green-600/50'
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
