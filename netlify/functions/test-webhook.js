exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const webhookUrl = 'https://disastershield.app.n8n.cloud/webhook/fcb55f6d-30f7-4ad9-ae68-d13335e63d98';

  try {
    console.log('Testing webhook URL:', webhookUrl);
    
    // Test with a realistic payload similar to what buy-number sends
    const testPayload = {
      user_id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      company: 'Test Company',
      state: 'Florida',
      city: 'Miami',
      zip_code: '33101',
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
        message: response.ok ? 'Webhook is working!' : `Webhook returned ${response.status}: ${response.statusText}`,
        troubleshooting: response.status === 404 ? 'Check if n8n workflow is active and webhook method is set to POST' : 
                        response.status === 405 ? 'Check if webhook HTTP method matches (should be POST)' :
                        response.status >= 500 ? 'Server error in n8n workflow' : 'Unknown error'
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
        suggestions: [
          'Check if the webhook URL is correct',
          'Ensure the n8n workflow is active/published',
          'Verify the webhook HTTP method is set to POST',
          'Check if there are any authentication requirements'
        ]
      }),
    };
  }
};