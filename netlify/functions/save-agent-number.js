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
    // Clean the data - n8n sometimes sends values with "=" prefix
    const cleanedData = {
      phoneNumber: requestData.phoneNumber?.toString().replace(/^=/, '') || '',
      user_id: requestData.user_id?.toString().replace(/^=/, '') || '',
      friendlyName: requestData.friendlyName?.toString().replace(/^=/, '') || ''
    };

    if (!cleanedData.phoneNumber || !cleanedData.user_id) {
      console.error('Missing required fields from n8n:', { 
        phoneNumber: !!cleanedData.phoneNumber,
        user_id: !!cleanedData.user_id,
        originalData: requestData
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
      user_id: cleanedData.user_id,
      phoneNumber: cleanedData.phoneNumber,
      friendlyName: cleanedData.friendlyName
    });

    // First, let's check if the user exists
    console.log('Checking if user exists in user_profiles table...');
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name')
      .eq('id', cleanedData.user_id)
      .single();

    if (checkError) {
      console.error('Error checking user existence:', checkError);
      if (checkError.code === 'PGRST116') {
        // No rows returned
        console.error('User not found in database. Available users:');
        
        // Let's see what users exist (for debugging)
        const { data: allUsers, error: listError } = await supabase
          .from('user_profiles')
          .select('id, email, first_name, last_name')
          .limit(10);
        
        if (!listError && allUsers) {
          console.log('First 10 users in database:', allUsers);
        }
        
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            error: 'User not found in user_profiles table',
            user_id: cleanedData.user_id,
            debug_info: {
              total_users_checked: allUsers?.length || 0,
              sample_users: allUsers?.slice(0, 3) || []
            }
          }),
        };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to check user existence',
          details: checkError.message 
        }),
      };
    }

    console.log('User found:', existingUser);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        agent_number: cleanedData.phoneNumber,
        has_agent_number: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', cleanedData.user_id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to update user profile',
          details: error.message,
          user_id: cleanedData.user_id
        }),
      };
    }

    if (!data || data.length === 0) {
      console.error('Update succeeded but no data returned. This should not happen.');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Update succeeded but no data returned',
          user_id: cleanedData.user_id,
          debug_info: 'This indicates a database inconsistency'
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
          user_id: cleanedData.user_id,
          agent_number: cleanedData.phoneNumber,
          friendly_name: cleanedData.friendlyName,
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