import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { generateExplanation } from "@/utils/openai";

interface QuizWord {
  id: number;
  word: string;
  description: string;
}

interface UserWordPerformance {
  id: string;
  user_id: string;
  word_id: string;
  correct_attempts: number;
  total_attempts: number;
  last_review_date: string;
  next_review_date: string;
}

export default function Quiz() {
  const [quizWords, setQuizWords] = useState<QuizWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchQuizWords();
    getUser();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchQuizWords() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_words')
        .select('*');

      if (error) throw error;
      if (data && data.length > 0) {
        // Shuffle all words and select the first 5
        const shuffledWords = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuizWords(shuffledWords);
        setOptions(generateOptions(shuffledWords[0].word, shuffledWords));
      } else {
        console.log('No quiz words found');
        setQuizWords([]);
      }
    } catch (error) {
      console.error('Error fetching quiz words:', error);
      setQuizWords([]);
    } finally {
      setIsLoading(false);
    }
  }

  function generateOptions(correctWord: string, allWords: QuizWord[]): string[] {
    const options = [correctWord];
    const availableWords = allWords.filter(word => word.word !== correctWord);
    while (options.length < 3 && availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const randomWord = availableWords[randomIndex].word;
      if (!options.includes(randomWord)) {
        options.push(randomWord);
        availableWords.splice(randomIndex, 1);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }

  async function handleAnswer(selectedOption: string) {
    setSelectedOption(selectedOption);
    setIsLoading(true);

    const currentWord = quizWords[currentWordIndex];
    const isCorrect = selectedOption === currentWord.word;

    if (isCorrect) {
      setScore(score + 1);
    }

    try {
      if (!isCorrect) {
        const prompt = `Woord: ${currentWord.word}
Beschrijving: ${currentWord.description}
Gekozen antwoord: ${selectedOption}

Geef een korte uitleg (maximaal 2 zinnen) in het Nederlands waarom dit antwoord onjuist is en wat het juiste woord betekent.`;

        const aiExplanation = await generateExplanation(prompt);
        setExplanation(aiExplanation);
      }

      if (user) {
        await updateUserWordPerformance(user.id, currentWord.id.toString(), isCorrect);
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation('Kan op dit moment geen uitleg genereren.');
    }

    setIsLoading(false);
    setShowResult(true);
  }

  async function updateUserWordPerformance(userId: string, wordId: string, isCorrect: boolean) {
    const now = new Date().toISOString();
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 1); // Set next review to tomorrow

    const { data, error } = await supabase
      .from('user_word_performance')
      .select('*')
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user word performance:', error);
      return;
    }

    if (data) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_word_performance')
        .update({
          correct_attempts: isCorrect ? data.correct_attempts + 1 : data.correct_attempts,
          total_attempts: data.total_attempts + 1,
          last_review_date: now,
          next_review_date: nextReviewDate.toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating user word performance:', updateError);
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_word_performance')
        .insert({
          user_id: userId,
          word_id: wordId,
          correct_attempts: isCorrect ? 1 : 0,
          total_attempts: 1,
          last_review_date: now,
          next_review_date: nextReviewDate.toISOString()
        });

      if (insertError) {
        console.error('Error inserting user word performance:', insertError);
      }
    }
  }

  function handleNextWord() {
    if (currentWordIndex < quizWords.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setOptions(generateOptions(quizWords[nextIndex].word, quizWords));
      setSelectedOption('');
      setShowResult(false);
      setExplanation('');
    } else {
      // Quiz finished logic here
    }
  }

  if (isLoading) {
    return <div>Loading quiz words...</div>;
  }

  if (quizWords.length === 0) {
    return <div>No quiz words available. Please try again later.</div>;
  }

  const currentWord = quizWords[currentWordIndex];

  return (
    <div className="medical-container">
      <h2 className="medical-title">{currentWord.description}</h2>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={showResult || isLoading}
            className={`medical-option ${
              showResult
                ? option === currentWord.word
                  ? 'medical-option-correct'
                  : selectedOption === option
                  ? 'medical-option-incorrect'
                  : ''
                : ''
            }`}
          >
            {option}
            {showResult && option === currentWord.word && (
              <span className="medical-option-icon">✓</span>
            )}
            {showResult && option === selectedOption && option !== currentWord.word && (
              <span className="medical-option-icon">✗</span>
            )}
          </button>
        ))}
      </div>
      {isLoading && <p className="medical-loading">Bezig met verwerken...</p>}
      {showResult && (
        <div className="result">
          {explanation && <p className="mt-4">{explanation}</p>}
          {currentWordIndex < quizWords.length - 1 ? (
            <button onClick={handleNextWord} className="medical-next-button">
              Volgend Woord
            </button>
          ) : (
            <p className="medical-score">Quiz afgerond! Jouw score: {score}/{quizWords.length}</p>
          )}
        </div>
      )}
    </div>
  );
}