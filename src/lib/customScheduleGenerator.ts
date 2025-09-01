import { syllabusBank } from '../data/syllabusBank';

export interface StudentProfile {
  examType: string;
  subjects: string[];
  weakSubjects: string[];
  strongSubjects: string[];
  dailyAvailableHours: number;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  studyPattern: 'morning' | 'evening' | 'night' | 'flexible';
  concentrationSpan: number;
  breakPreference: number;
  revisionFrequency: 'daily' | 'weekly' | 'biweekly';
  mockTestFrequency: 'daily' | 'weekly' | 'biweekly';
  examDate: string;
  targetScore: number;
  previousExperience: 'none' | 'some' | 'extensive';
  learningStyle?: string;
  contentPreference?: string;
  motivationLevel?: string;
  commonDistractions?: string[];
  shortTermGoal?: string;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  subjects: SubjectSchedule[];
  totalHours: number;
  focusArea: string;
  motivationalNote: string;
  weeklyGoal: string;
  studyPhase: 'foundation' | 'building' | 'mastery' | 'revision' | 'final-prep';
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export interface SubjectSchedule {
  subject: string;
  hours: number;
  timeSlot: string;
  topics: string[];
  priority: 'high' | 'medium' | 'low';
  studyType: 'new-concepts' | 'practice' | 'revision' | 'mock-test' | 'analysis';
  breakAfter: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
}

export class CustomScheduleGenerator {
  private static readonly TOPPERS_PRINCIPLES = {
    // 80-20 Rule: 80% time on high-weightage topics
    HIGH_WEIGHTAGE_FOCUS: 0.8,
    
    // Weak subject gets 40% more time
    WEAK_SUBJECT_MULTIPLIER: 1.4,
    
    // Strong subject maintenance (prevent decay)
    STRONG_SUBJECT_MAINTENANCE: 0.7,
    
    // Spaced repetition intervals (days)
    SPACED_REPETITION: [1, 3, 7, 14, 30],
    
    // Daily study phases distribution
    PHASE_DISTRIBUTION: {
      foundation: 0.3,    // 30% foundation building
      building: 0.4,      // 40% concept building
      mastery: 0.2,       // 20% mastery & application
      revision: 0.1       // 10% continuous revision
    },
    
    // Weekly pattern (Mon-Sun)
    WEEKLY_PATTERN: {
      monday: { type: 'new-concepts', intensity: 0.9 },
      tuesday: { type: 'practice', intensity: 0.8 },
      wednesday: { type: 'new-concepts', intensity: 0.9 },
      thursday: { type: 'practice', intensity: 0.8 },
      friday: { type: 'integration', intensity: 0.7 },
      saturday: { type: 'revision', intensity: 0.6 },
      sunday: { type: 'mock-test', intensity: 0.8 }
    }
  };

  /**
   * Main method to generate complete study schedule
   */
  static generate(studentProfile: StudentProfile, totalDays: number): { dailySchedule: DaySchedule[] } {
    console.log('🎯 CustomScheduleGenerator: Starting generation for', studentProfile.examType);
    console.log('📊 Profile:', { 
      subjects: studentProfile.subjects, 
      weakSubjects: studentProfile.weakSubjects,
      dailyHours: studentProfile.dailyAvailableHours,
      totalDays 
    });

    // Validate inputs
    this.validateInputs(studentProfile, totalDays);

    // Get syllabus for the exam
    const syllabus = this.getSyllabusForExam(studentProfile.examType, studentProfile.subjects);
    
    // Calculate study phases and milestones
    const studyPhases = this.calculateStudyPhases(totalDays);
    
    // Create topic distribution plan
    const topicPlan = this.createTopicDistributionPlan(syllabus, studentProfile, totalDays);
    
    // Generate daily schedule
    const dailySchedule = this.generateDailySchedule(
      studentProfile, 
      totalDays, 
      studyPhases, 
      topicPlan
    );

    console.log('✅ CustomScheduleGenerator: Generated', dailySchedule.length, 'days of schedule');
    
    return { dailySchedule };
  }

  /**
   * Validate student profile and inputs
   */
  private static validateInputs(studentProfile: StudentProfile, totalDays: number): void {
    if (!studentProfile.examType) {
      throw new Error('Exam type is required');
    }
    
    if (!studentProfile.subjects || studentProfile.subjects.length === 0) {
      throw new Error('At least one subject is required');
    }
    
    if (totalDays < 7) {
      throw new Error('Minimum 7 days required for effective preparation');
    }
    
    if (studentProfile.dailyAvailableHours < 2 || studentProfile.dailyAvailableHours > 16) {
      throw new Error('Daily hours must be between 2 and 16');
    }
  }

