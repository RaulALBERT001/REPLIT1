
import ArticleCard from '../components/ArticleCard';
import articlesData from '../data/articles.json';
import { BookOpen } from 'lucide-react';

const Conscientizacao = () => {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.description}
              image={article.image}
            />
          ))}
        </div>

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
