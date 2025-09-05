/*
  # Create Super Admin User

  1. New Changes
    - Insert hardcoded super admin user into user_profiles
    - Set role to 'super_admin'
    - Use predefined credentials for single super admin

  2. Security
    - Super admin has full access to admin dashboard
    - Can manage all users and roles
*/

-- Insert super admin user (only if doesn't exist)
INSERT INTO user_profiles (
  id,
  email,
  first_name,
  last_name,
  company,
  business_type,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@fieldcall.ai',
  'Super',
  'Admin',
  'FieldCall Admin',
  'other',
  'super_admin',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  updated_at = now();