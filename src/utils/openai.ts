export async function generateExplanation(prompt: string, signal?: AbortSignal): Promise<string> {
  try {
    const response = await fetch('/api/generate-explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to generate explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw error; // Re-throw AbortError to be caught in the component
      }
      console.error("Error generating explanation:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return "Error generating explanation. Please try again later.";
  }
}
