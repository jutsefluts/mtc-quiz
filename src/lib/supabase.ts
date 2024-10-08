import { createClient } from '@supabase/supabase-js'
import { QuizWord } from '@/types/quiz'

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 5) + '...')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchQuizWords(count: number = 20): Promise<QuizWord[]> {
  console.log('Fetching quiz words from Supabase...')
  const { data, error } = await supabase
    .from('quiz_words')
    .select('id, word, description')  // Added 'id' to the selection
    
  if (error) {
    console.error('Error fetching quiz words:', error)
    throw error
  }
  
  // Shuffle the array and slice to get the desired number of words
  const shuffled = data ? data.sort(() => 0.5 - Math.random()) : []
  const selected = shuffled.slice(0, count)
  
  console.log('Fetched quiz words:', selected)
  return selected
}

export { supabase }
