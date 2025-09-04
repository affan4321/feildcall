exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase service role key not configured' }),
      };
    }

    // Use service role key to bypass RLS for server-side operations
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all users from user_profiles
    console.log('Fetching users from user_profiles table...');
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, created_at, has_agent_number, agent_number')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching users:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to fetch users',
          details: error.message 
        }),
      };
    }

    console.log(`Found ${users?.length || 0} users in database`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        total_users: users?.length || 0,
        users: users || [],
        message: 'Users fetched successfully'
      }),
    };
  } catch (error) {
    console.error('Unexpected error in debug-users function:', error);
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