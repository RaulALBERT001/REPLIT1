
import { CheckCircle, Circle } from 'lucide-react';

interface ChallengeItemProps {
  challenge: string;
  isCompleted: boolean;
  onToggle: () => void;
}

const ChallengeItem = ({ challenge, isCompleted, onToggle }: ChallengeItemProps) => {
  return (
    <div 
      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
        isCompleted 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200'
      }`}
      onClick={onToggle}
    >
      {isCompleted ? (
        <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
      ) : (
        <Circle className="text-gray-400 flex-shrink-0" size={24} />
      )}
      <span className={`text-base ${isCompleted ? 'text-green-800 line-through' : 'text-gray-700'}`}>
        {challenge}
      </span>
    </div>
  );
};

export default ChallengeItem;
