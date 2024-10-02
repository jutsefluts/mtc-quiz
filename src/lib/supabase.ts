import { createClient } from '@supabase/supabase-js'
import { QuizWord } from '@/types/quiz'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchQuizWords() {
  const { data, error } = await supabase
    .from('quiz_words')
    .select('word, description')
  
  if (error) {
    console.error('Error fetching quiz words:', error)
    return []
  }
  
  return data || []
}

export async function getQuizWords(): Promise<QuizWord[]> {
  const { data, error } = await supabase
    .from('quiz_words')
    .select('*')

  if (error) {
    console.error('Error fetching quiz words:', error)
    return []
  }

  return data || []
}

// Voeg hier eventuele andere Supabase-gerelateerde functies toe
