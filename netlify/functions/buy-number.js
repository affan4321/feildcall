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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const requestData = JSON.parse(event.body);

    // Validate required data
    if (!requestData.user_id || !requestData.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: user_id and email' }),
      };
    }

    // Forward the request to n8n webhook
    const n8nResponse = await fetch('https://disastershield.app.n8n.cloud/webhook/9013fe64-0429-4646-8fc3-18d4d16f6d22', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Check if n8n request was successful
    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook failed with status: ${n8nResponse.status}`);
    }

    // Get response from n8n (if any)
    let n8nData = {};
    try {
      const responseText = await n8nResponse.text();
      if (responseText) {
        n8nData = JSON.parse(responseText);
      }
    } catch (parseError) {
      // If response isn't JSON, that's okay
      console.log('N8N response is not JSON, continuing...');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Number purchase request submitted successfully',
        data: n8nData
      }),
    };
  } catch (error) {
    console.error('Buy number proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to submit number purchase request',
        details: error.message 
      }),
    };
  }
};