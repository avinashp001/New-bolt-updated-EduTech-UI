import React, { useState, useEffect } from 'react';
import { Calendar, Target, BookOpen, Brain, Clock, TrendingUp, Award, CheckCircle, AlertTriangle, Zap, User, MapPin, Star } from 'lucide-react';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useAuth } from '../../hooks/useAuth';
import { CustomScheduleGenerator } from '../../lib/customScheduleGenerator';
import { supabase } from '../../lib/supabase';
import { robustParseWithRetry } from "../../utils/jsonParser";

interface StudentProfile {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  weakSubjects: string[];
  strongSubjects: string[];
  preferredStudyTime: string;
  dailyAvailableHours: number;
  examDate: string;
  examType: string;
  subjects: string[];
  studyPattern: 'morning' | 'evening' | 'night' | 'flexible';
  concentrationSpan: number; // in minutes
  breakPreference: number; // in minutes
  revisionFrequency: 'daily' | 'weekly' | 'biweekly';
  mockTestFrequency: 'weekly' | 'biweekly' | 'monthly';
  previousExperience: 'first-attempt' | 'second-attempt' | 'multiple-attempts';
  targetScore: number; // percentage
}

interface DailySchedule {
  date: string;
  dayOfWeek: string;
  subjects: {
    subject: string;
    hours: number;
    timeSlot: string;
    topics: string[];
    priority: 'high' | 'medium' | 'low';
    studyType: 'new-concepts' | 'practice' | 'revision' | 'mock-test' | 'analysis';
    breakAfter: number;
  }[];
  totalHours: number;
  focusArea: string;
  motivationalNote: string;
  weeklyGoal: string;
}

const EnhancedScheduleGenerator: React.FC = () => {
  const { user } = useAuth();
  const { studyPlan, generateStudyPlan, loading, fetchStudyPlan } = useStudyPlan(user?.id);
  
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    currentLevel: 'intermediate',
    weakSubjects: [],
    strongSubjects: [],
    preferredStudyTime: 'morning',
    dailyAvailableHours: 6,
    examDate: '',
    examType: '',
    subjects: [],
    studyPattern: 'morning',
    concentrationSpan: 45,
    breakPreference: 15,
    revisionFrequency: 'weekly',
    mockTestFrequency: 'weekly',
    previousExperience: 'first-attempt',
    targetScore: 80
  });

  // add this effect near the top (after state definitions)
