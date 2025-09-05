/*
  # Add user roles system

  1. New Changes
    - Add role column to user_profiles table
    - Set default role to 'user'
    - Add check constraint for valid roles
    - Create index for role-based queries

  2. Security
    - No changes to existing RLS policies
    - Role field is readable by authenticated users
*/

-- Add role column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
  END IF;
END $$;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Update existing users to have 'user' role if null
UPDATE user_profiles SET role = 'user' WHERE role IS NULL;