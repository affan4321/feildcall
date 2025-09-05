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

    const { email, password, secret } = requestData;

    // Check secret key
    const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET;
    
    // Debug logging (remove in production)
    console.log('Environment check:', {
      hasSecret: !!SUPER_ADMIN_SECRET,
      secretLength: SUPER_ADMIN_SECRET?.length || 0,
      receivedSecret: secret,
      match: secret === SUPER_ADMIN_SECRET
    });
    
    if (!SUPER_ADMIN_SECRET) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'SUPER_ADMIN_SECRET environment variable not set' }),
      };
    }
    
    if (secret !== SUPER_ADMIN_SECRET) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid secret key',
          debug: {
            expected_length: SUPER_ADMIN_SECRET.length,
            received_length: secret?.length || 0
          }
        }),
      };
    }

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    // Initialize Supabase client with service role key
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase service role key not configured' }),
      };
    }

    // Use service role key to create users (bypasses email confirmation)
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if user already exists in auth.users
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingAuthUser?.users?.find(u => u.email === email);

    let authUser;
    if (userExists) {
      console.log('Auth user already exists:', email);
      authUser = userExists;
    } else {
      // Create user in Supabase Auth (bypasses email confirmation)
      console.log('Creating new auth user:', email);
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to create auth user',
            details: authError.message 
          }),
        };
      }

      authUser = newAuthUser.user;
      console.log('Auth user created successfully:', authUser.id);
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', checkError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to check existing profile',
          details: checkError.message 
        }),
      };
    }

    let profile;
    if (existingProfile) {
      // Update existing profile to super_admin
      console.log('Updating existing profile to super_admin');
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ 
          role: 'super_admin',
          id: authUser.id, // Ensure the profile is linked to the auth user
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to update user profile',
            details: updateError.message 
          }),
        };
      }

      profile = updatedProfile;
    } else {
      // Create new profile
      console.log('Creating new user profile');
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authUser.id,
          email: email,
          first_name: 'Super',
          last_name: 'Admin',
          company: 'FieldCall Admin',
          business_type: 'other',
          role: 'super_admin',
          phone: '+1-555-000-0000',
          city: 'Admin',
          state: 'Admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to create user profile',
            details: profileError.message 
          }),
        };
      }

      profile = newProfile;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Super admin account created/updated successfully`,
        user: {
          id: authUser.id,
          email: authUser.email,
          role: profile.role,
          created_at: profile.created_at
        }
      }),
    };
  } catch (error) {
    console.error('Error in create-admin-account function:', error);
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