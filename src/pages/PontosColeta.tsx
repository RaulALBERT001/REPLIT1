
import { MapPin, Recycle } from 'lucide-react';
import { useCollectionPoints } from '../hooks/useSupabaseData';

const PontosColeta = () => {
  const { data: collectionPoints, isLoading, error } = useCollectionPoints();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pontos de coleta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar pontos de coleta</p>
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
          <MapPin className="mx-auto text-green-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pontos de Coleta</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre os pontos de coleta mais próximos para descartar seus resíduos de forma responsável e sustentável.
          </p>
        </div>

        {/* Collection Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {collectionPoints?.map((point) => {
            const wasteTypes = Array.isArray(point.waste_types) ? point.waste_types : JSON.parse(point.waste_types as string);
            return (
              <div key={point.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{point.name}</h3>
                    <p className="text-gray-600 mb-4">{point.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Recycle size={16} className="mr-2" />
                    Tipos de Resíduo Aceitos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {wasteTypes.map((type: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-green-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Dicas para Descarte Responsável</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">♻️ Antes de Descartar</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Limpe os materiais recicláveis</li>
                <li>• Remova tampas e rótulos quando necessário</li>
                <li>• Separe por tipo de material</li>
                <li>• Verifique se o ponto aceita o material</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">🌍 Materiais Especiais</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Eletrônicos: pontos especializados</li>
                <li>• Pilhas e baterias: locais específicos</li>
                <li>• Óleo de cozinha: não misture com outros</li>
                <li>• Medicamentos: farmácias participantes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            Não encontrou um ponto de coleta próximo?
          </h3>
          <p className="text-blue-600 mb-4">
            Entre em contato com a prefeitura da sua cidade para mais informações sobre coleta seletiva e pontos de descarte.
          </p>
          <div className="text-sm text-blue-500">
            Lembre-se: cada ação sustentável faz a diferença! 🌱
          </div>
        </div>
      </div>
    </div>
  );
};

export default PontosColeta;
