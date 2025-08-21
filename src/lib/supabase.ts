// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Database types
// export interface User {
//   id: string;
//   email: string;
//   full_name: string;
//   target_exam: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface StudySession {
//   id: string;
//   user_id: string;
//   subject: string;
//   duration_minutes: number;
//   topics_covered: string[];
//   performance_score: number;
//   created_at: string;
// }

// export interface StudyPlan {
//   id: string;
//   user_id: string;
//   exam_type: string;
//   total_duration_weeks: number;
//   subjects: string[];
//   daily_hours: number;
//   milestones: any[];
//   created_at: string;
//   updated_at: string;
// }

// export interface ProgressReport {
//   id: string;
//   user_id: string;
//   subject: string;
//   completion_percentage: number;
//   weak_areas: string[];
//   strong_areas: string[];
//   recommendations: string[];
//   last_updated: string;
// }

// export interface UploadedMaterial {
//   id: string;
//   user_id: string;
//   filename: string;
//   file_path: string;
//   extracted_content: string;
//   processed_topics: string[];
//   exam_relevance_score: number;
//   created_at: string;
// }

// export interface DetailedSchedule {
//   id: string;
//   user_id: string;
//   study_plan_id?: string;
//   exam_type: string;
//   student_profile: any;
//   daily_schedule: any[];
//   total_days: number;
//   total_weeks: number;
//   generation_parameters: any;
//   created_at: string;
//   updated_at: string;
// }

// export interface WeeklyAssessment {
//   id: string;
//   user_id: string;
//   study_plan_id?: string;
//   week_number: number;
//   subject: string;
//   file_name?: string;
//   score: number;
//   completed_at: string;
//   strong_areas?: string[];
//   weak_areas?: string[];
//   recommendations?: string[];
//   next_steps?: string[];
//   weekly_guidance?: string;
//   created_at: string;
//   updated_at: string;
// }


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name: string;
  target_exam: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  topics_covered: string[];
  performance_score: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  exam_type: string;
  total_duration_weeks: number;
  subjects: string[];
  daily_hours: number;
  milestones: any[];
  created_at: string;
  updated_at: string;
}

export interface ProgressReport {
  id: string;
  user_id: string;
  subject: string;
  completion_percentage: number;
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
  last_updated: string;
}

export interface UploadedMaterial {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  extracted_content: string;
  processed_topics: string[];
  exam_relevance_score: number;
  created_at: string;
}

export interface DetailedSchedule {
  id: string;
  user_id: string;
  study_plan_id?: string;
  exam_type: string;
  student_profile: any;
  daily_schedule: any[];
  total_days: number;
  total_weeks: number;
  generation_parameters: any;
  created_at: string;
  updated_at: string;
}

export interface WeeklyAssessment {
  id: string;
  user_id: string;
  study_plan_id?: string;
  week_number: number;
  subject: string;
  file_name?: string;
  score: number;
  completed_at: string;
  strong_areas?: string[];
  weak_areas?: string[];
  recommendations?: string[];
  next_steps?: string[];
  weekly_guidance?: string;
  created_at: string;
  updated_at: string;
}

// NEW: Interface for Quiz Attempts
export interface QuizAttempt {
  id: string;
  user_id: string;
  subject: string;
  topic?: string;
  score_percentage: number; // Actual percentage score
  time_taken_minutes: number;
  total_questions: number;
  correct_answers: number;
  weak_concepts?: string[]; // AI identified weak concepts
  strong_concepts?: string[]; // AI identified strong concepts
  attempt_details?: any; // Store full quiz data if needed
  created_at: string;
}

// NEW: Interface for Theory Study Logs
export interface TheoryStudyLog {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  duration_minutes: number;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
}
