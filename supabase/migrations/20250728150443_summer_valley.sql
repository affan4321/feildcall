/*
  # Add payment status to user profiles

  1. Changes
    - Add payment_status column to user_profiles table
    - Set default value to 'pending'
    - Add check constraint for valid status values

  2. Security
    - No changes to existing RLS policies
*/

-- Add payment_status column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed'));
  END IF;
END $$;