  /**
   * Get syllabus topics for the exam and subjects
   */
  private static getSyllabusForExam(examType: string, subjects: string[]): Record<string, string[]> {
    const examSyllabus = syllabusBank[examType];
    
    if (!examSyllabus) {
      console.warn(`No syllabus found for ${examType}, using fallback topics`);
      return this.generateFallbackSyllabus(subjects);
    }

    const result: Record<string, string[]> = {};
    
    subjects.forEach(subject => {
      if (examSyllabus[subject]) {
        result[subject] = [...examSyllabus[subject]];
      } else {
        console.warn(`No syllabus found for subject ${subject} in ${examType}`);
        result[subject] = this.generateFallbackTopicsForSubject(subject);
      }
    });

    return result;
  }

  /**
   * Generate fallback syllabus when exam type not found
   */
  private static generateFallbackSyllabus(subjects: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    subjects.forEach(subject => {
      result[subject] = this.generateFallbackTopicsForSubject(subject);
    });
    
    return result;
  }

  /**
   * Generate fallback topics for a subject
   */
  private static generateFallbackTopicsForSubject(subject: string): string[] {
    const baseTopics = [
      'Fundamentals and Basic Concepts',
      'Core Principles and Theories',
      'Intermediate Applications',
      'Advanced Problem Solving',
      'Practical Applications',
      'Case Studies and Examples',
      'Integration with Other Topics',
      'Exam-Specific Strategies',
      'Previous Year Questions Analysis',
      'Mock Test Practice'
    ];

    return baseTopics.map(topic => `${subject} - ${topic}`);
  }

  /**
   * Calculate study phases based on total preparation time
   */
  private static calculateStudyPhases(totalDays: number): {
    foundation: { start: number; end: number };
    building: { start: number; end: number };
    mastery: { start: number; end: number };
    revision: { start: number; end: number };
    finalPrep: { start: number; end: number };
  } {
    const phases = this.TOPPERS_PRINCIPLES.PHASE_DISTRIBUTION;
    
    return {
      foundation: { 
        start: 0, 
        end: Math.floor(totalDays * phases.foundation) 
      },
      building: { 
        start: Math.floor(totalDays * phases.foundation), 
        end: Math.floor(totalDays * (phases.foundation + phases.building)) 
      },
      mastery: { 
        start: Math.floor(totalDays * (phases.foundation + phases.building)), 
        end: Math.floor(totalDays * (phases.foundation + phases.building + phases.mastery)) 
      },
      revision: { 
        start: Math.floor(totalDays * (phases.foundation + phases.building + phases.mastery)), 
        end: Math.floor(totalDays * 0.95) 
      },
      finalPrep: { 
        start: Math.floor(totalDays * 0.95), 
        end: totalDays 
      }
    };
  }

  /**
   * Create topic distribution plan across all days
   */
  private static createTopicDistributionPlan(
    syllabus: Record<string, string[]>, 
    studentProfile: StudentProfile, 
    totalDays: number
  ): Record<string, { topics: string[]; currentIndex: number; totalCycles: number }> {
    const plan: Record<string, { topics: string[]; currentIndex: number; totalCycles: number }> = {};
    
    studentProfile.subjects.forEach(subject => {
      const topics = syllabus[subject] || [];
      const isWeak = studentProfile.weakSubjects.includes(subject);
      
      // Calculate how many times we'll cycle through this subject's topics
      const subjectDays = Math.floor(totalDays / studentProfile.subjects.length);
      const cycles = isWeak ? Math.ceil(subjectDays / topics.length * 1.5) : Math.ceil(subjectDays / topics.length);
      
      plan[subject] = {
        topics: topics,
        currentIndex: 0,
        totalCycles: Math.max(1, cycles)
      };
    });

    return plan;
  }

  /**
   * Generate complete daily schedule
   */
  private static generateDailySchedule(
    studentProfile: StudentProfile,
    totalDays: number,
    studyPhases: any,
    topicPlan: Record<string, { topics: string[]; currentIndex: number; totalCycles: number }>
  ): DaySchedule[] {
    const schedule: DaySchedule[] = [];
    const today = new Date();
    
    // Track revision schedule for spaced repetition
    const revisionTracker: Record<string, Date[]> = {};
    
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayIndex);
      
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const weekNumber = Math.ceil((dayIndex + 1) / 7);
      
      // Determine study phase
      const studyPhase = this.getStudyPhase(dayIndex, studyPhases);
      
      // Get weekly pattern
      const weeklyPattern = this.TOPPERS_PRINCIPLES.WEEKLY_PATTERN[dayOfWeek as keyof typeof this.TOPPERS_PRINCIPLES.WEEKLY_PATTERN];
      
      // Generate subjects for this day
      const daySubjects = this.generateDaySubjects(
        studentProfile,
        dayIndex,
        weeklyPattern,
        studyPhase,
        topicPlan,
        revisionTracker,
        currentDate
      );
      
      // Create day schedule
      const daySchedule: DaySchedule = {
        date: currentDate.toISOString().split('T')[0],
        dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        subjects: daySubjects,
        totalHours: studentProfile.dailyAvailableHours,
        focusArea: this.getDayFocusArea(daySubjects, studyPhase),
        motivationalNote: this.getMotivationalNote(dayIndex, weekNumber, studyPhase, studentProfile),
        weeklyGoal: this.getWeeklyGoal(weekNumber, studyPhase, studentProfile),
        studyPhase,
        difficultyLevel: this.getDifficultyLevel(dayIndex, totalDays, studyPhase)
      };
      
