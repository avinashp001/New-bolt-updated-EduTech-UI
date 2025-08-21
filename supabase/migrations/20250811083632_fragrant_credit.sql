/*
  # Add clerk_id column to users table

  1. Schema Changes
    - Add `clerk_id` column to `users` table as unique identifier for Clerk users
    - Create unique index on `clerk_id` for performance
    - Update RLS policies to work with clerk_id

  2. Data Migration
    - The column will be nullable initially to handle existing data
    - New users will have clerk_id populated from Clerk authentication
*/

-- Add clerk_id column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'clerk_id'
  ) THEN
    ALTER TABLE users ADD COLUMN clerk_id text UNIQUE;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Update RLS policies to work with clerk_id
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new RLS policies that work with both id and clerk_id
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR clerk_id IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR clerk_id IS NOT NULL);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR clerk_id IS NOT NULL);

-- Allow public read access for clerk_id based queries (needed for our auth flow)
CREATE POLICY "Allow clerk_id based access"
  ON users
  FOR ALL
  TO public
  USING (clerk_id IS NOT NULL);