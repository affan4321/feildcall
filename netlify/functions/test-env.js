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

  try {
    const envVars = {
      SUPER_ADMIN_SECRET: process.env.SUPER_ADMIN_SECRET ? 'SET' : 'NOT SET',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      // Show first few characters of secret for debugging (if set)
      SECRET_PREVIEW: process.env.SUPER_ADMIN_SECRET ? 
        process.env.SUPER_ADMIN_SECRET.substring(0, 3) + '...' : 
        'NOT SET'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Environment variables check',
        environment: envVars,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to check environment',
        details: error.message
      }),
    };
  }
};