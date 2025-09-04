/*
  # Add agent fields to user profiles

  1. Changes
    - Add agent_number column to store the phone number from n8n
    - Add has_agent_number boolean to track if user has a number
    - Set default values appropriately

  2. Security
    - No changes to existing RLS policies
*/

-- Add agent_number column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'agent_number'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN agent_number text DEFAULT NULL;
  END IF;
END $$;

-- Add has_agent_number column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'has_agent_number'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN has_agent_number boolean DEFAULT false;
  END IF;
END $$;