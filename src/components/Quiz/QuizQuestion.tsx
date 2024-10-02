import React from 'react';

interface QuizQuestionProps {
  question: string;
  isQuestionWord: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, isQuestionWord }) => (
  <div className="question-container">
    <p className="medical-question-prefix">
      Wat hoort er bij...
    </p>
    <h2 className="medical-word">
      {question}
    </h2>
  </div>
);

export default QuizQuestion;
