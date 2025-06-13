
import { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import quizData from '../data/quiz.json';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mb-6">
                {score === quizData.length ? (
                  <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
                ) : (
                  <HelpCircle className="mx-auto text-blue-600 mb-4" size={64} />
                )}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Resultado do Quiz</h1>
                <p className="text-xl text-gray-600 mb-6">
                  Você acertou <span className="font-bold text-green-600">{score}</span> de <span className="font-bold">{quizData.length}</span> perguntas!
                </p>
              </div>

              <div className="mb-8">
                <div className="bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(score / quizData.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  {score === quizData.length && "Perfeito! Você é um especialista em sustentabilidade! 🌟"}
                  {score >= Math.ceil(quizData.length * 0.7) && score < quizData.length && "Muito bem! Você tem um bom conhecimento sobre sustentabilidade! 👏"}
                  {score < Math.ceil(quizData.length * 0.7) && "Continue aprendendo! Cada passo em direção à sustentabilidade conta! 🌱"}
                </p>
              </div>

              {/* Detailed Results */}
              <div className="text-left mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Respostas Detalhadas:</h3>
                <div className="space-y-4">
                  {quizData.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                      <div className="flex items-center space-x-2">
                        {selectedAnswers[index] === question.correctAnswer ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <XCircle className="text-red-600" size={20} />
                        )}
                        <span className="text-sm text-gray-600">
                          Resposta correta: {question.options[question.correctAnswer]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="flex items-center space-x-2 mx-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                <RotateCcw size={20} />
                <span>Tentar Novamente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <HelpCircle className="mx-auto text-blue-600 mb-4" size={48} />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz de Sustentabilidade</h1>
            <p className="text-xl text-gray-600">
              Teste seus conhecimentos sobre meio ambiente e sustentabilidade!
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} de {quizData.length}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h2>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === quizData.length - 1 ? 'Finalizar' : 'Próxima'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
