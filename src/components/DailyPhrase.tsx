
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import phrasesData from '../data/phrases.json';

const DailyPhrase = () => {
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const phraseIndex = dayOfYear % phrasesData.length;
    setPhrase(phrasesData[phraseIndex]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-start space-x-3">
        <Quote className="text-green-600 mt-1 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Frase do Dia</h3>
          <p className="text-green-700 text-base leading-relaxed">{phrase}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyPhrase;
