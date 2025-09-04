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
    // Parse request body from n8n HTTP Request node
    let requestData;
    try {
      requestData = JSON.parse(event.body);
      console.log('Received data from n8n:', JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    // Validate required data from n8n HTTP Request node
    if (!requestData.phoneNumber || !requestData.user_id) {
      console.error('Missing required fields from n8n:', { 
        phoneNumber: !!requestData.phoneNumber,
        user_id: !!requestData.user_id
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: phoneNumber and user_id are required' 
        }),
      };
    }

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase not configured' }),
      };
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    // Update user profile with agent number
    console.log('Updating user profile with agent number:', {
      user_id: requestData.user_id,
      phoneNumber: requestData.phoneNumber,
      friendlyName: requestData.friendlyName
    });

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        agent_number: requestData.phoneNumber,
        has_agent_number: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.user_id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to update user profile',
          details: error.message 
        }),
      };
    }

    if (!data || data.length === 0) {
      console.error('No user found with ID:', requestData.user_id);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'User not found',
          user_id: requestData.user_id 
        }),
      };
    }

    console.log('Successfully updated user profile:', data[0]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Agent number saved successfully',
        data: {
          user_id: requestData.user_id,
          agent_number: requestData.phoneNumber,
          friendly_name: requestData.friendlyName,
          updated_profile: data[0]
        }
      }),
    };
  } catch (error) {
    console.error('Unexpected error in save-agent-number function:', error);
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