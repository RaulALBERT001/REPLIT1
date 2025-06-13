
import DailyPhrase from '../components/DailyPhrase';
import { Link } from 'wouter';
import { Leaf, Target, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            Bem-vindo ao Sustenta Desafio
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
            Transforme pequenas ações diárias em grandes impactos ambientais. 
            Aprenda práticas sustentáveis, complete desafios e ajude a construir um planeta mais verde.
          </p>
        </div>

        {/* Daily Phrase */}
        <div className="mb-12">
          <DailyPhrase />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-green-100">
            <Leaf className="mx-auto text-green-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-green-800 mb-3">Aprenda</h3>
            <p className="text-green-600">
              Descubra práticas sustentáveis através de artigos educativos sobre reciclagem, compostagem e redução de desperdício.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-blue-100">
            <Target className="mx-auto text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Desafie-se</h3>
            <p className="text-blue-600">
              Complete desafios diários e acompanhe seu progresso rumo a um estilo de vida mais sustentável.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-purple-100">
            <Award className="mx-auto text-purple-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-purple-800 mb-3">Teste Conhecimentos</h3>
            <p className="text-purple-600">
              Participe de quiz interativos e amplie seus conhecimentos sobre sustentabilidade e meio ambiente.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-green-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Comece sua jornada sustentável hoje!</h2>
          <p className="text-green-100 mb-6">
            Cada pequena ação conta. Junte-se a nós na missão de criar um futuro mais verde e sustentável.
          </p>
          <div className="space-x-4">
            <Link 
              to="/desafios" 
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-green-50 transition-colors"
            >
              Ver Desafios
            </Link>
            <Link 
              to="/conscientizacao" 
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
            >
              Aprender Mais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
