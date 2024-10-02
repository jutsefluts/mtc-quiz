import type { NextApiRequest, NextApiResponse } from 'next'
import { generateExplanation } from '../../utils/openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API Route: OpenAI API Key:", process.env.OPENAI_API_KEY ? "Set" : "Not set");
  try {
    const explanation = await generateExplanation("Say this is a test");

    res.status(200).json({ 
      success: true, 
      message: explanation,
      apiKeySet: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error("Error in testOpenAI:", error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      apiKeySet: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    });
  }
}
