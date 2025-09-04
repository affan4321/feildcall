exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const webhookUrl = 'https://disastershield.app.n8n.cloud/webhook/9013fe64-0429-4646-8fc3-18d4d16f6d22';

  try {
    console.log('Testing webhook URL:', webhookUrl);
    
    // Test with a simple payload
    const testPayload = {
      test: true,
      message: 'Test from FieldCall webhook tester',
      timestamp: new Date().toISOString()
    };

    console.log('Sending test payload:', JSON.stringify(testPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FieldCall-Webhook-Tester/1.0',
      },
      body: JSON.stringify(testPayload),
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

    let responseText = '';
    try {
      responseText = await response.text();
      console.log('Webhook response body:', responseText);
    } catch (textError) {
      console.error('Could not read response text:', textError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        webhook_url: webhookUrl,
        status: response.status,
        status_text: response.statusText,
        ok: response.ok,
        response_body: responseText,
        test_payload: testPayload,
        message: response.ok ? 'Webhook is working!' : 'Webhook returned an error'
      }),
    };
  } catch (error) {
    console.error('Webhook test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to test webhook',
        details: error.message,
        webhook_url: webhookUrl,
        suggestion: 'Check if the webhook URL is correct and the n8n workflow is active'
      }),
    };
  }
};