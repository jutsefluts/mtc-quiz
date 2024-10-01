import React, { useState, useEffect } from 'react'
import { fetchQuizWords } from '@/lib/supabase/api'
import { QuizWord } from '@/types/quiz'

const Quiz: React.FC = () => {
  const [words, setWords] = useState<QuizWord[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    async function loadWords() {
      try {
        const quizWords = await fetchQuizWords(20)
        setWords(quizWords)
        if (quizWords.length > 0) {
          setOptions(generateOptions(quizWords, 0))
        }
      } catch (error) {
        console.error('Error loading words:', error)
      }
    }
    loadWords()
  }, [])

  const generateOptions = (words: QuizWord[], currentIndex: number): string[] => {
    const correctAnswer = words[currentIndex].description
    const otherOptions = words
      .filter((_, index) => index !== currentIndex)
      .map(word => word.description)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
    return [correctAnswer, ...otherOptions].sort(() => 0.5 - Math.random())
  }

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
    setShowResult(true)
    if (option === words[currentQuestionIndex].description) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < words.length) {
      setCurrentQuestionIndex(nextIndex)
      setOptions(generateOptions(words, nextIndex))
      setSelectedOption(null)
      setShowResult(false)
    } else {
      alert(`Quiz finished! Your score: ${score}/${words.length}`)
    }
  }

  const getOptionClassName = (option: string) => {
    if (!showResult) return 'medical-option'
    if (option === selectedOption) {
      return option === words[currentQuestionIndex].description
        ? 'medical-option medical-option-correct'
        : 'medical-option medical-option-incorrect'
    }
    return 'medical-option'
  }

  if (words.length === 0) {
    return <div className="medical-loading">Loading quiz words...</div>
  }

  const currentWord = words[currentQuestionIndex]

  return (
    <div className="medical-container">
      <h2 className="medical-title">{currentWord.word}</h2>
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(option)}
            disabled={showResult}
            className={getOptionClassName(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleNextQuestion}
        className="medical-next-button"
        disabled={!showResult}
      >
        Next Question
      </button>
      <p className="medical-score">Score: {score}/{currentQuestionIndex + 1}</p>
    </div>
  )
}

export default Quiz
