/*
  # Create EduAI Platform Database Schema

  1. New Tables
    - `users` - User profiles with exam preferences
    - `study_sessions` - Individual study session records
    - `study_plans` - AI-generated personalized study plans
    - `progress_reports` - Subject-wise progress tracking
    - `uploaded_materials` - User uploaded study materials with AI analysis

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Create storage bucket for study materials

  3. Storage
    - Create bucket for study materials (PDFs, documents)
    - Set up proper access policies
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  target_exam text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  topics_covered text[] DEFAULT '{}',
  performance_score integer CHECK (performance_score >= 1 AND performance_score <= 10) DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Create study_plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exam_type text NOT NULL,
  total_duration_weeks integer NOT NULL DEFAULT 12,
  subjects text[] NOT NULL DEFAULT '{}',
  daily_hours integer NOT NULL DEFAULT 4,
  milestones jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create progress_reports table
CREATE TABLE IF NOT EXISTS progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  completion_percentage integer CHECK (completion_percentage >= 0 AND completion_percentage <= 100) DEFAULT 0,
  weak_areas text[] DEFAULT '{}',
  strong_areas text[] DEFAULT '{}',
  recommendations text[] DEFAULT '{}',
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id, subject)
);

-- Create uploaded_materials table
CREATE TABLE IF NOT EXISTS uploaded_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  file_path text NOT NULL,
  extracted_content text,
  processed_topics text[] DEFAULT '{}',
  exam_relevance_score integer CHECK (exam_relevance_score >= 1 AND exam_relevance_score <= 10) DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_materials ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Study sessions policies
CREATE POLICY "Users can read own study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions"
  ON study_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Study plans policies
CREATE POLICY "Users can read own study plans"
  ON study_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans"
  ON study_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans"
  ON study_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Progress reports policies
CREATE POLICY "Users can read own progress reports"
  ON progress_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress reports"
  ON progress_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress reports"
  ON progress_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Uploaded materials policies
CREATE POLICY "Users can read own uploaded materials"
  ON uploaded_materials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploaded materials"
  ON uploaded_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded materials"
  ON uploaded_materials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploaded materials"
  ON uploaded_materials
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject ON study_sessions(subject);

CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_user_id ON progress_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_user_id ON uploaded_materials(user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own materials"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own materials"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own materials"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own materials"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);