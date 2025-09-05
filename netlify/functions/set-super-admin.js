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
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { email, secret } = requestData;

    // Check secret key (you should set this in your environment variables)
    const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET || 'your-super-secret-key-here';
    
    if (secret !== SUPER_ADMIN_SECRET) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid secret key' }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase service role key not configured' }),
      };
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Update user role to super_admin
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: 'super_admin' })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to update user role',
          details: error.message 
        }),
      };
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found with that email' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `User ${email} has been set as super admin`,
        user: data[0]
      }),
    };
  } catch (error) {
    console.error('Error in set-super-admin function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
    };
  }
};