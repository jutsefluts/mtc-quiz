import { useState } from 'react';

export default function TestOpenAI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testOpenAI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testOpenAI');  // Changed from test-openai-key to testOpenAI
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred. Check console.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test OpenAI</h1>
      <button onClick={testOpenAI} disabled={loading}>
        {loading ? 'Testing...' : 'Test OpenAI'}
      </button>
      <pre style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        {result || 'Result will appear here'}
      </pre>
    </div>
  );
}
