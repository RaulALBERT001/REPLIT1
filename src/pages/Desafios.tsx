
import { useState, useEffect } from 'react';
import ChallengeItem from '../components/ChallengeItem';
import RandomChallenge from '../components/RandomChallenge';
import { Target, Trophy } from 'lucide-react';

const fixedChallenges = [
  "Use uma garrafa reutilizável em vez de garrafas plásticas descartáveis",
  "Separe corretamente o lixo reciclável do orgânico",
  "Desligue aparelhos eletrônicos da tomada quando não estiver usando",
  "Use sacolas reutilizáveis para fazer compras",
  "Evite desperdício de comida planejando suas refeições"
];

const Desafios = () => {
  const [completedChallenges, setCompletedChallenges] = useState<boolean[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('challengesProgress');
    if (saved) {
      setCompletedChallenges(JSON.parse(saved));
    } else {
      setCompletedChallenges(new Array(fixedChallenges.length).fill(false));
    }
  }, []);

  const toggleChallenge = (index: number) => {
    const newCompleted = [...completedChallenges];
    newCompleted[index] = !newCompleted[index];
    setCompletedChallenges(newCompleted);
    localStorage.setItem('challengesProgress', JSON.stringify(newCompleted));
  };

  const completedCount = completedChallenges.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Target className="mx-auto text-blue-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Desafios Sustentáveis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete os desafios abaixo e construa hábitos sustentáveis que fazem a diferença!
          </p>
        </div>

        {/* Random Challenge */}
        <div className="mb-8">
          <RandomChallenge />
        </div>

        {/* Progress Counter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="text-yellow-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {completedCount} de {fixedChallenges.length} Desafios Concluídos
                </h2>
                <p className="text-gray-600">Continue assim! Cada ação conta para um planeta melhor.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{Math.round((completedCount / fixedChallenges.length) * 100)}%</div>
              <div className="text-gray-500">Completo</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / fixedChallenges.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seus Desafios</h2>
          {fixedChallenges.map((challenge, index) => (
            <ChallengeItem
              key={index}
              challenge={challenge}
              isCompleted={completedChallenges[index] || false}
              onToggle={() => toggleChallenge(index)}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === fixedChallenges.length && (
          <div className="mt-8 bg-green-600 text-white p-8 rounded-lg text-center">
            <Trophy className="mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
            <p className="text-green-100">
              Você completou todos os desafios! Seu compromisso com a sustentabilidade está fazendo a diferença.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Desafios;
