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
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
      console.log('Parsed request data:', JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    // Validate required data
    if (!requestData.user_id || !requestData.email) {
      console.error('Missing required fields:', { 
        user_id: !!requestData.user_id, 
        email: !!requestData.email 
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: user_id and email' }),
      };
    }

    // Log the payload being sent for debugging
    console.log('Payload being sent to n8n webhook:', JSON.stringify(requestData, null, 2));

    // Forward the request to n8n webhook
    let n8nResponse;
    try {
      n8nResponse = await fetch('https://disastershield.app.n8n.cloud/webhook/9013fe64-0429-4646-8fc3-18d4d16f6d22', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('N8N response status:', n8nResponse.status);
      console.log('N8N response headers:', Object.fromEntries(n8nResponse.headers.entries()));
    } catch (fetchError) {
      console.error('Fetch error to n8n:', fetchError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to connect to n8n webhook',
          details: fetchError.message 
        }),
      };
    }

    // Check if n8n request was successful
    if (!n8nResponse.ok) {
      console.error('N8N webhook failed:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText
      });
      
      let errorText = '';
      try {
        errorText = await n8nResponse.text();
        console.error('N8N error response:', errorText);
      } catch (textError) {
        console.error('Could not read n8n error response:', textError);
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: `N8N webhook failed with status: ${n8nResponse.status}`,
          details: errorText || n8nResponse.statusText
        }),
      };
    }

    // Get response from n8n (if any)
    let n8nData = {};
    try {
      const responseText = await n8nResponse.text();
      console.log('N8N response text:', responseText);
      
      if (responseText && responseText.trim()) {
        try {
          n8nData = JSON.parse(responseText);
          console.log('N8N parsed response:', n8nData);
        } catch (parseError) {
          console.log('N8N response is not JSON, treating as text:', responseText);
          n8nData = { message: responseText };
        }
      }
    } catch (responseError) {
      console.error('Error reading n8n response:', responseError);
      // Continue anyway, this is not critical
    }

    console.log('Success! Returning response to frontend');
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
    console.error('Unexpected error in buy-number function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
    };
  }
};