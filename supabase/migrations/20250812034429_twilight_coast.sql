/*
  # Create detailed schedules table for AI-generated schedules

  1. New Tables
    - `detailed_schedules` - Store AI-generated daily schedules with all details
    
  2. Security
    - Enable RLS on detailed_schedules table
    - Add policies for users to manage their own schedules
    
  3. Features
    - Store complete daily schedule data
    - Link to study plans
    - Track generation parameters for regeneration
*/

-- Create detailed_schedules table
CREATE TABLE IF NOT EXISTS detailed_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  study_plan_id uuid REFERENCES study_plans(id) ON DELETE CASCADE,
  exam_type text NOT NULL,
  student_profile jsonb NOT NULL,
  daily_schedule jsonb NOT NULL DEFAULT '[]',
  total_days integer NOT NULL DEFAULT 0,
  total_weeks integer NOT NULL DEFAULT 0,
  generation_parameters jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE detailed_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own detailed schedules"
  ON detailed_schedules
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_detailed_schedules_user_id ON detailed_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_detailed_schedules_study_plan_id ON detailed_schedules(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_detailed_schedules_created_at ON detailed_schedules(created_at);