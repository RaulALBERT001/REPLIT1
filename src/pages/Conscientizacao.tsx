
import ArticleCard from '../components/ArticleCard';
import { useArticles } from '../hooks/useSupabaseData';
import { BookOpen } from 'lucide-react';

const Conscientizacao = () => {
  const { data: articles, isLoading, error } = useArticles();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar artigos</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="mx-auto text-green-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Conscientização Ambiental</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore artigos educativos sobre práticas sustentáveis e descubra como pequenas ações podem fazer uma grande diferença para o meio ambiente.
          </p>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                description={article.description}
                image={article.image || '/placeholder.svg'}
              />
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 bg-green-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Sabia que...</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🌍 Dados Importantes</h3>
              <ul className="space-y-2 text-green-100">
                <li>• 1 tonelada de papel reciclado = 17 árvores preservadas</li>
                <li>• 1 lata de alumínio = 90 dias para se decompor</li>
                <li>• 1 garrafa de vidro = 4.000 anos na natureza</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">♻️ Impacto Positivo</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Reciclagem reduz poluição do ar em 74%</li>
                <li>• Compostagem diminui 30% do lixo doméstico</li>
                <li>• Reutilização economiza recursos naturais</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conscientizacao;
