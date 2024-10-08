export async function generateExplanation(prompt: string, signal?: AbortSignal): Promise<string> {
  try {
    console.log("Sending request to generate explanation");
    const response = await fetch('/api/generate-explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    });

    console.log("Received response:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not ok:', response.status, errorText);
      throw new Error(`Failed to generate explanation: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON in response");
    }

    if (!data.explanation) {
      console.error("No explanation in response:", data);
      throw new Error("No explanation in response");
    }

    return data.explanation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Explanation request was aborted');
        throw error;
      }
      console.error("Error generating explanation:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return "Error generating explanation. Please try again later.";
  }
}