      schedule.push(daySchedule);
      
      // Update revision tracker
      this.updateRevisionTracker(revisionTracker, daySubjects, currentDate);
    }

    return schedule;
  }

  /**
   * Generate subjects and topics for a specific day
   */
  private static generateDaySubjects(
    studentProfile: StudentProfile,
    dayIndex: number,
    weeklyPattern: any,
    studyPhase: string,
    topicPlan: Record<string, { topics: string[]; currentIndex: number; totalCycles: number }>,
    revisionTracker: Record<string, Date[]>,
    currentDate: Date
  ): SubjectSchedule[] {
    const subjects: SubjectSchedule[] = [];
    const isWeekend = weeklyPattern.type === 'revision' || weeklyPattern.type === 'mock-test';
    
    // Handle weekend mock tests
    if (weeklyPattern.type === 'mock-test' && studentProfile.mockTestFrequency !== 'daily') {
      return this.generateMockTestSchedule(studentProfile, currentDate);
    }
    
    // Calculate subject priorities and time allocation
    const subjectPriorities = this.calculateSubjectPriorities(studentProfile, studyPhase);
    const timeAllocation = this.calculateTimeAllocation(studentProfile, subjectPriorities);
    
    // Generate time slots
    const timeSlots = this.generateTimeSlots(studentProfile, timeAllocation);
    
    let slotIndex = 0;
    
    // Allocate subjects based on priority and time
    for (const { subject, priority, allocatedHours } of subjectPriorities) {
      if (slotIndex >= timeSlots.length || allocatedHours <= 0) break;
      
      const topics = this.getTopicsForDay(
        subject, 
        topicPlan[subject], 
        studyPhase, 
        weeklyPattern.type,
        dayIndex
      );
      
      const subjectSchedule: SubjectSchedule = {
        subject,
        hours: allocatedHours,
        timeSlot: timeSlots[slotIndex],
        topics,
        priority,
        studyType: this.getStudyType(weeklyPattern.type, studyPhase, priority),
        breakAfter: studentProfile.breakPreference,
        difficultyLevel: this.getTopicDifficulty(dayIndex, studyPhase),
        expectedOutcome: this.getExpectedOutcome(subject, topics, studyPhase)
      };
      
      subjects.push(subjectSchedule);
      slotIndex++;
      
      // Update topic plan index
      this.advanceTopicIndex(topicPlan[subject]);
    }
    
    // Add revision sessions based on spaced repetition
    const revisionSessions = this.generateRevisionSessions(
      studentProfile,
      revisionTracker,
      currentDate,
      timeSlots.slice(slotIndex)
    );
    
    subjects.push(...revisionSessions);
    
    return subjects;
  }

  /**
   * Calculate subject priorities based on weakness, importance, and phase
   */
  private static calculateSubjectPriorities(
    studentProfile: StudentProfile, 
    studyPhase: string
  ): { subject: string; priority: 'high' | 'medium' | 'low'; allocatedHours: number }[] {
    const priorities: { subject: string; priority: 'high' | 'medium' | 'low'; allocatedHours: number }[] = [];
    const totalSubjects = studentProfile.subjects.length;
    const baseHours = studentProfile.dailyAvailableHours / totalSubjects;
    
    studentProfile.subjects.forEach(subject => {
      const isWeak = studentProfile.weakSubjects.includes(subject);
      const isStrong = studentProfile.strongSubjects.includes(subject);
      
      let priority: 'high' | 'medium' | 'low' = 'medium';
      let hourMultiplier = 1;
      
      // Priority calculation based on toppers' strategy
      if (isWeak) {
        priority = 'high';
        hourMultiplier = this.TOPPERS_PRINCIPLES.WEAK_SUBJECT_MULTIPLIER;
      } else if (isStrong && studyPhase === 'revision') {
        priority = 'medium';
        hourMultiplier = this.TOPPERS_PRINCIPLES.STRONG_SUBJECT_MAINTENANCE;
      } else if (studyPhase === 'foundation' || studyPhase === 'building') {
        priority = 'high';
        hourMultiplier = 1.1;
      }
      
      // Adjust based on exam weightage (simplified heuristic)
      const examWeightage = this.getExamWeightage(studentProfile.examType, subject);
      hourMultiplier *= examWeightage;
      
      const allocatedHours = Math.max(0.5, Math.min(
        studentProfile.dailyAvailableHours * 0.6, // Max 60% of day for one subject
        baseHours * hourMultiplier
      ));
      
      priorities.push({ subject, priority, allocatedHours });
    });
    
    // Normalize hours to fit within daily limit
    const totalAllocated = priorities.reduce((sum, p) => sum + p.allocatedHours, 0);
    if (totalAllocated > studentProfile.dailyAvailableHours) {
      const scaleFactor = studentProfile.dailyAvailableHours / totalAllocated;
      priorities.forEach(p => {
        p.allocatedHours = Math.round(p.allocatedHours * scaleFactor * 10) / 10;
      });
    }
    
    // Sort by priority (high first)
    return priorities.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Calculate time allocation based on priorities
   */
  private static calculateTimeAllocation(
    studentProfile: StudentProfile,
    subjectPriorities: { subject: string; priority: 'high' | 'medium' | 'low'; allocatedHours: number }[]
  ): Record<string, number> {
    const allocation: Record<string, number> = {};
    
    subjectPriorities.forEach(({ subject, allocatedHours }) => {
      allocation[subject] = allocatedHours;
    });
    
    return allocation;
  }

  /**
   * Generate time slots based on study pattern and available hours
   */
  private static generateTimeSlots(
    studentProfile: StudentProfile, 
    timeAllocation: Record<string, number>
  ): string[] {
    const slots: string[] = [];
    const pattern = studentProfile.studyPattern;
    
    // Define time slot templates based on study pattern
    const timeTemplates = {
      morning: [
        '5:00 AM - 7:00 AM',   // Peak concentration
        '7:30 AM - 9:30 AM',   // High energy
        '10:00 AM - 12:00 PM', // Good focus
        '2:00 PM - 4:00 PM',   // Post-lunch
        '4:30 PM - 6:30 PM',   // Evening
        '7:00 PM - 9:00 PM'    // Night review
      ],
      evening: [
        '7:00 AM - 9:00 AM',   // Morning warm-up
        '10:00 AM - 12:00 PM', // Mid-morning
        '2:00 PM - 4:00 PM',   // Afternoon
        '5:00 PM - 7:00 PM',   // Peak evening
        '7:30 PM - 9:30 PM',   // Prime time
        '10:00 PM - 11:00 PM'  // Light review
      ],
      night: [
        '8:00 AM - 10:00 AM',  // Morning session
        '11:00 AM - 1:00 PM',  // Pre-lunch
        '3:00 PM - 5:00 PM',   // Afternoon
        '6:00 PM - 8:00 PM',   // Early evening
        '9:00 PM - 11:00 PM',  // Peak night
        '11:30 PM - 1:00 AM'   // Late night
      ],
      flexible: [
        '6:00 AM - 8:00 AM',
        '9:00 AM - 11:00 AM',
        '12:00 PM - 2:00 PM',
        '3:00 PM - 5:00 PM',
        '6:00 PM - 8:00 PM',
        '8:30 PM - 10:30 PM'
      ]
    };
    
    const templates = timeTemplates[pattern] || timeTemplates.flexible;
    
    // Calculate how many slots we need
    const totalHours = Object.values(timeAllocation).reduce((sum, hours) => sum + hours, 0);
    const slotsNeeded = Math.ceil(totalHours / 2); // Assuming 2-hour average per slot
    
    return templates.slice(0, Math.min(slotsNeeded, templates.length));
  }

  /**
   * Get topics for a specific day and subject
   */
  private static getTopicsForDay(
    subject: string,
    subjectPlan: { topics: string[]; currentIndex: number; totalCycles: number },
    studyPhase: string,
    studyType: string,
    dayIndex: number
  ): string[] {
    if (!subjectPlan || !subjectPlan.topics.length) {
      return [`${subject} - General Study`];
    }
    
    const topics: string[] = [];
    const allTopics = subjectPlan.topics;
    const currentIndex = subjectPlan.currentIndex;
    
    // Primary topic for the day
    const primaryTopic = allTopics[currentIndex % allTopics.length];
    topics.push(primaryTopic);
    
    // Add secondary topic based on study type and phase
    if (studyType === 'practice' || studyType === 'integration') {
      // Add a previous topic for practice
      const prevIndex = Math.max(0, currentIndex - 1);
      const secondaryTopic = allTopics[prevIndex % allTopics.length];
      if (secondaryTopic !== primaryTopic) {
        topics.push(`${secondaryTopic} - Practice & Application`);
      }
    }
    
    // Add phase-specific enhancements
    if (studyPhase === 'mastery') {
      topics.push(`${subject} - Advanced Problem Solving`);
    } else if (studyPhase === 'revision') {
      topics.push(`${subject} - Quick Revision & PYQs`);
    }
    
    return topics;
  }

  /**
   * Generate mock test schedule for weekends
   */
  private static generateMockTestSchedule(
    studentProfile: StudentProfile,
    currentDate: Date
  ): SubjectSchedule[] {
    const mockTests: SubjectSchedule[] = [];
    
    // Full-length mock test
    mockTests.push({
      subject: 'Full Mock Test',
      hours: Math.min(4, studentProfile.dailyAvailableHours * 0.6),
      timeSlot: this.getMockTestTimeSlot(studentProfile.studyPattern),
      topics: [
        `${studentProfile.examType} - Full Length Mock Test`,
        'Time Management Practice',
        'Exam Strategy Implementation'
      ],
      priority: 'high',
      studyType: 'mock-test',
      breakAfter: 30,
      difficultyLevel: 'hard',
      expectedOutcome: 'Simulate real exam conditions and identify improvement areas'
    });
    
    // Mock test analysis
    mockTests.push({
      subject: 'Mock Test Analysis',
      hours: Math.min(2, studentProfile.dailyAvailableHours * 0.3),
      timeSlot: this.getAnalysisTimeSlot(studentProfile.studyPattern),
      topics: [
        'Error Analysis & Pattern Recognition',
        'Weak Area Identification',
        'Strategy Refinement',
        'Next Week Planning'
      ],
      priority: 'high',
      studyType: 'analysis',
      breakAfter: 15,
      difficultyLevel: 'medium',
      expectedOutcome: 'Identify mistakes and create improvement strategy'
    });
    
    // Light revision if time permits
    const remainingHours = studentProfile.dailyAvailableHours - 
      mockTests.reduce((sum, test) => sum + test.hours, 0);
    
    if (remainingHours >= 1) {
      mockTests.push({
        subject: 'Light Revision',
        hours: remainingHours,
        timeSlot: this.getRevisionTimeSlot(studentProfile.studyPattern),
        topics: [
          'Quick Formula Review',
          'Important Concepts Recap',
          'Confidence Building'
        ],
        priority: 'low',
        studyType: 'revision',
        breakAfter: 10,
        difficultyLevel: 'easy',
        expectedOutcome: 'Maintain confidence and reinforce key concepts'
      });
    }
    
    return mockTests;
  }

  /**
   * Generate revision sessions based on spaced repetition
   */
  private static generateRevisionSessions(
    studentProfile: StudentProfile,
    revisionTracker: Record<string, Date[]>,
    currentDate: Date,
    availableSlots: string[]
  ): SubjectSchedule[] {
    const revisionSessions: SubjectSchedule[] = [];
    
    if (availableSlots.length === 0) return revisionSessions;
    
    // Check which topics need revision based on spaced repetition
    const topicsForRevision: string[] = [];
    
    Object.entries(revisionTracker).forEach(([topic, dates]) => {
      const lastStudied = dates[dates.length - 1];
      const daysSinceLastStudy = Math.floor(
        (currentDate.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Check if topic needs revision based on spaced repetition intervals
      if (this.TOPPERS_PRINCIPLES.SPACED_REPETITION.includes(daysSinceLastStudy)) {
        topicsForRevision.push(topic);
      }
    });
    
    // Create revision sessions if topics are due
    if (topicsForRevision.length > 0 && availableSlots.length > 0) {
      const revisionHours = Math.min(1, studentProfile.dailyAvailableHours * 0.2);
      
      revisionSessions.push({
        subject: 'Spaced Repetition Review',
        hours: revisionHours,
        timeSlot: availableSlots[0],
        topics: topicsForRevision.slice(0, 3), // Limit to 3 topics per session
        priority: 'medium',
        studyType: 'revision',
        breakAfter: 10,
        difficultyLevel: 'easy',
        expectedOutcome: 'Reinforce previously learned concepts through spaced repetition'
      });
    }
    
    return revisionSessions;
  }

  /**
   * Helper methods for schedule generation
   */
  private static getStudyPhase(dayIndex: number, studyPhases: any): 'foundation' | 'building' | 'mastery' | 'revision' | 'final-prep' {
    if (dayIndex <= studyPhases.foundation.end) return 'foundation';
    if (dayIndex <= studyPhases.building.end) return 'building';
    if (dayIndex <= studyPhases.mastery.end) return 'mastery';
    if (dayIndex <= studyPhases.revision.end) return 'revision';
    return 'final-prep';
  }

  private static getExamWeightage(examType: string, subject: string): number {
    // Simplified weightage based on common exam patterns
    const weightageMap: Record<string, Record<string, number>> = {
      'UPSC Civil Services': {
        'History': 1.2,
        'Geography': 1.1,
        'Polity': 1.3,
        'Economics': 1.2,
        'Current Affairs': 1.4,
        'Ethics': 1.0
      },
      'JEE Main/Advanced': {
        'Mathematics': 1.3,
        'Physics': 1.2,
        'Chemistry': 1.1
      },
      'NEET': {
        'Biology': 1.4,
        'Chemistry': 1.2,
        'Physics': 1.0
      },
      'SSC CGL': {
        'Quantitative Aptitude': 1.3,
        'General Intelligence & Reasoning': 1.2,
        'English Language': 1.1,
        'General Awareness': 1.0
      }
    };
    
    return weightageMap[examType]?.[subject] || 1.0;
  }

  private static getStudyType(
    weeklyType: string, 
    studyPhase: string, 
    priority: 'high' | 'medium' | 'low'
  ): 'new-concepts' | 'practice' | 'revision' | 'mock-test' | 'analysis' {
    if (weeklyType === 'mock-test') return 'mock-test';
    if (weeklyType === 'revision') return 'revision';
    if (weeklyType === 'practice') return 'practice';
    
    if (studyPhase === 'foundation') return 'new-concepts';
    if (studyPhase === 'building') return priority === 'high' ? 'new-concepts' : 'practice';
    if (studyPhase === 'mastery') return 'practice';
    if (studyPhase === 'revision') return 'revision';
    
    return 'new-concepts';
  }

  private static getDifficultyLevel(
    dayIndex: number, 
    totalDays: number, 
    studyPhase: string
  ): 'easy' | 'medium' | 'hard' {
    const progressRatio = dayIndex / totalDays;
    
    if (studyPhase === 'foundation') return 'easy';
    if (studyPhase === 'building') return progressRatio < 0.5 ? 'easy' : 'medium';
    if (studyPhase === 'mastery') return 'hard';
    if (studyPhase === 'revision') return 'medium';
    if (studyPhase === 'final-prep') return 'hard';
    
    return 'medium';
  }

  private static getTopicDifficulty(dayIndex: number, studyPhase: string): 'easy' | 'medium' | 'hard' {
    if (studyPhase === 'foundation') return 'easy';
    if (studyPhase === 'building') return dayIndex % 3 === 0 ? 'medium' : 'easy';
    if (studyPhase === 'mastery') return dayIndex % 2 === 0 ? 'hard' : 'medium';
    return 'medium';
  }

  private static getDayFocusArea(subjects: SubjectSchedule[], studyPhase: string): string {
    const highPrioritySubjects = subjects.filter(s => s.priority === 'high').map(s => s.subject);
    
    if (highPrioritySubjects.length === 1) {
      return `Master ${highPrioritySubjects[0]} - ${studyPhase} phase`;
    } else if (highPrioritySubjects.length > 1) {
      return `Multi-subject focus: ${highPrioritySubjects.join(' & ')} - ${studyPhase} phase`;
    }
    
    const allSubjects = subjects.map(s => s.subject);
    return `Balanced study across ${allSubjects.join(', ')} - ${studyPhase} phase`;
  }

  private static getMotivationalNote(
    dayIndex: number, 
    weekNumber: number, 
    studyPhase: string, 
    studentProfile: StudentProfile
  ): string {
    const motivationalMessages = {
      foundation: [
        `Day ${dayIndex + 1}: Building strong foundations - every expert was once a beginner! 🏗️`,
        `Day ${dayIndex + 1}: Consistency beats intensity. You're laying the groundwork for success! 💪`,
        `Day ${dayIndex + 1}: Foundation phase - master the basics to conquer the advanced! 🎯`,
        `Day ${dayIndex + 1}: Strong roots grow mighty trees. Your foundation is your strength! 🌳`
      ],
      building: [
        `Day ${dayIndex + 1}: Building momentum - you're getting stronger every day! 🚀`,
        `Day ${dayIndex + 1}: Concept building phase - connect the dots and see the bigger picture! 🧩`,
        `Day ${dayIndex + 1}: Your hard work is compounding. Keep building! 📈`,
        `Day ${dayIndex + 1}: Every concept mastered brings you closer to your goal! 🎯`
      ],
      mastery: [
        `Day ${dayIndex + 1}: Mastery phase - you're becoming an expert! Transform knowledge into wisdom! 🧠`,
        `Day ${dayIndex + 1}: Excellence is a habit. You're developing the mindset of a topper! 👑`,
        `Day ${dayIndex + 1}: Advanced concepts - you're ready for the challenge! 💎`,
        `Day ${dayIndex + 1}: Mastery is within reach. Push through the complexity! ⚡`
      ],
      revision: [
        `Day ${dayIndex + 1}: Revision strengthens memory. You're polishing your knowledge! ✨`,
        `Day ${dayIndex + 1}: Spaced repetition is the key to permanent learning! 🔑`,
        `Day ${dayIndex + 1}: Reviewing is not repeating - it's reinforcing! 🔄`,
        `Day ${dayIndex + 1}: Every revision makes you more confident! 💪`
      ],
      'final-prep': [
        `Day ${dayIndex + 1}: Final sprint! You're almost there - give it everything! 🏃‍♂️`,
        `Day ${dayIndex + 1}: Exam mode activated! Trust your preparation! 🎯`,
        `Day ${dayIndex + 1}: The finish line is visible. Stay focused and confident! 🏁`,
        `Day ${dayIndex + 1}: You've prepared well. Now it's time to shine! ⭐`
      ]
    };
    
    const messages = motivationalMessages[studyPhase as keyof typeof motivationalMessages] || motivationalMessages.building;
    const messageIndex = dayIndex % messages.length;
    
    return messages[messageIndex];
  }

  private static getWeeklyGoal(
    weekNumber: number, 
    studyPhase: string, 
    studentProfile: StudentProfile
  ): string {
    const examType = studentProfile.examType;
    const weakSubjects = studentProfile.weakSubjects;
    
    const weeklyGoals = {
      foundation: `Week ${weekNumber}: Build solid foundation in ${studentProfile.subjects.join(', ')} for ${examType}`,
      building: `Week ${weekNumber}: Develop deep understanding and connect concepts across ${studentProfile.subjects.join(', ')}`,
      mastery: `Week ${weekNumber}: Master advanced topics and problem-solving techniques${weakSubjects.length > 0 ? `, focus on strengthening ${weakSubjects.join(', ')}` : ''}`,
      revision: `Week ${weekNumber}: Comprehensive revision and memory consolidation for ${examType}`,
      'final-prep': `Week ${weekNumber}: Final preparation and confidence building for ${examType} exam`
    };
    
    return weeklyGoals[studyPhase as keyof typeof weeklyGoals] || `Week ${weekNumber}: Continue systematic preparation for ${examType}`;
  }

  private static getExpectedOutcome(subject: string, topics: string[], studyPhase: string): string {
    const topicCount = topics.length;
    
    const outcomes = {
      foundation: `Understand fundamental concepts of ${topicCount} topic(s) in ${subject}`,
      building: `Develop comprehensive understanding and ability to apply ${topicCount} concept(s)`,
      mastery: `Master advanced applications and problem-solving in ${topicCount} area(s)`,
      revision: `Reinforce and consolidate knowledge of ${topicCount} topic(s)`,
      'final-prep': `Achieve exam-ready confidence in ${topicCount} topic(s)`
    };
    
    return outcomes[studyPhase as keyof typeof outcomes] || `Progress in ${subject} understanding`;
  }

  private static getMockTestTimeSlot(studyPattern: string): string {
    const timeSlots = {
      morning: '6:00 AM - 10:00 AM',
      evening: '2:00 PM - 6:00 PM',
      night: '7:00 PM - 11:00 PM',
      flexible: '9:00 AM - 1:00 PM'
    };
    
    return timeSlots[studyPattern as keyof typeof timeSlots] || timeSlots.flexible;
  }

  private static getAnalysisTimeSlot(studyPattern: string): string {
    const timeSlots = {
      morning: '10:30 AM - 12:30 PM',
      evening: '6:30 PM - 8:30 PM',
      night: '11:30 PM - 1:30 AM',
      flexible: '2:00 PM - 4:00 PM'
    };
    
    return timeSlots[studyPattern as keyof typeof timeSlots] || timeSlots.flexible;
  }

  private static getRevisionTimeSlot(studyPattern: string): string {
    const timeSlots = {
      morning: '4:00 PM - 5:00 PM',
      evening: '9:00 PM - 10:00 PM',
      night: '6:00 PM - 7:00 PM',
      flexible: '5:00 PM - 6:00 PM'
    };
    
    return timeSlots[studyPattern as keyof typeof timeSlots] || timeSlots.flexible;
  }

  private static advanceTopicIndex(subjectPlan: { topics: string[]; currentIndex: number; totalCycles: number }): void {
    if (subjectPlan && subjectPlan.topics.length > 0) {
      subjectPlan.currentIndex = (subjectPlan.currentIndex + 1) % subjectPlan.topics.length;
    }
  }

  private static updateRevisionTracker(
    revisionTracker: Record<string, Date[]>,
    daySubjects: SubjectSchedule[],
    currentDate: Date
  ): void {
    daySubjects.forEach(subjectSchedule => {
      subjectSchedule.topics.forEach(topic => {
        if (!revisionTracker[topic]) {
          revisionTracker[topic] = [];
        }
        revisionTracker[topic].push(new Date(currentDate));
        
        // Keep only last 5 study dates for each topic
        if (revisionTracker[topic].length > 5) {
          revisionTracker[topic] = revisionTracker[topic].slice(-5);
        }
      });
    });
  }

  /**
   * Advanced algorithm features
   */
  
  /**
   * Calculate optimal study sequence based on cognitive load theory
   */
  private static calculateOptimalSequence(
    subjects: string[],
    weakSubjects: string[],
    studyPhase: string
  ): string[] {
    // Cognitive Load Theory: Start with moderate difficulty, peak with hardest, end with easier
    const subjectDifficulty: Record<string, number> = {};
    
    subjects.forEach(subject => {
      let difficulty = 5; // Base difficulty
      
      if (weakSubjects.includes(subject)) {
        difficulty += 3; // Weak subjects are harder
      }
      
      // Subject-specific difficulty adjustments
      if (subject.includes('Mathematics') || subject.includes('Physics')) {
        difficulty += 2;
      } else if (subject.includes('Chemistry') || subject.includes('Biology')) {
        difficulty += 1;
      }
      
      subjectDifficulty[subject] = difficulty;
    });
    
    // Sort subjects for optimal cognitive load distribution
    const sortedSubjects = [...subjects].sort((a, b) => {
      if (studyPhase === 'foundation') {
        // Foundation: Easy to hard progression
        return subjectDifficulty[a] - subjectDifficulty[b];
      } else {
        // Advanced phases: Hard subjects during peak hours
        return subjectDifficulty[b] - subjectDifficulty[a];
      }
    });
    
    return sortedSubjects;
  }

  /**
   * Generate adaptive milestones based on student progress
   */
  static generateAdaptiveMilestones(
    studentProfile: StudentProfile,
    totalWeeks: number
  ): any[] {
    const milestones: any[] = [];
    const subjectsCount = studentProfile.subjects.length;
    const milestonesPerSubject = Math.max(2, Math.floor(totalWeeks / subjectsCount));
    
    studentProfile.subjects.forEach((subject, subjectIndex) => {
      const isWeak = studentProfile.weakSubjects.includes(subject);
      const baseWeek = (subjectIndex * milestonesPerSubject) + 1;
      
      // Foundation milestone
      milestones.push({
        title: `${subject} Foundation Complete`,
        description: `Master fundamental concepts and basic problem-solving in ${subject}`,
        week: baseWeek,
        subject: subject,
        type: 'foundation',
        priority: isWeak ? 'high' : 'medium',
        criteria: [
          'Understand all basic concepts',
          'Solve 80% of easy-level problems',
          'Complete foundation topics from syllabus'
        ]
      });
      
      // Advanced milestone
      if (milestonesPerSubject > 1) {
        milestones.push({
          title: `${subject} Advanced Mastery`,
          description: `Achieve advanced problem-solving skills and application mastery in ${subject}`,
          week: baseWeek + Math.floor(milestonesPerSubject / 2),
          subject: subject,
          type: 'mastery',
          priority: isWeak ? 'high' : 'medium',
          criteria: [
            'Solve complex problems confidently',
            'Apply concepts to new scenarios',
            'Achieve 85%+ accuracy in practice tests'
          ]
        });
      }
    });
    
    // Overall preparation milestones
    milestones.push({
      title: 'Mid-Preparation Assessment',
      description: 'Comprehensive evaluation of preparation progress',
      week: Math.floor(totalWeeks / 2),
      subject: 'All Subjects',
      type: 'assessment',
      priority: 'high',
      criteria: [
        'Complete 50% of syllabus coverage',
        'Achieve target scores in mock tests',
        'Identify and address remaining weak areas'
      ]
    });
    
    milestones.push({
      title: 'Final Preparation Ready',
      description: 'Complete syllabus coverage and exam readiness',
      week: Math.floor(totalWeeks * 0.9),
      subject: 'All Subjects',
      type: 'completion',
      priority: 'high',
      criteria: [
        'Complete 95% of syllabus',
        'Consistent performance in mock tests',
        'Confidence in all subjects'
      ]
    });
    
    return milestones.sort((a, b) => a.week - b.week);
  }

  /**
   * Calculate success probability based on schedule adherence
   */
  static calculateSuccessProbability(
    studentProfile: StudentProfile,
    scheduleAdherence: number,
    currentProgress: number
  ): number {
    let probability = 50; // Base probability
    
    // Adherence factor (40% weight)
    probability += (scheduleAdherence - 50) * 0.4;
    
    // Progress factor (30% weight)
    probability += (currentProgress - 50) * 0.3;
    
    // Profile factors (30% weight)
    if (studentProfile.currentLevel === 'advanced') probability += 15;
    else if (studentProfile.currentLevel === 'intermediate') probability += 5;
    
    if (studentProfile.dailyAvailableHours >= 8) probability += 10;
    else if (studentProfile.dailyAvailableHours >= 6) probability += 5;
    
    if (studentProfile.previousExperience === 'extensive') probability += 10;
    else if (studentProfile.previousExperience === 'some') probability += 5;
    
    // Weak subjects penalty
    const weakSubjectRatio = studentProfile.weakSubjects.length / studentProfile.subjects.length;
    probability -= weakSubjectRatio * 20;
    
    // Motivation factor
    if (studentProfile.motivationLevel === 'high') probability += 10;
    else if (studentProfile.motivationLevel === 'low') probability -= 10;
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(probability)));
  }

  /**
   * Generate study tips based on toppers' strategies
   */
  static generateToppersStudyTips(studentProfile: StudentProfile): string[] {
    const tips: string[] = [
      '🎯 **80-20 Rule**: Focus 80% of your time on topics that yield 80% of the marks',
      '🔄 **Spaced Repetition**: Review topics at 1 day, 3 days, 1 week, and 1 month intervals',
      '🧠 **Active Recall**: Test yourself without looking at notes - most effective learning method',
      '⏰ **Peak Hours**: Study your weakest subjects during your peak energy hours',
      '📝 **Error Log**: Maintain a detailed log of all mistakes and review weekly',
      '🎪 **Mock Test Strategy**: Treat every mock test as the real exam',
      '💪 **Consistency > Intensity**: 6 hours daily for 100 days beats 12 hours for 50 days',
      '🎨 **Multi-sensory Learning**: Use visual, auditory, and kinesthetic methods together'
    ];
    
    // Add personalized tips based on profile
    if (studentProfile.weakSubjects.length > 0) {
      tips.push(`🔥 **Weak Subject Focus**: Dedicate first 2 hours of study to ${studentProfile.weakSubjects.join(', ')}`);
    }
    
    if (studentProfile.currentLevel === 'beginner') {
      tips.push('🏗️ **Foundation First**: Master basics before attempting advanced topics');
    }
    
    if (studentProfile.motivationLevel === 'low') {
      tips.push('🎉 **Small Wins**: Celebrate completing each topic to build momentum');
    }
    
    return tips;
  }
}