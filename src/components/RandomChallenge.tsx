
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import challengesData from '../data/challenges.json';

const RandomChallenge = () => {
  const [randomChallenge, setRandomChallenge] = useState('');

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const challengeIndex = dayOfYear % challengesData.length;
    setRandomChallenge(challengesData[challengeIndex]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-start space-x-3">
        <Sparkles className="text-blue-600 mt-1 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Desafio Aleatório do Dia</h3>
          <p className="text-blue-700 text-base leading-relaxed">{randomChallenge}</p>
        </div>
      </div>
    </div>
  );
};

export default RandomChallenge;
