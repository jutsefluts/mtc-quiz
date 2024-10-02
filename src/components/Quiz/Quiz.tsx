import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { generateExplanation } from "@/utils/openai";
import { motion, AnimatePresence } from 'framer-motion';
import QuizQuestion from './QuizQuestion';
import QuizOptions from './QuizOptions';
import QuizFeedback from './QuizFeedback';
import QuizResult from './QuizResult';

interface Word {
  id: number;
  word: string;
  description: string;
}

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<'start' | 'inProgress' | 'end'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Word | null>(null);
  const [isQuestionWord, setIsQuestionWord] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);

  const supabase = createClientComponentClient();

  const explanationRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    if (quizState === 'inProgress') {
      setExplanation(null);
      setFeedback(null);
      setupNewQuestion();
    }
  }, [questionKey, quizState]);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  const startQuiz = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(loadingInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const wordsLoaded = await fetchWords();
      clearInterval(loadingInterval);
      
      if (wordsLoaded) {
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setQuizState('inProgress');
          nextQuestion();
        }, 500);
      } else {
        throw new Error('Geen woorden geladen');
      }
    } catch (error) {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingProgress(0);
      setFeedback("Er konden geen quiz woorden worden geladen. Probeer het later opnieuw.");
      console.error("Error starting quiz:", error);
    }
  };

  const endQuiz = () => {
    setQuizState('end');
    checkBadges();
  };

  const restartQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setProgress(0);
    setBadges([]);
    setQuizState('start');
  };

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase.from('quiz_words').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const shuffledWords = data.sort(() => 0.5 - Math.random()).slice(0, Math.min(10, data.length));
        setWords(shuffledWords);
        return true;
      } else {
        console.log('Niet genoeg quiz woorden gevonden');
        return false;
      }
    } catch (error) {
      console.error('Fout bij het ophalen van quiz woorden:', error);
      return false;
    }
  };

  const setupNewQuestion = () => {
    if (questionCount < words.length) {
      const newQuestion = words[questionCount];
      setCurrentQuestion(newQuestion);
      
      const showWordAsQuestion = Math.random() < 0.5;
      setIsQuestionWord(showWordAsQuestion);
      
      let correctAnswer: string;
      let otherOptions: string[];

      if (showWordAsQuestion) {
        correctAnswer = newQuestion.description;
        otherOptions = words
          .filter(w => w.id !== newQuestion.id)
          .map(w => w.description);
      } else {
        correctAnswer = newQuestion.word;
        otherOptions = words
          .filter(w => w.id !== newQuestion.id)
          .map(w => w.word);
      }

      otherOptions = otherOptions
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const allOptions = [correctAnswer, ...otherOptions].sort(() => 0.5 - Math.random());

      setOptions(allOptions);
      setQuestionCount(questionCount + 1);
      setShowResult(false);
      setSelectedOption(null);
      setProgress((questionCount + 1) / words.length * 100);
    } else {
      endQuiz();
    }
  };

  const nextQuestion = () => {
    // Cancel any ongoing explanation request
    if (explanationRequestRef.current) {
      explanationRequestRef.current.abort();
    }

    setExplanation(null);
    setFeedback(null);
    setQuestionKey(prevKey => prevKey + 1);
  };

  const handleAnswer = async (selectedOption: string) => {
    setSelectedOption(selectedOption);
    const isCorrect = selectedOption === (isQuestionWord ? currentQuestion?.description : currentQuestion?.word);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("Correct! Goed gedaan!");
    } else {
      setFeedback(`Helaas, dat is niet juist. Het correcte antwoord is: ${isQuestionWord ? currentQuestion?.description : currentQuestion?.word}`);
    }

    setShowResult(true);

    if (user && currentQuestion) {
      await updateUserWordPerformance(user.id, currentQuestion.id.toString(), isCorrect);
    }

    if (currentQuestion) {
      // Cancel any ongoing explanation request
      if (explanationRequestRef.current) {
        explanationRequestRef.current.abort();
      }

      // Create a new AbortController for this request
      explanationRequestRef.current = new AbortController();

      const prompt = `Leg kort uit waarom "${currentQuestion.word}" en "${currentQuestion.description}" bij elkaar horen. Geef geen beoordeling over juist of onjuist, focus alleen op de uitleg.`;
      
      try {
        const explanation = await generateExplanation(prompt, explanationRequestRef.current.signal);
        setExplanation(explanation);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Explanation request was cancelled');
        } else {
          console.error('Error generating explanation:', error);
          setExplanation("Er kon geen uitleg worden gegenereerd. Probeer het later opnieuw.");
        }
      }
    }
  };

  const checkBadges = () => {
    const newBadges = [];
    if (score === words.length) newBadges.push('Perfect Score');
    if (score / words.length >= 0.8) newBadges.push('Expert');
    setBadges(newBadges);
  };

  const updateUserWordPerformance = async (userId: string, wordId: string, isCorrect: boolean) => {
    // Implementeer deze functie om de gebruikersprestaties bij te werken
  };

  if (isLoading) {
    return <div className="medical-container">Bezig met laden van de quiz...</div>;
  }

  return (
    <div className="medical-container">
      {quizState === 'start' && (
        <div className="start-screen">
          <h1 className="medical-title">Medische Terminologie Quiz</h1>
          <p className="mb-4">Test je kennis van medische termen!</p>
          {!isLoading ? (
            <button onClick={startQuiz} className="medical-button">
              Start Quiz
            </button>
          ) : (
            <div className="loading-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p>Laden van quiz vragen: {loadingProgress}%</p>
            </div>
          )}
          {feedback && <p className="mt-4 text-red-500">{feedback}</p>}
        </div>
      )}

      {quizState === 'inProgress' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={questionKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentQuestion && (
              <>
                <QuizQuestion 
                  question={isQuestionWord ? currentQuestion.word : currentQuestion.description}
                  isQuestionWord={isQuestionWord}
                />
                <QuizOptions
                  options={options}
                  handleAnswer={handleAnswer}
                  selectedOption={selectedOption}
                  showResult={showResult}
                  correctAnswer={isQuestionWord ? currentQuestion.description : currentQuestion.word}
                />
                {showResult && (
                  <>
                    <QuizFeedback feedback={feedback} explanation={explanation} />
                    <button onClick={nextQuestion} className="medical-next-button">
                      Volgend Woord
                    </button>
                  </>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {quizState === 'end' && (
        <QuizResult
          score={score}
          totalQuestions={words.length}
          badges={badges}
          restartQuiz={restartQuiz}
        />
      )}
    </div>
  );
};

export default Quiz;