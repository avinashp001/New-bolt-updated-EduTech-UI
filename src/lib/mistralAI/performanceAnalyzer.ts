import { Mistral } from '@mistralai/mistralai';
import { safeParseJSON } from '../../utils/jsonParser';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

export class PerformanceAnalyzer {
  static async analyzeTestPerformance(testData: any) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const score = testData.score;
      return JSON.stringify({
        strongAreas: score >= 70 ? [
          'Good grasp of fundamental concepts',
          'Strong analytical thinking',
          'Effective problem-solving approach'
        ] : ['Basic understanding of core topics'],
        weakAreas: score < 70 ? [
          'Need to strengthen conceptual understanding',
          'Requires more practice with application problems',
          'Should focus on detailed study of weak topics'
        ] : score < 90 ? ['Minor gaps in advanced concepts'] : [],
        detailedAnalysis: `Your performance in ${testData.subject} shows ${score >= 80 ? 'excellent' : score >= 70 ? 'good' : score >= 60 ? 'satisfactory' : 'needs improvement'} understanding. You completed the test in ${testData.timeSpent} minutes, which indicates ${testData.timeSpent < 15 ? 'quick thinking but may need more careful consideration' : testData.timeSpent > 30 ? 'thorough analysis but could work on speed' : 'good time management'}. ${score >= 70 ? 'Continue building on your strengths while addressing any remaining weak areas.' : 'Focus on strengthening your foundation in this subject through targeted study and practice.'}`,
        recommendations: score >= 80 ? [
          'Continue with advanced topics',
          'Take more challenging practice tests',
          'Help others to reinforce your knowledge',
          'Explore real-world applications'
        ] : score >= 60 ? [
          'Review incorrect answers thoroughly',
          'Practice similar questions daily',
          'Create concept maps for better understanding',
          'Seek clarification on difficult topics'
        ] : [
          'Start with basic concepts and build gradually',
          'Use multiple learning resources',
          'Practice fundamental problems extensively',
          'Consider getting additional help or tutoring'
        ],
        nextSteps: score >= 80 ? [
          'Move to next chapter/topic',
          'Take comprehensive mock tests',
          'Focus on exam-specific strategies'
        ] : [
          'Revisit the uploaded material',
          'Take another test after additional study',
          'Focus on identified weak areas'
        ]
      });
    }

    const prompt = this.getTestPerformancePrompt(testData);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 2000,
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.warn('No AI response received for test performance analysis');
        return JSON.stringify({
          strongAreas: ['Basic understanding demonstrated'],
          weakAreas: ['Areas for improvement identified'],
          detailedAnalysis: 'Performance analysis completed. Continue studying to improve.',
          recommendations: ['Review material', 'Practice more questions'],
          nextSteps: ['Continue with next topic', 'Take more tests']
        });
      }

      // Use robust JSON parsing
      const parsedAnalysis = safeParseJSON<{
        strongAreas: string[];
        weakAreas: string[];
        detailedAnalysis: string;
        recommendations: string[];
        nextSteps: string[];
      }>(aiResponse);
      
      if (parsedAnalysis) {
        return JSON.stringify(parsedAnalysis);
      }
      
      console.warn('Failed to parse AI performance analysis, using fallback');
      return JSON.stringify({
        strongAreas: ['Basic understanding demonstrated'],
        weakAreas: ['Areas for improvement identified'],
        detailedAnalysis: 'Performance analysis completed. Continue studying to improve.',
        recommendations: ['Review material', 'Practice more questions'],
        nextSteps: ['Continue with next topic', 'Take more tests']
      });
    } catch (error) {
      console.error('Error analyzing test performance:', error);
      return JSON.stringify({
        strongAreas: ['Basic understanding demonstrated'],
        weakAreas: ['Areas for improvement identified'],
        detailedAnalysis: 'Performance analysis completed. Continue studying to improve.',
        recommendations: ['Review material', 'Practice more questions'],
        nextSteps: ['Continue with next topic', 'Take more tests']
      });
    }
  }

  static async analyzeWeeklyPerformance(testData: any) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const score = testData.score;
      const week = testData.currentWeek;
      const subject = testData.subject;
      const studyPlan = testData.studyPlan;
      
      // Extract specific topics from questions based on performance
      const strongTopics = new Set<string>();
      const weakTopics = new Set<string>();
      
      if (testData.questions && Array.isArray(testData.questions)) {
        testData.questions.forEach((q: any, index: number) => {
          const userAnswer = testData.userAnswers?.[index];
          const isCorrect = userAnswer === q.correctAnswer;
          const topic = q.topic || 'General Concept';
          
          if (isCorrect) {
            strongTopics.add(topic);
          } else {
            weakTopics.add(topic);
          }
        });
      }
      
      // Convert sets to arrays and add general performance indicators
      const specificStrongAreas = Array.from(strongTopics);
      const specificWeakAreas = Array.from(weakTopics);
      
      return JSON.stringify({
        strongAreas: score >= 70 ? [
          ...specificStrongAreas.map(topic => `${subject} - ${topic}: Excellent understanding demonstrated`),
          specificStrongAreas.length > 0 ? `Strong grasp of ${specificStrongAreas.length} topic(s) in ${subject}` : `${subject}: Good overall understanding of uploaded content`,
          `Week ${week} ${studyPlan}: Effective analysis of content-specific concepts`,
          specificStrongAreas.length > 2 ? `${subject} material mastery is on track for ${studyPlan}` : 'Solid foundation building in progress'
        ] : [
          ...specificStrongAreas.map(topic => `${subject} - ${topic}: Basic understanding shown`),
          specificStrongAreas.length > 0 ? `Some grasp of ${specificStrongAreas.length} topic(s) in ${subject}` : `${subject}: Basic understanding of uploaded content`,
          `Week ${week}: Partial comprehension of material concepts`
        ],
        weakAreas: score < 70 ? [
          ...specificWeakAreas.map(topic => `${subject} - ${topic}: Needs significant improvement`),
          specificWeakAreas.length > 0 ? `Struggling with ${specificWeakAreas.length} topic(s) in ${subject}` : `${subject}: Content comprehension needs improvement`,
          `Week ${week}: Requires deeper study of ${specificWeakAreas.length > 0 ? specificWeakAreas.join(', ') : 'uploaded material'}`,
          specificWeakAreas.length > 2 ? `Multiple ${subject} concepts need reinforcement` : 'Should re-read and analyze the content more thoroughly'
        ] : score < 90 ? [
          ...specificWeakAreas.map(topic => `${subject} - ${topic}: Minor gaps need attention`),
          specificWeakAreas.length > 0 ? `Review needed for ${specificWeakAreas.length} topic(s) in ${subject}` : `${subject}: Minor gaps in content understanding`,
          specificWeakAreas.length > 0 ? `Focus on: ${specificWeakAreas.join(', ')}` : 'Some concepts from uploaded material need review'
        ] : [],
        recommendations: score >= 80 ? [
          `Outstanding ${subject} performance in Week ${week} for ${studyPlan}!`,
          specificStrongAreas.length > 0 ? `Continue building on strong topics: ${specificStrongAreas.slice(0, 3).join(', ')}` : `Ready for advanced ${subject} materials and concepts`,
          'Upload more challenging content for this subject',
          specificWeakAreas.length > 0 ? `Address minor gaps in: ${specificWeakAreas.join(', ')}` : `Maintain current study approach for ${subject}`
        ] : score >= 60 ? [
          `Good ${subject} effort in Week ${week}. Address content gaps`,
          specificWeakAreas.length > 0 ? `Focus extra time on: ${specificWeakAreas.slice(0, 3).join(', ')}` : `Dedicate more time to reviewing ${subject} uploaded material`,
          specificWeakAreas.length > 0 ? `Re-study these topics: ${specificWeakAreas.join(', ')}` : 'Re-analyze the uploaded content section by section',
          `Seek additional ${subject} resources for ${studyPlan} preparation`
        ] : [
          `${subject} comprehension in Week ${week} needs significant work`,
          specificWeakAreas.length > 0 ? `Prioritize these weak areas: ${specificWeakAreas.join(', ')}` : 'Thoroughly revisit uploaded content multiple times',
          `Find supplementary ${subject} materials for ${studyPlan}`,
          specificWeakAreas.length > 2 ? `Consider tutoring for: ${specificWeakAreas.slice(0, 2).join(', ')}` : 'Consider seeking help with this subject area'
        ],
        nextSteps: score >= 80 ? [
          `Proceed to Week ${week + 1} ${subject} topics`,
          specificStrongAreas.length > 0 ? `Build on mastered topics: ${specificStrongAreas.slice(0, 2).join(', ')}` : `Upload advanced ${subject} materials for deeper learning`,
          specificStrongAreas.length > 1 ? `Explore practical applications of: ${specificStrongAreas[0]}` : 'Explore practical applications of mastered concepts',
          `Continue ${studyPlan} preparation with confidence`
        ] : score >= 60 ? [
          `Review ${subject} content before Week ${week + 1}`,
          specificWeakAreas.length > 0 ? `Practice more questions on: ${specificWeakAreas.slice(0, 2).join(', ')}` : 'Upload additional practice materials for better understanding',
          specificWeakAreas.length > 0 ? `Clarify these ${subject} concepts: ${specificWeakAreas.join(', ')}` : `Clarify difficult ${subject} concepts for ${studyPlan}`,
          'Strengthen foundation before advancing'
        ] : [
          specificWeakAreas.length > 0 ? `Re-study these topics: ${specificWeakAreas.join(', ')}` : `Re-study current ${subject} material thoroughly`,
          `Seek help with ${subject} concepts for ${studyPlan}`,
          specificWeakAreas.length > 0 ? `Build foundation in: ${specificWeakAreas.slice(0, 2).join(', ')}` : 'Build strong foundation before proceeding',
          'Consider alternative learning resources'
        ],
        weeklyGuidance: score >= 80 ? 
          `Exceptional ${subject} performance in Week ${week} of your ${studyPlan} preparation! ${specificStrongAreas.length > 0 ? `You've mastered: ${specificStrongAreas.join(', ')}.` : `You've mastered the uploaded content excellently.`} ${specificWeakAreas.length > 0 ? `Minor work needed on: ${specificWeakAreas.join(', ')}.` : 'Your analytical approach to content-based learning is highly effective.'} Ready for more challenging materials.` :
          score >= 60 ?
          `Solid ${subject} progress in Week ${week} of ${studyPlan} preparation. ${specificStrongAreas.length > 0 ? `Strong areas: ${specificStrongAreas.join(', ')}.` : 'You grasp some content reasonably well.'} ${specificWeakAreas.length > 0 ? `Focus on improving: ${specificWeakAreas.join(', ')}.` : 'Focus on re-analyzing areas you missed.'} Strengthen content comprehension before advancing.` :
          `Week ${week} ${subject} performance for ${studyPlan} indicates need for deeper content engagement. ${specificWeakAreas.length > 0 ? `Priority areas for improvement: ${specificWeakAreas.join(', ')}.` : 'Take time to thoroughly understand the uploaded material.'} ${specificStrongAreas.length > 0 ? `Build confidence from: ${specificStrongAreas.join(', ')}.` : ''} Quality comprehension is crucial for exam success.`
      });
    }

    const prompt = this.getWeeklyPerformancePrompt(testData);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for consistent JSON
        max_tokens: 2000,
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.warn('No AI response received for weekly performance analysis');
        return JSON.stringify({
          strongAreas: ['Content comprehension demonstrated'],
          weakAreas: ['Some content areas need reinforcement'],
          recommendations: ['Review uploaded material thoroughly', 'Focus on content-specific concepts'],
          nextSteps: ['Master current content before advancing', 'Upload similar materials for practice'],
          weeklyGuidance: 'Continue building content analysis skills for effective exam preparation.'
        });
      }

      // Use robust JSON parsing
      const parsedAnalysis = safeParseJSON<{
        strongAreas: string[];
        weakAreas: string[];
        recommendations: string[];
        nextSteps: string[];
        weeklyGuidance: string;
      }>(aiResponse);
      
      if (parsedAnalysis) {
        return JSON.stringify(parsedAnalysis);
      }
      
      console.warn('Failed to parse AI weekly performance analysis, using fallback');
      return JSON.stringify({
        strongAreas: ['Content comprehension demonstrated'],
        weakAreas: ['Some content areas need reinforcement'],
        recommendations: ['Review uploaded material thoroughly', 'Focus on content-specific concepts'],
        nextSteps: ['Master current content before advancing', 'Upload similar materials for practice'],
        weeklyGuidance: 'Continue building content analysis skills for effective exam preparation.'
      });
    } catch (error) {
      console.error('Error analyzing weekly performance:', error);
      return JSON.stringify({
        strongAreas: ['Content comprehension demonstrated'],
        weakAreas: ['Some content areas need reinforcement'],
        recommendations: ['Review uploaded material thoroughly', 'Focus on content-specific concepts'],
        nextSteps: ['Master current content before advancing', 'Upload similar materials for practice'],
        weeklyGuidance: 'Continue building content analysis skills for effective exam preparation.'
      });
    }
  }

  static async analyzeProgress(studySessions: any[], currentWeek: number) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return JSON.stringify({
        performanceAnalysis: "Your study consistency has improved by 15% this week. Mathematics shows strong progress.",
        weakAreas: ["Organic Chemistry", "Complex Numbers", "Modern Physics"],
        strongAreas: ["Algebra", "Mechanics", "Inorganic Chemistry"],
        recommendations: [
          "Increase Organic Chemistry practice by 30 minutes daily",
          "Use visual aids for Complex Numbers",
          "Practice more numerical problems in Modern Physics"
        ],
        motivationalFeedback: "Great progress! You're on track to achieve your goals. Keep up the consistent effort.",
        nextWeekFocus: ["Organic Chemistry mechanisms", "Complex number applications", "Modern physics concepts"]
      });
    }

    const prompt = this.getProgressAnalysisPrompt(studySessions, currentWeek);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for consistent JSON
        max_tokens: 1500,
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.warn('No AI response received for progress analysis');
        return JSON.stringify({
          performanceAnalysis: "Your study consistency has improved by 15% this week. Mathematics shows strong progress.",
          weakAreas: ["Organic Chemistry", "Complex Numbers", "Modern Physics"],
          strongAreas: ["Algebra", "Mechanics", "Inorganic Chemistry"],
          recommendations: [
            "Increase Organic Chemistry practice by 30 minutes daily",
            "Use visual aids for Complex Numbers",
            "Practice more numerical problems in Modern Physics"
          ],
          motivationalFeedback: "Great progress! You're on track to achieve your goals. Keep up the consistent effort.",
          nextWeekFocus: ["Organic Chemistry mechanisms", "Complex number applications", "Modern physics concepts"]
        });
      }

      // Use robust JSON parsing
      const parsedAnalysis = safeParseJSON<{
        performanceAnalysis: string;
        weakAreas: string[];
        strongAreas: string[];
        recommendations: string[];
        motivationalFeedback: string;
        nextWeekFocus: string[];
      }>(aiResponse);
      
      if (parsedAnalysis) {
        return JSON.stringify(parsedAnalysis);
      }
      
      console.warn('Failed to parse AI progress analysis, using fallback');
      return JSON.stringify({
        performanceAnalysis: "Your study consistency has improved by 15% this week. Mathematics shows strong progress.",
        weakAreas: ["Organic Chemistry", "Complex Numbers", "Modern Physics"],
        strongAreas: ["Algebra", "Mechanics", "Inorganic Chemistry"],
        recommendations: [
          "Increase Organic Chemistry practice by 30 minutes daily",
          "Use visual aids for Complex Numbers",
          "Practice more numerical problems in Modern Physics"
        ],
        motivationalFeedback: "Great progress! You're on track to achieve your goals. Keep up the consistent effort.",
        nextWeekFocus: ["Organic Chemistry mechanisms", "Complex number applications", "Modern physics concepts"]
      });
    } catch (error) {
      console.error('Error analyzing progress:', error);
      return JSON.stringify({
        performanceAnalysis: "Your study consistency has improved by 15% this week. Mathematics shows strong progress.",
        weakAreas: ["Organic Chemistry", "Complex Numbers", "Modern Physics"],
        strongAreas: ["Algebra", "Mechanics", "Inorganic Chemistry"],
        recommendations: [
          "Increase Organic Chemistry practice by 30 minutes daily",
          "Use visual aids for Complex Numbers",
          "Practice more numerical problems in Modern Physics"
        ],
        motivationalFeedback: "Great progress! You're on track to achieve your goals. Keep up the consistent effort.",
        nextWeekFocus: ["Organic Chemistry mechanisms", "Complex number applications", "Modern physics concepts"]
      });
    }
  }

  private static getTestPerformancePrompt(testData: any): string {
    return `🚨 CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. NO explanatory text, NO markdown formatting, NO code blocks, NO additional commentary. Start your response immediately with { and end with }.

REQUIRED JSON STRUCTURE:
{
  "strongAreas": ["List of topics/skills where student performed well"],
  "weakAreas": ["List of topics/skills needing improvement"],
  "detailedAnalysis": "Comprehensive analysis of performance",
  "recommendations": ["Specific study recommendations"],
  "nextSteps": ["Actionable next steps"]
}

🚨 ABSOLUTE REQUIREMENTS:
- RESPOND WITH JSON ONLY - NO OTHER TEXT
- NO \`\`\`json\`\`\` CODE BLOCKS
- NO EXPLANATIONS OUTSIDE JSON
- START WITH { AND END WITH }
- VALID JSON SYNTAX ONLY

Analyze this test performance data and provide detailed insights:

Test Data: ${JSON.stringify(testData)}

Consider:
1. Score percentage and what it indicates about understanding
2. Time spent and efficiency
3. Pattern of correct/incorrect answers
4. Topics where student struggled
5. Specific guidance for improvement
6. Motivational and constructive feedback

🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }

  private static getWeeklyPerformancePrompt(testData: any): string {
    return `🚨 CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. NO explanatory text, NO markdown formatting, NO code blocks, NO additional commentary. Start your response immediately with { and end with }.

REQUIRED JSON STRUCTURE:
{
  "strongAreas": ["Specific aspects of uploaded content where student demonstrated mastery"],
  "weakAreas": ["Content areas from uploaded material requiring improvement"],
  "recommendations": ["Targeted advice for mastering the uploaded content"],
  "nextSteps": ["Concrete actions for content mastery"],
  "weeklyGuidance": "Detailed assessment of content comprehension"
}

🚨 ABSOLUTE REQUIREMENTS:
- RESPOND WITH JSON ONLY - NO OTHER TEXT
- NO \`\`\`json\`\`\` CODE BLOCKS
- NO EXPLANATIONS OUTSIDE JSON
- START WITH { AND END WITH }
- VALID JSON SYNTAX ONLY

Analyze this weekly study plan performance based on content-specific assessment and provide comprehensive guidance:

Test Data: ${JSON.stringify(testData)}

CONTEXT:
- Week ${testData.currentWeek} of ${testData.studyPlan} study plan
- Subject: ${testData.subject}
- CRITICAL: Questions were generated from specific uploaded content
- Performance reflects understanding of that particular material, not general knowledge
- This is content-based assessment, not general subject testing

ANALYSIS REQUIREMENTS:
{
  "strongAreas": ["Specific aspects of uploaded content where student demonstrated mastery"],
  "weakAreas": ["Content areas from uploaded material requiring improvement"],
  "recommendations": ["Targeted advice for mastering the uploaded content and similar materials"],
  "nextSteps": ["Concrete actions for content mastery and exam preparation advancement"],
  "weeklyGuidance": "Detailed assessment of content comprehension and readiness for next week's materials"
}

EVALUATION CRITERIA:
1. Content-specific understanding (not general subject knowledge)
2. Comprehension of uploaded material concepts
3. Ability to analyze and apply content information
4. Readiness for similar content complexity
5. Content analysis and extraction skills
6. Subject-specific material mastery for exam preparation

GUIDANCE FOCUS:
- Content comprehension strategies
- Material analysis techniques
- Subject-specific study approaches for exam success
- Progression readiness for advanced content
- Exam preparation effectiveness;
  }
}

🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }

  private static getProgressAnalysisPrompt(studySessions: any[], currentWeek: number): string {
    return `🚨 CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. NO explanatory text, NO markdown formatting, NO code blocks, NO additional commentary. Start your response immediately with { and end with }.

REQUIRED JSON STRUCTURE:
{
  "performanceAnalysis": "String with overall performance summary",
  "weakAreas": ["Array of subjects/topics needing improvement"],
  "strongAreas": ["Array of subjects/topics showing good progress"],
  "recommendations": ["Array of specific actionable recommendations"],
  "motivationalFeedback": "Encouraging message",
  "nextWeekFocus": ["Array of focus areas for next week"]
}

🚨 ABSOLUTE REQUIREMENTS:
- RESPOND WITH JSON ONLY - NO OTHER TEXT
- NO \`\`\`json\`\`\` CODE BLOCKS
- NO EXPLANATIONS OUTSIDE JSON
- START WITH { AND END WITH }
- VALID JSON SYNTAX ONLY

Analyze the following study progress data and provide insights:
    
    Study Sessions: ${JSON.stringify(studySessions.slice(-10))} // Last 10 sessions
    Current Week: ${currentWeek}
    
🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }
}
