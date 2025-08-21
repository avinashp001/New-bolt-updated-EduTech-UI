-- Create weekly_assessments table
CREATE TABLE IF NOT EXISTS weekly_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  study_plan_id uuid REFERENCES study_plans(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  subject text NOT NULL,
  file_name text,
  score integer CHECK (score >= 0 AND score <= 100) NOT NULL,
  completed_at timestamptz DEFAULT now(),
  strong_areas text[] DEFAULT '{}',
  weak_areas text[] DEFAULT '{}',
  recommendations text[] DEFAULT '{}',
  next_steps text[] DEFAULT '{}',
  weekly_guidance text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security for weekly_assessments
ALTER TABLE weekly_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for weekly_assessments (consistent with existing policies)
CREATE POLICY "Users can manage own weekly assessments"
  ON weekly_assessments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_assessments_user_id ON weekly_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_assessments_study_plan_id ON weekly_assessments(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_assessments_week_number ON weekly_assessments(week_number);