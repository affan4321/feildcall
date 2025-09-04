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
      console.log('Making request to n8n webhook:', 'https://disastershield.app.n8n.cloud/webhook/fcb55f6d-30f7-4ad9-ae68-d13335e63d98');
      console.log('Request payload:', JSON.stringify(requestData, null, 2));
      
      n8nResponse = await fetch('https://disastershield.app.n8n.cloud/webhook/fcb55f6d-30f7-4ad9-ae68-d13335e63d98', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FieldCall-Netlify-Function/1.0',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('N8N response status:', n8nResponse.status);
      console.log('N8N response headers:', Object.fromEntries(n8nResponse.headers.entries()));
      
      // Log the response URL to make sure we're hitting the right endpoint
      console.log('N8N response URL:', n8nResponse.url);
    } catch (fetchError) {
      console.error('Fetch error to n8n:', fetchError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to connect to n8n webhook',
          details: fetchError.message,
          webhook_url: 'https://disastershield.app.n8n.cloud/webhook/fcb55f6d-30f7-4ad9-ae68-d13335e63d98'
        }),
      };
    }

    // Check if n8n request was successful
    if (!n8nResponse.ok) {
      console.error('N8N webhook failed:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        url: n8nResponse.url
      });
      
      let errorText = '';
      try {
        errorText = await n8nResponse.text();
        console.error('N8N error response:', errorText);
      } catch (textError) {
        console.error('Could not read n8n error response:', textError);
      }
      
      return {
        statusCode: 502, // Bad Gateway - more appropriate for upstream service errors
        headers,
        body: JSON.stringify({ 
          error: `N8N webhook returned ${n8nResponse.status}: ${n8nResponse.statusText}`,
          details: errorText || n8nResponse.statusText,
          webhook_url: 'https://disastershield.app.n8n.cloud/webhook/fcb55f6d-30f7-4ad9-ae68-d13335e63d98',
          suggestion: n8nResponse.status === 404 ? 'Check if the n8n workflow is active and the webhook URL is correct' : 
                     n8nResponse.status === 405 ? 'Check if the webhook HTTP method is set to POST' :
                     'Check n8n workflow configuration'
        }),
      };
    }

    // Get response from n8n - this should contain the phone number
    let n8nData = {};
    try {
      const responseText = await n8nResponse.text();
      console.log('N8N response text:', responseText);
      
      if (responseText && responseText.trim()) {
        try {
          n8nData = JSON.parse(responseText);
          console.log('N8N parsed response:', n8nData);
          
          // If n8n returns success and phone number, save it to Supabase
          if (n8nData.success && n8nData.phoneNumber) {
            console.log('N8N returned phone number, saving to Supabase...');
            
            // Call our save-agent-number function
            try {
              const saveResponse = await fetch(`${process.env.URL || 'https://fieldcall.ai'}/.netlify/functions/save-agent-number`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...n8nData,
                  user_id: requestData.user_id,
                  email: requestData.email
                }),
              });
              
              const saveResult = await saveResponse.json();
              console.log('Save agent number result:', saveResult);
              
              if (!saveResponse.ok) {
                console.error('Failed to save agent number:', saveResult);
                // Don't fail the whole request, just log the error
              }
            } catch (saveError) {
              console.error('Error calling save-agent-number function:', saveError);
              // Don't fail the whole request, just log the error
            }
          }
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