import React from 'react';

interface QuizOptionsProps {
  options: string[];
  handleAnswer: (option: string) => void;
  selectedOption: string | null;
  showResult: boolean;
  correctAnswer: string;
}

const QuizOptions: React.FC<QuizOptionsProps> = ({ 
  options, 
  handleAnswer, 
  selectedOption, 
  showResult, 
  correctAnswer 
}) => (
  <div className="medical-options">
    {options.map((option, index) => (
      <button
        key={index}
        onClick={() => handleAnswer(option)}
        className={`medical-option ${
          showResult && selectedOption === option
            ? selectedOption === correctAnswer
              ? 'medical-option-correct'
              : 'medical-option-incorrect'
            : ''
        }`}
        disabled={showResult}
      >
        {option}
      </button>
    ))}
  </div>
);

export default QuizOptions;
