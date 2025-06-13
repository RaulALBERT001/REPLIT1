
import { Quote } from 'lucide-react';
import { useDailyPhrases } from '@/hooks/useSupabaseData';
import { useMemo } from 'react';

const DailyPhrase = () => {
  const { data: phrases, isLoading } = useDailyPhrases();

  const dailyPhrase = useMemo(() => {
    if (!phrases || phrases.length === 0) return '';
    
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const phraseIndex = dayOfYear % phrases.length;
    return phrases[phraseIndex]?.phrase || '';
  }, [phrases]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-start space-x-3">
        <Quote className="text-green-600 mt-1 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Frase do Dia</h3>
          <p className="text-green-700 text-base leading-relaxed">{dailyPhrase}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyPhrase;
