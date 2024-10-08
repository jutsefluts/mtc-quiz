import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  console.log("API route called");

  let prompt;
  try {
    const body = await request.json();
    prompt = body.prompt;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.error('OPENAI_API_KEY is not set');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  console.log("OpenAI API Key is set");

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Je bent een behulpzame assistent die korte, duidelijke uitleg geeft in het Nederlands over medische termen. Leg de relatie tussen woorden en hun beschrijvingen uit zonder te oordelen over juist of onjuist. Beperk je antwoorden tot maximaal twee zinnen." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const explanation = completion.choices[0].message.content?.trim() || "Geen uitleg gegenereerd.";
    console.log("Generated explanation:", explanation);
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json({ message: 'Fout bij het genereren van de uitleg', error: String(error) }, { status: 500 });
  }
}
