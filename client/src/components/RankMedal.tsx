import { Award } from 'lucide-react';

interface RankMedalProps {
  rank: string;
  points: number;
  size?: 'small' | 'medium' | 'large';
}

const RankMedal = ({ rank, points, size = 'small' }: RankMedalProps) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'gold':
        return 'text-yellow-500';
      case 'silver':
        return 'text-gray-400';
      case 'bronze':
        return 'text-amber-600';
      default:
        return 'text-gray-400';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '🏅';
    }
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <div className={`flex items-center space-x-1 ${sizeClasses[size]}`}>
      <span className="text-lg">{getRankIcon(rank)}</span>
      <Award className={`${getRankColor(rank)}`} size={iconSizes[size]} />
      <span className="font-semibold text-gray-700">{points}</span>
    </div>
  );
};

export default RankMedal;