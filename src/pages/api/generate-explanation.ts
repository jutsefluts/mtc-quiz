import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API route called");

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.error('OPENAI_API_KEY is not set');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  console.log("OpenAI API Key is set");

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: "Je bent een behulpzame assistent die korte, duidelijke uitleg geeft in het Nederlands over medische termen. Leg de relatie tussen woorden en hun beschrijvingen uit zonder te oordelen over juist of onjuist. Beperk je antwoorden tot maximaal twee zinnen." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const explanation = completion.choices[0].message.content?.trim() || "Geen uitleg gegenereerd.";
    res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({ message: 'Fout bij het genereren van de uitleg' });
  }
}
