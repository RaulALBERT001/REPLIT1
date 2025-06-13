
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Star } from 'lucide-react';
import RankMedal from './RankMedal';

interface RankUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRank: string;
  points: number;
}

const RankUpgradeModal = ({ isOpen, onClose, newRank, points }: RankUpgradeModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getRankMessage = (rank: string) => {
    switch (rank) {
      case 'silver':
        return {
          title: 'Parabéns! 🥈',
          message: 'Você conquistou a medalha de Prata!',
          description: 'Continue assim para alcançar a medalha de Ouro!'
        };
      case 'gold':
        return {
          title: 'Incrível! 🥇',
          message: 'Você conquistou a medalha de Ouro!',
          description: 'Você é um verdadeiro campeão da sustentabilidade!'
        };
      default:
        return {
          title: 'Parabéns!',
          message: 'Você subiu de rank!',
          description: 'Continue completando desafios!'
        };
    }
  };

  const rankInfo = getRankMessage(newRank);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            {rankInfo.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <Star
                  key={i}
                  className="absolute text-yellow-400 animate-bounce"
                  size={16}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg text-white mb-6">
            <Trophy className="mx-auto mb-4 text-yellow-300" size={64} />
            <h3 className="text-xl font-bold mb-2">{rankInfo.message}</h3>
            <div className="flex justify-center mb-4">
              <RankMedal rank={newRank} points={points} size="large" />
            </div>
            <p className="text-blue-100">{rankInfo.description}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continuar
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default RankUpgradeModal;
