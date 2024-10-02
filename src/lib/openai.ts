export async function generateExplanation(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "Error generating explanation. Please try again later.";
  }
}
