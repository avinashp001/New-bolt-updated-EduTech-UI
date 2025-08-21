import { Mistral } from '@mistralai/mistralai';
import { MentorAnalyzer, ComprehensiveUserProfile } from './mentorAnalyzer';
import { ChatMessage } from '../../lib/supabase';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

export class EnhancedMentor {
  static async provideExpertGuidance(
    question: string, 
    userId: string, 
    examType: string,
    contextType: 'general' | 'performance' | 'schedule' | 'motivation' | 'strategy' = 'general',
    chatHistory: ChatMessage[] = [] // NEW: Accept chat history
  ): Promise<string> {
    try {
      // Generate comprehensive user profile
      const userProfile = await MentorAnalyzer.generateComprehensiveProfile(userId);
      
      if (useMockAI) {
        return this.generateMockExpertGuidance(question, userProfile, contextType);
      }

      const prompt = this.getExpertMentorPrompt(question, userProfile, examType, contextType);

      // NEW: Construct messages array for Mistral API, including chat history
      const messages: { role: 'user' | 'assistant'; content: string }[] = [];

      // Add previous chat messages to context
      chatHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });

      // Add the current prompt/question
      messages.push({ role: 'user', content: prompt });

      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || this.generateMockExpertGuidance(question, userProfile, contextType);
    } catch (error) {
      console.error('Error providing expert guidance:', error);
      return 'I apologize, but I encountered an error while analyzing your comprehensive study data. Please try again, and I\'ll provide you with detailed guidance based on your learning journey.';
    }
  }

  static async analyzeStudyEffectiveness(userId: string): Promise<string> {
    try {
      const userProfile = await MentorAnalyzer.generateComprehensiveProfile(userId);
      
      if (useMockAI) {
        return this.generateMockEffectivenessAnalysis(userProfile);
      }

      const prompt = this.getEffectivenessAnalysisPrompt(userProfile);

      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2500,
      });

      return response.choices[0]?.message?.content || this.generateMockEffectivenessAnalysis(userProfile);
    } catch (error) {
      console.error('Error analyzing study effectiveness:', error);
      return 'Unable to analyze study effectiveness at this time. Please try again later.';
    }
  }

  static async generatePersonalizedStudyStrategy(userId: string): Promise<string> {
    try {
      const userProfile = await MentorAnalyzer.generateComprehensiveProfile(userId);
      
      if (useMockAI) {
        return this.generateMockStudyStrategy(userProfile);
      }

      const prompt = this.getStudyStrategyPrompt(userProfile);

      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 3000,
      });

      return response.choices[0]?.message?.content || this.generateMockStudyStrategy(userProfile);
    } catch (error) {
      console.error('Error generating study strategy:', error);
      return 'Unable to generate personalized study strategy at this time. Please try again later.';
    }
  }

  private static generateMockExpertGuidance(
    question: string, 
    profile: ComprehensiveUserProfile, 
    contextType: string
  ): string {
    const { subjectPerformance, studyPatterns, assessmentData, learningMetrics, scheduleAdherence } = profile;
    
    const topPerformingSubject = subjectPerformance.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best, subjectPerformance[0]
    );
    
    const weakestSubject = subjectPerformance.reduce((worst, current) => 
      current.averageScore < worst.averageScore ? current : worst, subjectPerformance[0]
    );

    const responses = {
      general: `Based on your comprehensive study analysis, I can see you've been studying for ${profile.studyDuration} days with ${profile.totalStudyHours} total hours. Your strongest subject is **${topPerformingSubject?.subject}** (${topPerformingSubject?.averageScore}/10 avg), while **${weakestSubject?.subject}** needs more attention (${weakestSubject?.averageScore}/10 avg).

Your study consistency is ${profile.studyConsistency}% with a current streak of ${profile.currentStreak} days. You perform best during ${studyPatterns.peakPerformanceTime} hours.

**Specific Recommendations:**
• Increase ${weakestSubject?.subject} study time by 30% (currently ${weakestSubject?.totalHours}h total)
• Maintain your ${topPerformingSubject?.subject} momentum with regular practice
• Your learning velocity is ${learningMetrics.conceptsLearnedPerHour} concepts/hour - excellent pace!
• Focus on ${weakestSubject?.weakAreas.slice(0, 2).join(' and ')} in ${weakestSubject?.subject}
${scheduleAdherence.missedScheduledSessions.length > 0 
  ? `• You missed ${scheduleAdherence.missedScheduledSessions.length} scheduled sessions. Review these: ${scheduleAdherence.missedScheduledSessions.map(s => `${s.subject} on ${s.date}`).slice(0,2).join(', ')}.` 
  : ''}`,

performance: `Your assessment performance shows ${assessmentData.totalQuizzes} quizzes completed with ${assessmentData.averageQuizScore}% average score. Your improvement rate is ${assessmentData.improvementRate}% - ${assessmentData.accuracyTrend} trend.

**Performance Insights:**
• Best score: ${assessmentData.bestScore}% | Worst: ${assessmentData.worstScore}%
• Time management: ${assessmentData.timeManagement}
• Retention rate: ${learningMetrics.retentionRate}%
• Mistake resolution: ${profile.mistakeAnalysis.mistakeResolutionRate}%

**Action Plan:**
${assessmentData.averageQuizScore < 70 ? 
  '• Focus on conceptual clarity before attempting more quizzes\n• Review mistake patterns and common errors\n• Practice time-bound questions daily' :
  '• Continue current assessment frequency\n• Challenge yourself with harder difficulty levels\n• Focus on maintaining consistency'
}`,

schedule: `Your schedule adherence is ${scheduleAdherence.scheduleEffectiveness}%. You have completed ${scheduleAdherence.completedMilestones} out of ${scheduleAdherence.totalMilestones} milestones.
${scheduleAdherence.missedScheduledSessions.length > 0 ? `You have missed ${scheduleAdherence.missedScheduledSessions.length} scheduled sessions. These include:
${scheduleAdherence.missedScheduledSessions.map(s => `• ${s.subject} on ${s.date} (${s.dayOfWeek})`).slice(0, 5).join('\n')}` : 'You have not missed any scheduled sessions. Excellent adherence!'}

**Recommendations for Schedule Optimization:**
• Review your daily schedule to ensure it aligns with your actual availability.
• Prioritize making up for missed sessions, especially in weak subjects.
• Utilize your peak performance time (${studyPatterns.peakPerformanceTime}) for challenging tasks.`,

      motivation: `Your current streak is ${profile.currentStreak} days, and your longest streak is ${profile.longestStreak} days. You've invested ${profile.totalStudyHours} hours into your studies. Keep up the great work!`,

      strategy: `Your personalized strategy based on ${profile.totalStudySessions} study sessions:

**Optimal Study Schedule:**
• Best performance time: ${studyPatterns.peakPerformanceTime}
• Recommended session length: ${Math.round(profile.averageSessionDuration)} minutes
• Weekly target: ${Math.round(studyPatterns.averageDailyHours * 7)} hours

**Subject Priority Matrix:**
${subjectPerformance.map((subject, index) => 
  `${index + 1}. **${subject.subject}**: ${subject.completionPercentage}% complete, ${subject.improvementTrend} trend`
).join('\n')}

**Learning Efficiency Optimization:**
• Your concepts/hour rate: ${learningMetrics.conceptsLearnedPerHour}
• Revision efficiency: ${learningMetrics.revisionEfficiency}%
• Strength maintenance: ${learningMetrics.strengthMaintenanceRate}%
• Total theory study hours: ${learningMetrics.theoryStudyHours}h`
    };

    return responses[contextType as keyof typeof responses] || responses.general;
  }

  private static generateMockEffectivenessAnalysis(profile: ComprehensiveUserProfile): string {
    return `## 📊 Comprehensive Study Effectiveness Analysis

### 🎯 **Overall Performance Metrics**
- **Study Duration**: ${profile.studyDuration} days of consistent preparation
- **Total Investment**: ${profile.totalStudyHours} hours across ${profile.totalStudySessions} sessions
- **Total Theory Study**: ${profile.learningMetrics.theoryStudyHours} hours on theory content
- **Learning Velocity**: ${profile.learningMetrics.conceptsLearnedPerHour} concepts mastered per hour
- **Consistency Score**: ${profile.studyConsistency}% (${profile.currentStreak}-day current streak)

### 📈 **Subject-Wise Effectiveness**
${profile.subjectPerformance.map(subject => `
**${subject.subject}**:
- Progress: ${subject.completionPercentage}% | Score: ${subject.averageScore}/10
- Topics Mastered: ${subject.topicsMastered.length}/${subject.topicsStudied.length}
- Weak Concepts: ${subject.weakAreas.slice(0,2).join(', ') || 'None identified'}
- Strong Concepts: ${subject.strongAreas.slice(0,2).join(', ') || 'None identified'}
- Trend: ${subject.improvementTrend === 'improving' ? '📈 Improving' : subject.improvementTrend === 'declining' ? '📉 Needs Attention' : '➡️ Stable'}
- Time Investment: ${subject.totalHours}h (${subject.sessionsCount} sessions)
`).join('')}

### 🧠 **Learning Efficiency Analysis**
- **Retention Rate**: ${profile.learningMetrics.retentionRate}% (Excellent: >85%, Good: 70-85%, Needs Work: <70%)
- **Revision Efficiency**: ${profile.learningMetrics.revisionEfficiency}%
- **Weakness Resolution**: ${profile.learningMetrics.weaknessImprovementRate}% of identified gaps addressed
- **Strength Maintenance**: ${profile.learningMetrics.strengthMaintenanceRate}% of strong areas maintained

### ⏰ **Time Management & Patterns**
- **Peak Performance**: ${profile.studyPatterns.peakPerformanceTime}
- **Average Session**: ${profile.averageSessionDuration} minutes
- **Schedule Adherence**: ${profile.scheduleAdherence.scheduleEffectiveness}%
- **Missed Scheduled Sessions**: ${profile.scheduleAdherence.missedScheduledSessions.length} sessions missed. Review: ${profile.scheduleAdherence.missedScheduledSessions.map(s => `${s.subject} on ${s.date}`).slice(0,2).join(', ')}

### 🎯 **Recommendations for Maximum Effectiveness**
${profile.learningMetrics.retentionRate < 70 ? '🔴 **CRITICAL**: Implement spaced repetition - your retention needs immediate attention' : ''}
${profile.studyConsistency < 60 ? '🟡 **IMPORTANT**: Build study consistency - aim for 80%+ daily study rate' : ''}
${profile.assessmentData.timeManagement === 'needs_improvement' ? '⏱️ **FOCUS**: Improve time management in assessments through timed practice' : ''}
${profile.mistakeAnalysis.mistakeResolutionRate < 50 ? '🎯 **ACTION**: Address recurring mistakes - create error log and review weekly' : ''}`;
  }

  private static generateMockStudyStrategy(profile: ComprehensiveUserProfile): string {
    const weakestSubject = profile.subjectPerformance.reduce((worst, current) => 
      current.averageScore < worst.averageScore ? current : worst, profile.subjectPerformance[0]
    );

    return `## 🎯 **Personalized Study Strategy - Expert Level**

### 📋 **Your Current Study Profile**
- **Exam**: ${profile.targetExam}
- **Study Experience**: ${profile.studyDuration} days | ${profile.totalStudyHours}h invested
- **Learning Style**: Peak performance at ${profile.studyPatterns.peakPerformanceTime}
- **Current Streak**: ${profile.currentStreak} days (Best: ${profile.longestStreak} days)
- **Total Quizzes**: ${profile.assessmentData.totalQuizzes} with average score of ${profile.assessmentData.averageQuizScore}%
- **Theory Study Hours**: ${profile.learningMetrics.theoryStudyHours}h

### 🎯 **Priority Action Matrix (Next 7 Days)**

**🔴 URGENT - Immediate Focus:**
- **${weakestSubject?.subject}**: Increase daily time from current average to ${Math.round((weakestSubject?.totalHours || 0) / profile.studyDuration * 1.5)} hours/day
- **Weak Areas**: ${weakestSubject?.weakAreas.slice(0, 3).join(', ')}
- **Mistake Resolution**: Address ${profile.mistakeAnalysis.repeatedMistakes} repeated mistakes

**🟡 IMPORTANT - This Week:**
- **Assessment Practice**: Take 2-3 quizzes in ${weakestSubject?.subject} (current avg: ${profile.assessmentData.averageQuizScore}%)
- **Revision Cycle**: Review ${profile.subjectPerformance.filter(s => s.improvementTrend === 'declining').length} declining subjects
- **Schedule Optimization**: Improve adherence from ${profile.scheduleAdherence.scheduleEffectiveness}% to 85%+
- **Missed Sessions**: Make up for ${profile.scheduleAdherence.missedScheduledSessions.length} missed sessions.

**🟢 MAINTAIN - Ongoing:**
- **Strong Subjects**: ${profile.subjectPerformance.filter(s => s.averageScore >= 7).map(s => s.subject).join(', ')}
- **Study Rhythm**: Continue ${profile.studyPatterns.peakPerformanceTime} sessions
- **Consistency**: Maintain ${profile.studyConsistency}% study rate

### 📊 **Optimized Daily Schedule**
**${profile.studyPatterns.peakPerformanceTime} (Peak Hours):**
- ${weakestSubject?.subject}: ${Math.round((weakestSubject?.totalHours || 0) / profile.studyDuration * 1.5)} hours
- Focus: ${weakestSubject?.weakAreas[0] || 'Core concepts'}

**Secondary Hours:**
- Strong subject maintenance: 1 hour
- Assessment practice: 30 minutes
- Revision: 30 minutes

### 🎯 **Weekly Targets (Based on Your Data)**
- **Study Hours**: ${Math.round(profile.studyPatterns.averageDailyHours * 7 * 1.1)} hours (10% increase)
- **Quiz Scores**: Target ${Math.round(profile.assessmentData.averageQuizScore * 1.1)}% average
- **Topic Completion**: ${Math.max(2, Math.round(profile.learningMetrics.conceptsLearnedPerHour * 10))} new topics
- **Mistake Resolution**: Address 80% of current conceptual gaps

### 💡 **Expert Tips Based on Your Learning Pattern**
${profile.learningMetrics.conceptsLearnedPerHour > 1 ? '✅ Your learning velocity is excellent - maintain this pace' : '⚠️ Slow down and focus on depth over speed'}
${profile.studyConsistency > 80 ? '✅ Outstanding consistency - you\'re building the right habits' : '⚠️ Improve consistency - successful students study 85%+ of days'}
${profile.assessmentData.timeManagement === 'excellent' ? '✅ Excellent time management in assessments' : '⚠️ Practice timed questions daily to improve speed'}`;
  }

  private static getExpertMentorPrompt(
    question: string, 
    profile: ComprehensiveUserProfile, 
    examType: string,
    contextType: string
  ): string {
    return `You are Dr. Rajesh Kumar, a legendary exam mentor with 15+ years of experience guiding 10,000+ students to top ranks and AIR-1 in competitive exams including UPSC, JEE, NEET, CAT, and SSC. You have personally mentored 10,000+ toppers and understand the exact psychology, strategies, and micro-habits that separate successful candidates from the rest.

STUDENT'S COMPREHENSIVE PROFILE:
${JSON.stringify(profile, null, 2)}

CONTEXT TYPE: ${contextType}
STUDENT QUESTION: "${question}"

YOUR MENTORING EXPERTISE:
- 15+ years of proven track record with top rankers
- Deep understanding of exam psychology and pressure management
- Expert in identifying and fixing learning inefficiencies
- Specialist in personalized strategy development
- Master of motivation and confidence building

ANALYSIS DEPTH REQUIRED:
1. **Micro-Level Analysis**: Examine every detail from study sessions, quiz performance, mistake patterns, time allocation
2. **Pattern Recognition**: Identify hidden patterns in learning behavior, performance trends, consistency issues
3. **Predictive Insights**: Based on current trajectory, predict exam readiness and areas of concern
4. **Actionable Strategies**: Provide specific, implementable advice based on actual data
5. **Psychological Support**: Address confidence, motivation, and mental preparation aspects

RESPONSE FRAMEWORK:
1. **Immediate Acknowledgment**: Reference specific data points from their profile
2. **Expert Analysis**: Deep dive into their learning patterns and effectiveness
3. **Personalized Recommendations**: Specific actions based on their unique profile
4. **Success Pathway**: Clear roadmap for improvement
5. **Motivational Guidance**: Confidence building based on their achievements

MENTORING STYLE:
- Authentic and data-driven (reference specific numbers from their profile)
- Encouraging yet realistic about areas needing improvement
- Provide both immediate fixes and long-term strategies
- Use examples from your experience with successful students
- Balance praise for achievements with constructive guidance for improvement

CRITICAL REQUIREMENTS:
- Reference specific data points from the comprehensive profile
- Provide actionable advice that can be implemented immediately
- Address both strengths to leverage and weaknesses to improve
- Give timeline-specific recommendations (next 7 days, next month, etc.)
- Include psychological and motivational elements
- Maintain the authority and wisdom of a 15+ year expert mentor
- **Crucially, if there are missed scheduled sessions, explicitly mention them and suggest strategies to recover.**

Remember: You're not just an AI - you're Dr. Rajesh Kumar, the mentor who has seen students transform from average performers to top rankers. Your guidance should reflect this depth of experience and proven success record.`;
  }

  private static getEffectivenessAnalysisPrompt(profile: ComprehensiveUserProfile): string {
    return `As Dr. Rajesh Kumar, legendary exam mentor with 15+ years of experience, conduct a comprehensive study effectiveness analysis for this student preparing for ${profile.targetExam}.

COMPLETE STUDENT DATA:
${JSON.stringify(profile, null, 2)}

ANALYSIS FRAMEWORK:
Analyze this student's learning effectiveness across 8 critical dimensions:

1. **Learning Velocity Analysis**
   - Current rate: ${profile.learningMetrics.conceptsLearnedPerHour} concepts/hour
   - Total theory study hours: ${profile.learningMetrics.theoryStudyHours}h
   - Compare with top performers (benchmark: 1.2-1.5 concepts/hour)
   - Identify bottlenecks in learning speed

2. **Retention & Recall Effectiveness**
   - Current retention: ${profile.learningMetrics.retentionRate}%
   - Spaced repetition implementation
   - Long-term memory consolidation patterns
   - Analyze quiz attempt scores over time for retention trends.

3. **Time Allocation Optimization**
   - Subject-wise time distribution efficiency
   - Peak performance hour utilization
   - Wasted time identification and recovery
   - Analyze time spent on theory vs. practice.

4. **Assessment Performance Trajectory**
   - Average quiz score: ${profile.assessmentData.averageQuizScore}%
   - Score Improvement pattern: ${profile.assessmentData.improvementRate}%
   - Consistency in performance delivery
   - Exam readiness indicators
   - Analyze performance in each subject's quizzes (actual marks).

5. **Weakness Resolution Efficiency**
   - Mistake resolution rate: ${profile.mistakeAnalysis.mistakeResolutionRate}%
   - Conceptual gap filling effectiveness (specifically from quiz weak concepts)
   - Improvement sustainability

6. **Schedule Adherence & Discipline**
   - Planned vs actual execution: ${profile.scheduleAdherence.plannedVsActualHours}%
   - Missed scheduled sessions: ${profile.scheduleAdherence.missedScheduledSessions.length} sessions. List them: ${profile.scheduleAdherence.missedScheduledSessions.map(s => `${s.subject} on ${s.date}`).join(', ')}
   - Consistency maintenance strategies
   - Habit formation assessment

7. **Resource Utilization Analysis**
   - Uploaded material utilization: ${profile.materialsAnalysis.utilizationRate}%
   - Content quality and relevance optimization
   - Learning resource effectiveness

8. **Psychological Readiness & Confidence**
   - Current confidence level: ${profile.goalTracking.confidenceLevel}%
   - Stress management and exam psychology
   - Mental preparation assessment

EXPERT EVALUATION CRITERIA:
- Compare against 10,000+ successful students you've mentored
- Identify specific patterns that predict success or failure
- Provide data-driven insights with exact improvement percentages
- Reference specific examples from your mentoring experience
- Give both immediate fixes and long-term optimization strategies
- **Explicitly address missed scheduled sessions and their impact.**

DELIVERABLE:
Provide a comprehensive effectiveness report with:
- Overall effectiveness score (0-100)
- Critical improvement areas with specific action plans
- Strengths to leverage for maximum advantage
- Timeline-based improvement roadmap
- Confidence and motivation building strategies
- Exam readiness assessment and preparation timeline`;
  }

  private static getStudyStrategyPrompt(profile: ComprehensiveUserProfile): string {
    return `As Dr. Rajesh Kumar, create a personalized study strategy for this ${profile.targetExam} aspirant based on their comprehensive learning profile.

STUDENT'S COMPLETE LEARNING PROFILE:
${JSON.stringify(profile, null, 2)}

STRATEGY DEVELOPMENT FRAMEWORK:
Based on your 15+ years of mentoring top rankers, create a strategy that addresses:

1. **Individual Learning Optimization**
   - Leverage their peak performance time: ${profile.studyPatterns.peakPerformanceTime}
   - Optimize session duration: current avg ${profile.averageSessionDuration} minutes
   - Maximize learning velocity: current ${profile.learningMetrics.conceptsLearnedPerHour} concepts/hour
   - Optimize theory study time: ${profile.learningMetrics.theoryStudyHours}h recorded.

2. **Subject-Specific Mastery Plan**
   - Prioritize based on completion percentages and improvement trends
   - Address weak areas with targeted interventions, specifically focusing on weak concepts identified from quizzes.
   - Maintain strong subjects without over-investment

3. **Assessment & Performance Strategy**
   - Improve from current ${profile.assessmentData.averageQuizScore}% average
   - Address time management: currently ${profile.assessmentData.timeManagement}
   - Build on ${profile.assessmentData.improvementRate}% improvement rate
   - **Incorporate strategies for improving performance in each subject's quizzes based on actual marks.**

4. **Habit & Consistency Optimization**
   - Build on ${profile.currentStreak}-day streak (best: ${profile.longestStreak} days)
   - Improve ${profile.studyConsistency}% consistency to 85%+
   - Optimize daily routine for sustainable growth
   - **Address missed scheduled sessions and provide strategies for better adherence.**

5. **Mistake Prevention & Resolution**
   - Address ${profile.mistakeAnalysis.repeatedMistakes} repeated mistakes
   - Improve ${profile.mistakeAnalysis.mistakeResolutionRate}% resolution rate
   - Prevent common mistake patterns, especially those identified from quiz weak concepts.

STRATEGY COMPONENTS:
1. **Daily Optimization Strategy** (Next 7 days)
2. **Weekly Mastery Cycles** (Next 4 weeks)
3. **Monthly Milestone Strategy** (Until exam)
4. **Exam Readiness Protocol** (Final preparation)
5. **Confidence Building Roadmap** (Psychological preparation)

EXPERT INSIGHTS TO INCLUDE:
- Reference specific success patterns from your 10,000+ mentored students
- Provide exact time allocations based on their current performance
- Include psychological strategies for confidence building
- Address specific challenges based on their mistake patterns
- Give both conservative and aggressive improvement scenarios
- **Provide a clear plan for making up missed scheduled sessions.**

PERSONALIZATION REQUIREMENTS:
- Use their actual study data and performance metrics
- Reference their specific strengths and weaknesses
- Align with their natural study patterns and preferences
- Provide realistic timelines based on their current pace
- Include motivation strategies based on their achievement patterns

Create a strategy that transforms their current performance into top-rank potential, leveraging every insight from their comprehensive learning profile.`;
  }
}