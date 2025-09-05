# FieldCall™ Admin Account Setup

## Creating the Super Admin Account

The super admin account can be created without going through the normal signup process using the `create-admin-account` Netlify function.

### Prerequisites

1. **Deploy the application** to Netlify
2. **Set environment variables** in Netlify dashboard:
   - `SUPER_ADMIN_SECRET` - A secure secret key for admin operations
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Method 1: Using curl (Recommended)

```bash
curl -X POST https://fieldcall.ai/.netlify/functions/create-admin-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fieldcall.ai",
    "password": "your-secure-admin-password",
    "secret": "your-super-admin-secret-key"
  }'
```

### Method 2: Using Browser Console

1. Open https://fieldcall.ai
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this JavaScript:

```javascript
fetch('/.netlify/functions/create-admin-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@fieldcall.ai',
    password: 'your-secure-admin-password',
    secret: 'your-super-admin-secret-key'
  })
}).then(r => r.json()).then(console.log);
```

### Method 3: Direct Database + Manual Auth User Creation

If the Netlify function doesn't work, you can create the admin manually:

1. **Create Auth User** in Supabase Dashboard:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password
   - Set "Auto Confirm User" to true

2. **Update Profile** in SQL Editor:
   ```sql
   -- First, get the user ID from auth.users
   SELECT id, email FROM auth.users WHERE email = 'admin@fieldcall.ai';
   
   -- Then update or insert the profile (replace USER_ID with actual ID)
   INSERT INTO user_profiles (
     id, email, first_name, last_name, company, business_type, role, phone, city, state
   ) VALUES (
     'USER_ID_FROM_ABOVE',
     'admin@fieldcall.ai',
     'Super',
     'Admin', 
     'FieldCall Admin',
     'other',
     'super_admin',
     '+1-555-000-0000',
     'Admin',
     'Admin'
   )
   ON CONFLICT (id) DO UPDATE SET
     role = 'super_admin',
     updated_at = now();
   ```

## What This Creates

The admin account will have:
- **Email**: admin@fieldcall.ai (or your chosen email)
- **Role**: super_admin
- **Access**: Full admin dashboard with user management
- **Login**: Can login normally at the website

## Verification

1. Go to https://fieldcall.ai
2. Click "Sign In" 
3. Login with the admin credentials
4. You should be automatically redirected to `/admin`
5. You should see the crown icon (👑) in the header
6. You should have access to user management features

## Security Notes

- Keep your `SUPER_ADMIN_SECRET` secure
- Use a strong password for the admin account
- The admin can promote/demote other users
- Only create admin accounts when necessary

## Troubleshooting

- **Function not found**: Make sure the site is deployed and functions are working
- **Invalid secret**: Check your `SUPER_ADMIN_SECRET` environment variable
- **Database errors**: Verify your Supabase service role key is correct
- **Login issues**: Clear browser cache and try again

## Environment Variables Required

```
SUPER_ADMIN_SECRET=your-secure-secret-key-here
VITE_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```