useEffect(() => {
  const raw = localStorage.getItem('onboardingProfile');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    setStudentProfile(prev => ({
      ...prev,
      examType: data.examType ?? prev.examType,
      examDate: data.targetDate ?? prev.examDate,
      subjects: Array.isArray(data.subjects) ? data.subjects : prev.subjects,
      dailyAvailableHours: data.dailyAvailableHours ?? prev.dailyAvailableHours,
      currentLevel: data.currentLevel ?? prev.currentLevel,
      weakSubjects: Array.isArray(data.weakSubjects) ? data.weakSubjects : prev.weakSubjects,
      preferredStudyTime: data.preferredStudyTime ?? prev.preferredStudyTime,
    }));
  } catch {}
  localStorage.removeItem('onboardingProfile'); // one-time prefill
}, []);


  // Check for existing schedule when component mounts or studyPlan changes
  useEffect(() => {
    if (studyPlan && studyPlan.milestones && studyPlan.milestones.length > 0) {
      // Check if the study plan has detailed schedule data
      const hasDetailedSchedule = studyPlan.milestones.some((milestone: any) => 
        milestone.dailySchedule && Array.isArray(milestone.dailySchedule)
      );
      
      if (hasDetailedSchedule) {
        // Extract the detailed schedule from milestones
        const scheduleData = studyPlan.milestones.find((milestone: any) => 
          milestone.dailySchedule && Array.isArray(milestone.dailySchedule)
        );
        
        if (scheduleData && scheduleData.dailySchedule) {
          setExistingSchedule(scheduleData.dailySchedule);
          setShowExistingSchedule(true);
        }
      }
    }
  }, [studyPlan]);

  // Fetch existing schedule from database when component mounts
  useEffect(() => {
    const fetchExistingSchedule = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('detailed_schedules')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching detailed schedule:', error);
          return;
        }

        if (data && data.length > 0) {
          const schedule = data[0];
          setExistingSchedule(schedule.daily_schedule);
          setShowExistingSchedule(true);
        }
      } catch (error) {
        console.error('Error fetching existing schedule:', error);
      }
    };

    fetchExistingSchedule();
  }, [user?.id]);

  const [generatedSchedule, setGeneratedSchedule] = useState<DailySchedule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [existingSchedule, setExistingSchedule] = useState<DailySchedule[] | null>(null);
  const [showExistingSchedule, setShowExistingSchedule] = useState(false);

  const examTypes = [
    'UPSC Civil Services',
    'SSC CGL',
    'Banking (SBI PO/Clerk)',
    'JEE Main/Advanced',
    'NEET',
    'CAT',
    'GATE',
    'Board Exams (Class 12)',
    'University Exams',
    'State PSC',
    'Railway Exams',
    'Defense Exams',
    'Teaching Exams (CTET/TET)',
    'Law Entrance (CLAT)',
    'Management Entrance (XAT/SNAP)'
  ];

  const subjectOptions: Record<string, string[]> = {
    'UPSC Civil Services': ['History', 'Geography', 'Polity', 'Economics', 'Current Affairs', 'Ethics', 'Public Administration', 'Optional Subject', 'Essay Writing', 'Answer Writing'],
    'SSC CGL': ['Quantitative Aptitude', 'English Language', 'General Intelligence & Reasoning', 'General Awareness', 'Statistics', 'Finance & Accounts'],
    'Banking (SBI PO/Clerk)': ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness', 'Computer Knowledge', 'Marketing', 'Management'],
    'JEE Main/Advanced': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology (Botany)', 'Biology (Zoology)'],
    'CAT': ['Quantitative Ability', 'Verbal Ability & Reading Comprehension', 'Data Interpretation & Logical Reasoning'],
    'GATE': ['Engineering Mathematics', 'General Aptitude', 'Technical Subject', 'Previous Year Papers'],
    'Board Exams (Class 12)': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Accountancy'],
    'University Exams': ['Core Subjects', 'Electives', 'Practical', 'Project Work', 'Assignments'],
    'State PSC': ['General Studies', 'Current Affairs', 'State Specific Topics', 'Optional Subject', 'Essay Writing'],
    'Railway Exams': ['Mathematics', 'General Intelligence & Reasoning', 'General Awareness', 'Technical Ability'],
    'Defense Exams': ['Mathematics', 'English', 'General Knowledge', 'Reasoning', 'Technical Knowledge'],
    'Teaching Exams (CTET/TET)': ['Child Development & Pedagogy', 'Language I', 'Language II', 'Mathematics', 'Environmental Studies', 'Social Studies', 'Science'],
    'Law Entrance (CLAT)': ['English Language', 'Current Affairs', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
    'Management Entrance (XAT/SNAP)': ['Verbal Ability', 'Logical Reasoning', 'Quantitative Ability', 'General Knowledge', 'Decision Making']
  };

  const handleSubjectToggle = (subject: string, type: 'selected' | 'weak' | 'strong') => {
    if (type === 'selected') {
      setStudentProfile(prev => ({
        ...prev,
        subjects: prev.subjects.includes(subject) 
          ? prev.subjects.filter(s => s !== subject)
          : [...prev.subjects, subject]
      }));
    } else if (type === 'weak') {
      setStudentProfile(prev => ({
        ...prev,
        weakSubjects: prev.weakSubjects.includes(subject) 
          ? prev.weakSubjects.filter(s => s !== subject)
          : [...prev.weakSubjects, subject]
      }));
    } else if (type === 'strong') {
      setStudentProfile(prev => ({
        ...prev,
        strongSubjects: prev.strongSubjects.includes(subject) 
          ? prev.strongSubjects.filter(s => s !== subject)
          : [...prev.strongSubjects, subject]
      }));
    }
  };

  const generateDetailedSchedule = async () => {
  if (!studentProfile.examType || studentProfile.subjects.length === 0 || !studentProfile.examDate || !user) {
    alert('Please fill in all required fields.');
    return;
  }

  setIsGenerating(true);

  try {
    // Calculate total weeks until exam
    const examDate = new Date(studentProfile.examDate);
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const totalWeeks = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (totalDays <= 0) {
      alert('Exam date should be in the future.');
      return;
    }

    // Generate AI-powered detailed schedule
    const parsedSchedule = await robustParseWithRetry(() =>
      AIService.generateDetailedSchedule(studentProfile, totalWeeks, totalDays)
    );

    if (!parsedSchedule || !parsedSchedule.dailySchedule) {
      alert("❌ Could not generate a valid schedule. Please try again.");
      return;
    }

    const fullSchedule = parsedSchedule.dailySchedule || [];
    console.log("✅ Final AI schedule after extension:", fullSchedule);
    setGeneratedSchedule(fullSchedule);

    // 🔥 Clear old progress + sessions before saving new schedule
    try {
      await supabase.from("study_sessions")
        .delete()
        .eq("user_id", user.id);

      await supabase.from("progress_reports")
        .delete()
        .eq("user_id", user.id);

      console.log("🧹 Old sessions & progress cleared for fresh start.");
    } catch (clearError) {
      console.error("⚠️ Failed to clear old sessions/progress:", clearError);
    }

    // Save the detailed schedule to the database
    try {
      const { data: newSchedule, error: scheduleError } = await supabase
        .from("detailed_schedules")
        .insert([{
          user_id: user.id,
          exam_type: studentProfile.examType,
          student_profile: studentProfile,
          daily_schedule: fullSchedule,
          total_days: totalDays,
          total_weeks: totalWeeks,
          generation_parameters: {
            dailyHours: studentProfile.dailyAvailableHours,
            subjects: studentProfile.subjects,
            weakSubjects: studentProfile.weakSubjects,
            studyPattern: studentProfile.studyPattern,
            targetDate: studentProfile.examDate,
          }
        }])
        .select()
        .single();

      if (scheduleError) {
        console.error("Error saving detailed schedule:", scheduleError);
      } else {
        console.log("✅ New schedule saved:", newSchedule);
      }

      // Also save/update the study plan
      await generateStudyPlan(
        studentProfile.examType,
        studentProfile.subjects,
        studentProfile.dailyAvailableHours,
        studentProfile.examDate,
        studentProfile
      );
    } catch (error) {
      console.error("Error saving schedule:", error);
    }

    setShowExistingSchedule(false); // Hide existing schedule when new one is generated
  } catch (error) {
    console.error("Error generating schedule:", error);
    alert("Error generating schedule. Please try again.");
  } finally {
    setIsGenerating(false);
  }
};

 
  // const generateFallbackSchedule = (totalDays: number): { dailySchedule: DailySchedule[] } => {
  //   const schedule: DailySchedule[] = [];
  //   const today = new Date();
    
  //   for (let i = 0; i < totalDays; i++) { // Generate for full duration
  //     const currentDate = new Date(today);
  //     currentDate.setDate(today.getDate() + i);
      
  //     const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  //     const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
      
  //     // Rotate subjects based on day
  //     const subjectIndex = i % studentProfile.subjects.length;
  //     const primarySubject = studentProfile.subjects[subjectIndex];
  //     const secondarySubject = studentProfile.subjects[(subjectIndex + 1) % studentProfile.subjects.length];
      
  //     // Allocate hours based on subject priority
  //     const isPrimaryWeak = studentProfile.weakSubjects.includes(primarySubject);
  //     const primaryHours = isPrimaryWeak ? Math.ceil(studentProfile.dailyAvailableHours * 0.6) : Math.ceil(studentProfile.dailyAvailableHours * 0.5);
  //     const secondaryHours = studentProfile.dailyAvailableHours - primaryHours;
      
  //     const dailySchedule: DailySchedule = {
  //       date: currentDate.toISOString().split('T')[0],
  //       dayOfWeek,
  //       subjects: [
  //         {
  //           subject: primarySubject,
  //           hours: primaryHours,
  //           timeSlot: studentProfile.studyPattern === 'morning' ? '6:00 AM - 10:00 AM' : 
  //                    studentProfile.studyPattern === 'evening' ? '4:00 PM - 8:00 PM' : '8:00 PM - 12:00 AM',
  //           topics: [`${primarySubject} - Core Concepts`, `${primarySubject} - Practice Questions`],
  //           priority: isPrimaryWeak ? 'high' : 'medium',
  //           studyType: isWeekend ? 'revision' : 'new-concepts',
  //           breakAfter: studentProfile.breakPreference
  //         },
  //         {
  //           subject: secondarySubject,
  //           hours: secondaryHours,
  //           timeSlot: studentProfile.studyPattern === 'morning' ? '10:30 AM - 12:30 PM' : 
  //                    studentProfile.studyPattern === 'evening' ? '8:30 PM - 10:30 PM' : '1:00 AM - 3:00 AM',
  //           topics: [`${secondarySubject} - Quick Review`, `${secondarySubject} - Problem Solving`],
  //           priority: 'medium',
  //           studyType: 'practice',
  //           breakAfter: studentProfile.breakPreference
  //         }
  //       ],
  //       totalHours: studentProfile.dailyAvailableHours,
  //       focusArea: isPrimaryWeak ? `Strengthen ${primarySubject}` : `Balanced Study`,
  //       motivationalNote: `Day ${i + 1}: Stay consistent and focused!`,
  //       weeklyGoal: `Week ${Math.ceil((i + 1) / 7)}: Master fundamentals and build confidence`
  //     };
      
  //     schedule.push(dailySchedule);
  //   }
    
  //   return { dailySchedule: schedule };
  // };

  const generateFallbackSchedule = (
  totalDays: number,
  examType: string,
  profile: StudentProfile
): { dailySchedule: DailySchedule[] } => {
  const schedule: DailySchedule[] = [];
  const today = new Date();

  // SSC CGL syllabus with chapter names in exact exam-relevant order
  const syllabus: Record<string, Record<string, string[]>> = {
    "SSC CGL": {
      "Quantitative Aptitude": [
        "Number System – Properties & Classification",
        "LCM & HCF Applications",
        "Simplification & Approximation",
        "Percentage – Basics to Advanced",
        "Profit & Loss",
        "Simple & Compound Interest",
        "Ratio & Proportion",
        "Partnership Problems",
        "Time & Work",
        "Pipes & Cisterns",
        "Time, Speed & Distance",
        "Algebra – Linear & Quadratic",
        "Geometry – Lines, Triangles, Circles",
        "Mensuration – 2D & 3D Figures",
        "Trigonometry – Ratios & Heights",
        "Data Interpretation – Tables, Graphs"
      ],
      "English Language": [
        "Grammar – Parts of Speech",
        "Articles, Tenses & Modals",
        "Subject-Verb Agreement",
        "Pronouns & Prepositions",
        "Vocabulary – Synonyms & Antonyms",
        "One Word Substitutions",
        "Idioms & Phrases",
        "Error Spotting",
        "Sentence Improvement",
        "Active & Passive Voice",
        "Direct & Indirect Speech",
        "Cloze Test",
        "Reading Comprehension",
        "Para Jumbles"
      ],
      "General Intelligence & Reasoning": [
        "Analogy & Classification",
        "Series – Number, Letter, Figure",
        "Coding-Decoding",
        "Blood Relations",
        "Direction Sense",
        "Syllogism",
        "Venn Diagrams",
        "Statement & Conclusion",
        "Matrix & Word Formation",
        "Puzzle Solving",
        "Paper Folding & Cutting",
        "Non-Verbal Reasoning – Patterns"
      ],
      "General Awareness": [
        "History – Ancient, Medieval, Modern",
        "Geography – India & World",
        "Indian Polity – Constitution & Governance",
        "Economy – Basics & Current",
        "Physics – Basics",
        "Chemistry – Everyday Science",
        "Biology – Human & Plant",
        "Current Affairs – Last 1 Year",
        "Static GK – Important Days, Capitals"
      ]
    },
    "neet": {
      "Physics": [
        "Physical world and Measurement",
        "Kinematics",
        "Laws of Motion",
        "Work, Energy and Power",
        "System of Particles and Rotational Motion",
        "Gravitation",
        "Oscillations and Waves",
        "Thermodynamics",
        "Electrostatics",
        "Current Electricity",
        "Magnetic Effects of Current & Magnetism",
        "Electromagnetic Induction & Alternating Currents",
        "Optics",
        "Dual Nature of Matter and Radiation",
        "Atoms & Nuclei",
        "Electronic Devices"
      ],
      "Chemistry": [
        "Some Basic Concepts of Chemistry",
        "Structure of Atom",
        "Classification of Elements & Periodicity",
        "Chemical Bonding & Molecular Structure",
        "States of Matter",
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Hydrogen",
        "The s-block Element",
        "The p-block Element",
        "Organic Chemistry – Basic Principles & Techniques",
        "Hydrocarbons",
        "Environmental Chemistry"
      ],
      "Biology": [
        "Diversity of the Living World",
        "Structural Organisation in Animals and Plants",
        "Cell Structure and Function",
        "Plant Physiology",
        "Human Physiology",
        "Reproduction",
        "Genetics and Evolution",
        "Biology and Human Welfare",
        "Biotechnology and Its Applications",
        "Ecology and Environment"
      ]
    }
  };

  const subjects = Object.keys(syllabus[examType] || {}).length
    ? Object.keys(syllabus[examType])
    : profile.subjects;

  // Progress trackers for chapters
  const topicProgress: Record<string, number> = {};
  subjects.forEach(sub => (topicProgress[sub] = 0));

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });

    const dailySubjects = [];
    let hoursLeft = profile.dailyAvailableHours;

    // Cover every subject daily
    for (const subject of subjects) {
      const chapters = syllabus[examType]?.[subject] || [`${subject} – General Study`];
      const chapterIndex = topicProgress[subject] % chapters.length;
      const chapterName = chapters[chapterIndex];

      // Weak subjects get 40% more time
      const allocatedHours = profile.weakSubjects.includes(subject)
        ? Math.ceil((profile.dailyAvailableHours / subjects.length) * 1.4)
        : Math.ceil((profile.dailyAvailableHours / subjects.length) * 0.9);

      hoursLeft -= allocatedHours;
      topicProgress[subject]++;

      dailySubjects.push({
        subject,
        hours: allocatedHours,
        timeSlot: `${6 + dailySubjects.length * 2}:00 AM - ${6 + dailySubjects.length * 2 + allocatedHours}:00 AM`,
        topics: [chapterName, `${subject} – Practice & PYQs`],
        priority: profile.weakSubjects.includes(subject) ? "high" : "medium",
        studyType: dayOfWeek === "Sunday" ? "revision" : "new-concepts",
        breakAfter: profile.breakPreference
      });
    }

    // Weekly mock test & analysis
    if ((i + 1) % 7 === 0) {
      dailySubjects.push({
        subject: "Full Mock Test & Deep Analysis",
        hours: profile.dailyAvailableHours,
        timeSlot: "9:00 AM - 4:00 PM",
        topics: ["Simulated Exam Environment", "Error Log Review", "Weak Area Reinforcement"],
        priority: "high",
        studyType: "mock-test",
        breakAfter: 30
      });
    }

    schedule.push({
      date: currentDate.toISOString().split("T")[0],
      dayOfWeek,
      subjects: dailySubjects,
      totalHours: profile.dailyAvailableHours,
      focusArea: `Daily mastery of all SSC CGL subjects`,
      motivationalNote: `Day ${i + 1}: Consistency is the secret weapon of toppers.`,
      weeklyGoal: `Week ${Math.ceil((i + 1) / 7)}: Cover next set of chapters in all subjects`
    });
  }

  return { dailySchedule: schedule };
};

  
  
  
  
  const handleGenerateNewSchedule = () => {
    setShowExistingSchedule(false);
    setExistingSchedule(null);
    setGeneratedSchedule([]);
    setCurrentStep(1);
    setStudentProfile({
      ...studentProfile,
      examDate: '',
      subjects: [],
      weakSubjects: [],
      strongSubjects: []
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
              <p className="text-slate-600">Tell us about your exam and current preparation level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Exam *
                </label>
                <select
                  value={studentProfile.examType}
                  onChange={(e) => {
                    setStudentProfile(prev => ({
                      ...prev,
                      examType: e.target.value,
                      subjects: [],
                      weakSubjects: [],
                      strongSubjects: []
                    }));
                  }}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your target exam</option>
                  {examTypes.map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={studentProfile.examDate}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, examDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Preparation Level
                </label>
                <select
                  value={studentProfile.currentLevel}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, currentLevel: e.target.value as any }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner (Just started preparation)</option>
                  <option value="intermediate">Intermediate (Some preparation done)</option>
                  <option value="advanced">Advanced (Well-prepared, need optimization)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Previous Exam Experience
                </label>
                <select
                  value={studentProfile.previousExperience}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, previousExperience: e.target.value as any }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="first-attempt">First Attempt</option>
                  <option value="second-attempt">Second Attempt</option>
                  <option value="multiple-attempts">Multiple Attempts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Score (%): {studentProfile.targetScore}%
                </label>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={studentProfile.targetScore}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, targetScore: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Daily Available Hours: {studentProfile.dailyAvailableHours}h
                </label>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={studentProfile.dailyAvailableHours}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, dailyAvailableHours: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>2h</span>
                  <span>8h</span>
                  <span>16h</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Subject Selection & Analysis</h3>
              <p className="text-slate-600">Choose subjects and identify your strengths and weaknesses</p>
            </div>

            {studentProfile.examType && (
              <>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Select Subjects to Study *</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectOptions[studentProfile.examType]?.map(subject => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectToggle(subject, 'selected')}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          studentProfile.subjects.includes(subject)
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {studentProfile.subjects.length > 0 && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>Weak Subjects (Need Extra Focus)</span>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {studentProfile.subjects.map(subject => (
                          <button
                            key={subject}
                            onClick={() => handleSubjectToggle(subject, 'weak')}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              studentProfile.weakSubjects.includes(subject)
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                        <Star className="w-5 h-5 text-green-600" />
                        <span>Strong Subjects (Your Strengths)</span>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {studentProfile.subjects.map(subject => (
                          <button
                            key={subject}
                            onClick={() => handleSubjectToggle(subject, 'strong')}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              studentProfile.strongSubjects.includes(subject)
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Study Preferences & Patterns</h3>
              <p className="text-slate-600">Customize your study schedule based on your preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Study Time
                </label>
                <select
                  value={studentProfile.studyPattern}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, studyPattern: e.target.value as any }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="morning">Early Morning (5 AM - 10 AM)</option>
                  <option value="evening">Evening (4 PM - 9 PM)</option>
                  <option value="night">Night (8 PM - 1 AM)</option>
                  <option value="flexible">Flexible (Throughout Day)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Concentration Span: {studentProfile.concentrationSpan} minutes
                </label>
                <input
                  type="range"
                  min="25"
                  max="120"
                  step="5"
                  value={studentProfile.concentrationSpan}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, concentrationSpan: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>25 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Break Duration: {studentProfile.breakPreference} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={studentProfile.breakPreference}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, breakPreference: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5 min</span>
                  <span>15 min</span>
                  <span>30 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Revision Frequency
                </label>
                <select
                  value={studentProfile.revisionFrequency}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, revisionFrequency: e.target.value as any }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="daily">Daily Revision</option>
                  <option value="weekly">Weekly Revision</option>
                  <option value="biweekly">Bi-weekly Revision</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mock Test Frequency
                </label>
                <select
                  value={studentProfile.mockTestFrequency}
                  onChange={(e) => setStudentProfile(prev => ({ ...prev, mockTestFrequency: e.target.value as any }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="daily">Daily Mock Tests</option>
                  <option value="weekly">Weekly Mock Tests</option>
                  <option value="biweekly">Bi-weekly Mock Tests</option>
                  <option value="monthly">Monthly Mock Tests</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return studentProfile.examType && studentProfile.examDate && studentProfile.dailyAvailableHours > 0;
      case 2:
        return studentProfile.subjects.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Show existing schedule if available
  if (showExistingSchedule && existingSchedule && existingSchedule.length > 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Your Current Study Schedule</h2>
          </div>
          <p className="text-blue-100">
            Expert-curated daily schedule for {studyPlan?.exam_type} • {existingSchedule.length} days planned
          </p>
        </div>

        {/* Schedule Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{studyPlan?.subjects.length || 0}</div>
              <div className="text-sm text-slate-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{studyPlan?.daily_hours || 0}h</div>
              <div className="text-sm text-slate-600">Daily Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{existingSchedule.length}</div>
              <div className="text-sm text-slate-600">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{studyPlan?.total_duration_weeks || 0}</div>
              <div className="text-sm text-slate-600">Weeks</div>
            </div>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="space-y-4">
          <>
          <div className="flex items-center justify-between">
  {/* Left: Title */}
  <div className="flex items-center space-x-2">
    <Calendar className="w-6 h-6 text-blue-600" />
    <h3 className="text-xl font-bold text-slate-800">Daily Study Schedule</h3>
  </div>

  {/* Right: Tips grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {CustomScheduleGenerator.generateToppersStudyTips(
      examType ? {
        examType,
        subjects,
        weakSubjects,
        strongSubjects,
        dailyAvailableHours: dailyHours,
        currentLevel,
        studyPattern: preferredStudyTime,
        concentrationSpan: settings?.defaultStudyDuration || 60,
        breakPreference: settings?.breakInterval || 15,
        revisionFrequency: 'weekly' as const,
        mockTestFrequency: 'weekly' as const,
        examDate: targetDate,
        targetScore: 85,
        previousExperience: 'some' as const,
        learningStyle,
        contentPreference,
        motivationLevel,
        commonDistractions,
        shortTermGoal
      } : {
        examType: '',
        subjects: [],
        weakSubjects: [],
        strongSubjects: [],
        dailyAvailableHours: 6,
        currentLevel: 'intermediate' as const,
        studyPattern: 'morning' as const,
        concentrationSpan: 60,
        breakPreference: 15,
        revisionFrequency: 'weekly' as const,
        mockTestFrequency: 'weekly' as const,
        examDate: '',
        targetScore: 85,
        previousExperience: 'some' as const
      }
    ).slice(0, 6).map((tip, index) => (
      <div
        key={index}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
      >
        <div className="w-5 h-5 mt-1 text-blue-600">
          {tip.includes('80-20') ? '🎯' :
           tip.includes('Spaced') ? '🔄' :
           tip.includes('Active') ? '🧠' :
           tip.includes('Peak') ? '⏰' :
           tip.includes('Error') ? '📝' :
           tip.includes('Mock') ? '🎪' :
           tip.includes('Consistency') ? '💪' : '🎨'}
        </div>
              <Zap className="w-4 h-4" />
              <span>Generate New Schedule</span>
          </div>
        
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                📅 Complete {existingSchedule.length}-day schedule generated
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Showing all days from today until your exam date. Scroll down to see your complete study journey.
              </p>
            </div>

            
            {existingSchedule.map((day, index) => (
              <div key={day.date || index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">
                        {day.date ? new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : `Day ${index + 1}`}
                      </h4>
                      <p className="text-sm text-slate-600">{day.focusArea || 'Study Focus'}</p>
                      <p className="text-xs text-slate-500">Day {index + 1} of {existingSchedule.length}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{day.totalHours || 0}h</div>
                      <div className="text-sm text-slate-500">Total Study</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {(day.subjects || []).map((subjectPlan: any, subIndex: number) => (
                      <div key={subIndex} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          subjectPlan.priority === 'high' ? 'bg-red-100 text-red-600' :
                          subjectPlan.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-800">{subjectPlan.subject}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subjectPlan.priority === 'high' ? 'bg-red-100 text-red-800' :
                                subjectPlan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {subjectPlan.priority || 'medium'} priority
                              </span>
                              <span className="text-sm font-medium text-slate-600">{subjectPlan.hours || 0}h</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-slate-600 mb-2">
                            <strong>Time:</strong> {subjectPlan.timeSlot || 'TBD'} | 
                            <strong> Type:</strong> {(subjectPlan.studyType || 'study').replace('-', ' ')} |
                            <strong> Break:</strong> {subjectPlan.breakAfter || 15} min
                          </div>
                          
                          <div className="text-sm text-slate-600">
                            <strong>Topics:</strong> {(subjectPlan.topics || []).join(', ') || 'General topics'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {day.motivationalNote && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Daily Motivation:</strong> {day.motivationalNote}
                      </p>
                      {day.weeklyGoal && (
                        <p className="text-sm text-blue-700 mt-1">
                          <strong>🎯 Weekly Goal:</strong> {day.weeklyGoal}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
          </>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleGenerateNewSchedule}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Generate New Schedule
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Print Schedule
          </button>
        </div>
      </div>
    );
  }

  if (generatedSchedule.length > 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Your Personalized Study Schedule</h2>
          </div>
          <p className="text-green-100">
            Expert-curated daily schedule for {studentProfile.examType} • {generatedSchedule.length} days planned
          </p>
        </div>

        {/* Schedule Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{studentProfile.subjects.length}</div>
              <div className="text-sm text-slate-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{studentProfile.dailyAvailableHours}h</div>
              <div className="text-sm text-slate-600">Daily Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{studentProfile.weakSubjects.length}</div>
                    <div className="font-medium text-slate-800 text-sm" dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{studentProfile.targetScore}%</div>
              <div className="text-sm text-slate-600">Target Score</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Custom Algorithm Features</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ Syllabus-based topic progression from comprehensive exam database</li>
                <li>✅ Weak subject prioritization with 40% extra time allocation</li>
                <li>✅ Spaced repetition scheduling for long-term retention</li>
                <li>✅ Cognitive load optimization for maximum learning efficiency</li>
                <li>✅ Adaptive difficulty progression based on preparation phase</li>
                <li>✅ Mock test integration with performance analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Daily Study Schedule</span>
          </h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                🎉 Complete {generatedSchedule.length}-day schedule generated successfully!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your personalized study journey from today until exam day. Each day is carefully planned for optimal learning.
              </p>
            </div>
            
            {generatedSchedule.map((day, index) => (
              <div key={day.date} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-slate-600">{day.focusArea}</p>
                      <p className="text-xs text-slate-500">Day {index + 1} of {generatedSchedule.length}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{day.totalHours}h</div>
                      <div className="text-sm text-slate-500">Total Study</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {day.subjects.map((subjectPlan, subIndex) => (
                      <div key={subIndex} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          subjectPlan.priority === 'high' ? 'bg-red-100 text-red-600' :
                          subjectPlan.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-800">{subjectPlan.subject}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subjectPlan.priority === 'high' ? 'bg-red-100 text-red-800' :
                                subjectPlan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {subjectPlan.priority} priority
                              </span>
                              <span className="text-sm font-medium text-slate-600">{subjectPlan.hours}h</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-slate-600 mb-2">
                            <strong>Time:</strong> {subjectPlan.timeSlot} | 
                            <strong> Type:</strong> {subjectPlan.studyType.replace('-', ' ')} |
                            <strong> Break:</strong> {subjectPlan.breakAfter} min
                          </div>
                          
                          <div className="text-sm text-slate-600">
                            <strong>Topics:</strong> {subjectPlan.topics.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Daily Motivation:</strong> {day.motivationalNote}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>🎯 Weekly Goal:</strong> {day.weeklyGoal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setGeneratedSchedule([]);
              setCurrentStep(1);
            }}
            className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Generate New Schedule
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Print Schedule
          </button>
        </div>
      </div>
    );
  }

  // Show existing schedule option if available
  if (studyPlan && !showExistingSchedule && existingSchedule && existingSchedule.length > 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Existing Schedule Found</h2>
          <p className="text-slate-600 mb-6">
            You have an existing AI-generated schedule with {existingSchedule.length} days planned until your exam date.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📊 Your complete study schedule covers every day from today until your exam, 
              with personalized daily plans, time slots, and progress tracking.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowExistingSchedule(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Existing Schedule
            </button>
            <button
              onClick={handleGenerateNewSchedule}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Generate New Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{studyPlan ? 'Generate New Personalised Schedule' : 'Toppers Schedule Generator'}</h2>
        </div>
        <p className="text-indigo-100">
          {studyPlan ? 'Create a new personalized study schedule' : 'Get a personalized daily study schedule crafted by 20+ years of topper mentoring experience'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Subject Analysis' :
              'Study Preferences'
            }
          </h3>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceedToNextStep()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={generateDetailedSchedule}
            disabled={!canProceedToNextStep() || isGenerating}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Expert Schedule...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate My Expert Schedule</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Expert Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Expert Mentor Tips</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <p className="text-orange-700">
              <strong>Weak subjects get 40% more time</strong> - This is the secret of all toppers
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <p className="text-orange-700">
              <strong>Daily revision is mandatory</strong> - Memory retention increases by 80%
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <p className="text-orange-700">
              <strong>Mock tests every week</strong> - Builds exam temperament and confidence
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <p className="text-orange-700">
              <strong>Consistent timing</strong> - Creates powerful study habits and discipline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedScheduleGenerator;