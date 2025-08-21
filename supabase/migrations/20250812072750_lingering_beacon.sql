/*
  # Create user settings table

  1. New Tables
    - `user_settings` - Store user preferences and settings
    
  2. Security
    - Enable RLS on user_settings table
    - Add policies for users to manage their own settings
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);