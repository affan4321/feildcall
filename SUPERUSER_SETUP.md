# How to Create a Superuser in FieldCall™

## Method 1: Direct Database Update (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com
   - Login to your account
   - Select your FieldCall project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Command**
   ```sql
   UPDATE user_profiles 
   SET role = 'super_admin' 
   WHERE email = 'your-admin@email.com';
   ```
   
   **Replace `your-admin@email.com` with the actual email address**

4. **Verify the Update**
   ```sql
   SELECT email, role FROM user_profiles WHERE role = 'super_admin';
   ```

## Method 2: Using API Function

1. **Set Environment Variable in Netlify**
   - Go to Netlify Dashboard
   - Navigate to Site Settings > Environment Variables
   - Add: `SUPER_ADMIN_SECRET` = `your-secret-key-here`

2. **Make API Call**
   ```bash
   curl -X POST https://fieldcall.ai/.netlify/functions/set-super-admin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your-admin@email.com",
       "secret": "your-secret-key-here"
     }'
   ```

## Method 3: Using Browser Console

1. **Open your site**: https://fieldcall.ai
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Run this JavaScript**:
   ```javascript
   fetch('/.netlify/functions/set-super-admin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'your-admin@email.com',
       secret: 'your-secret-key-here'
     })
   }).then(r => r.json()).then(console.log);
   ```

## Verification Steps

1. **Login with the superuser account**
2. **You should be automatically redirected to `/admin`**
3. **You should see the admin dashboard with user management**
4. **The header should show a crown icon indicating super admin status**

## Troubleshooting

- **User not found**: Make sure the email exists in `user_profiles` table
- **No redirect**: Clear browser cache and try again
- **Access denied**: Check that the role was updated correctly in database

## Security Notes

- Only give super admin access to trusted users
- Super admins can promote/demote other users
- Keep your secret key secure if using API method