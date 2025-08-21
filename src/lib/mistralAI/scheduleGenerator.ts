import { Mistral } from '@mistralai/mistralai';
import { robustParseWithRetry } from "../../utils/jsonParser";
import { extendSchedule } from "../../utils/jsonParser";
import { syllabusBank } from '../../data/syllabusBank'; 

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

// === JSON Cleaning Utility ===
function cleanAIJSON(aiText: string): string {
  let jsonString = aiText;

  // Extract JSON between first { and last }
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON braces found in AI response");
  }
  jsonString = jsonString.substring(firstBrace, lastBrace + 1);

  // Remove Markdown formatting
  jsonString = jsonString.replace(/```json|```/gi, "");
  jsonString = jsonString.replace(/\*\*(.*?)\*\*/g, "$1");
  jsonString = jsonString.replace(/__(.*?)__/g, "$1");
  jsonString = jsonString.replace(/_([^_]+)_/g, "$1");

  // Remove comments
  jsonString = jsonString.replace(/\/\/.*$/gm, "");
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove trailing commas
  jsonString = jsonString.replace(/,\s*([}\]])/g, "$1");

  return jsonString.trim();
}


export class ScheduleGenerator {
  static async generateStudyPlan(examType: string, subjects: string[], availableHours: number, targetDate: string, studentProfile?: any) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return JSON.stringify({
        weeklyBreakdown: [
          { week: 1, focus: "Foundation Building", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 2, focus: "Core Concepts", subjects: ["Chemistry", "Biology"], hours: 28 },
          { week: 3, focus: "Advanced Topics", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 4, focus: "Practice & Review", subjects: ["All Subjects"], hours: 28 }
        ],
        milestones: [
          { title: "Complete Basic Mathematics", description: "Finish algebra and geometry fundamentals", week: 2 },
          { title: "Physics Mechanics Mastery", description: "Master motion, force, and energy concepts", week: 4 },
          { title: "Chemistry Bonding", description: "Understand chemical bonding and reactions", week: 6 },
          { title: "Mock Test Series", description: "Complete first set of practice tests", week: 8 }
        ],
        dailySchedule: {
          morning: "Mathematics (2 hours)",
          afternoon: "Physics (2 hours)", 
          evening: "Review and Practice (1 hour)"
        }
      });
    }

    const prompt = this.getStudyPlanPrompt(examType, subjects, availableHours, targetDate, studentProfile);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || JSON.stringify({
        weeklyBreakdown: [
          { week: 1, focus: "Foundation Building", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 2, focus: "Core Concepts", subjects: ["Chemistry", "Biology"], hours: 28 },
          { week: 3, focus: "Advanced Topics", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 4, focus: "Practice & Review", subjects: ["All Subjects"], hours: 28 }
        ],
        milestones: [
          { title: "Complete Basic Mathematics", description: "Finish algebra and geometry fundamentals", week: 2 },
          { title: "Physics Mechanics Mastery", description: "Master motion, force, and energy concepts", week: 4 },
          { title: "Chemistry Bonding", description: "Understand chemical bonding and reactions", week: 6 },
          { title: "Mock Test Series", description: "Complete first set of practice tests", week: 8 }
        ],
        dailySchedule: {
          morning: "Mathematics (2 hours)",
          afternoon: "Physics (2 hours)", 
          evening: "Review and Practice (1 hour)"
        }
      });
    } catch (error) {
      console.error('Error generating study plan:', error);
      return JSON.stringify({
        weeklyBreakdown: [
          { week: 1, focus: "Foundation Building", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 2, focus: "Core Concepts", subjects: ["Chemistry", "Biology"], hours: 28 },
          { week: 3, focus: "Advanced Topics", subjects: ["Mathematics", "Physics"], hours: 28 },
          { week: 4, focus: "Practice & Review", subjects: ["All Subjects"], hours: 28 }
        ],
        milestones: [
          { title: "Complete Basic Mathematics", description: "Finish algebra and geometry fundamentals", week: 2 },
          { title: "Physics Mechanics Mastery", description: "Master motion, force, and energy concepts", week: 4 },
          { title: "Chemistry Bonding", description: "Understand chemical bonding and reactions", week: 6 },
          { title: "Mock Test Series", description: "Complete first set of practice tests", week: 8 }
        ],
        dailySchedule: {
          morning: "Mathematics (2 hours)",
          afternoon: "Physics (2 hours)", 
          evening: "Review and Practice (1 hour)"
        }
      });
    }
  }


  static async generateDetailedSchedule(studentProfile: any, totalWeeks: number, totalDays: number) {
  // Handle mock AI mode
  if (useMockAI) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const fullSchedule = [];
    const today = new Date();

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayOfWeek = currentDate.toLocaleDateString('en-IN', { weekday: 'long' });
      const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

      const subjectIndex = i % studentProfile.subjects.length;
      const primarySubject = studentProfile.subjects[subjectIndex];
      const secondarySubject = studentProfile.subjects[(subjectIndex + 1) % studentProfile.subjects.length];

      const isPrimaryWeak = studentProfile.weakSubjects.includes(primarySubject);
      const primaryHours = isPrimaryWeak
        ? Math.ceil(studentProfile.dailyAvailableHours * 0.6)
        : Math.ceil(studentProfile.dailyAvailableHours * 0.5);
      const secondaryHours = studentProfile.dailyAvailableHours - primaryHours;

      const dailySchedule = {
        date: currentDate.toISOString().split('T')[0],
        dayOfWeek,
        subjects: [
          {
            subject: primarySubject,
            hours: primaryHours,
            timeSlot:
              studentProfile.studyPattern === 'morning'
                ? '6:00 AM - 10:00 AM'
                : studentProfile.studyPattern === 'evening'
                ? '4:00 PM - 8:00 PM'
                : '8:00 PM - 12:00 AM',
            topics: [`${primarySubject} - Core Concepts`, `${primarySubject} - Practice Questions`],
            priority: isPrimaryWeak ? 'high' : 'medium',
            studyType: isWeekend ? 'revision' : 'new-concepts',
            breakAfter: studentProfile.breakPreference || 15,
          },
          {
            subject: secondarySubject,
            hours: secondaryHours,
            timeSlot:
              studentProfile.studyPattern === 'morning'
                ? '10:30 AM - 12:30 PM'
                : studentProfile.studyPattern === 'evening'
                ? '8:30 PM - 10:30 PM'
                : '1:00 AM - 3:00 AM',
            topics: [`${secondarySubject} - Quick Review`, `${secondarySubject} - Problem Solving`],
            priority: 'medium',
            studyType: 'practice',
            breakAfter: studentProfile.breakPreference || 15,
          },
        ],
        totalHours: studentProfile.dailyAvailableHours,
        focusArea: isPrimaryWeak ? `Strengthen ${primarySubject}` : `Balanced Study`,
        motivationalNote: `Day ${i + 1}: Stay consistent and focused! ${
          isWeekend ? 'Weekend revision day.' : 'Weekday learning focus.'
        }`,
        weeklyGoal: `Week ${Math.ceil((i + 1) / 7)}: Master fundamentals and build confidence`,
      };

      fullSchedule.push(dailySchedule);
    }

    return JSON.stringify({ dailySchedule: fullSchedule });
  }


    // Get the relevant syllabus from the syllabusBank
    const examSyllabus = syllabusBank[studentProfile.examType];
    if (!examSyllabus) {
      console.warn(`Syllabus not found for exam type: ${studentProfile.examType}. Using fallback schedule.`);
      return JSON.stringify({
        dailySchedule: this.generateFallbackFullSchedule(studentProfile, totalDays),
      });
    }

    // Prepare syllabus data for the prompt
    const syllabusForPrompt: Record<string, string[]> = {};
    for (const subject of studentProfile.subjects) {
      if (examSyllabus[subject]) {
        syllabusForPrompt[subject] = examSyllabus[subject];
      }
    }
    

  // Build AI prompt
  const prompt = this.getDetailedSchedulePrompt(studentProfile, totalWeeks, totalDays, syllabusForPrompt);

  try {
    const response = await client!.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 80000,
    });

    const aiResponse = response.choices[0]?.message?.content;
    console.log("⚡ Raw AI response:", aiResponse);


    if (!aiResponse) {
      return JSON.stringify({
        dailySchedule: this.generateFallbackFullSchedule(studentProfile, totalDays),
      });
    }

    // ✅ Use robustParseWithRetry *only on parsing the AI response*
    const parsed = await robustParseWithRetry(() => Promise.resolve(aiResponse));

    // --- ADD CONSOLE LOG HERE ---
      console.log("ScheduleGenerator: Parsed AI response after robustParseWithRetry:", parsed);

    if (parsed && parsed.dailySchedule) {
  const fullSchedule = extendSchedule(parsed, studentProfile, totalDays);
  console.log("✅ Final AI schedule after extension:", fullSchedule);
  return JSON.stringify(fullSchedule);
}
    
    // Fallback if parsing fails
    return JSON.stringify({
      dailySchedule: this.generateFallbackFullSchedule(studentProfile, totalDays),
    });
  } catch (error) {
    console.error('Error generating detailed schedule:', error);
    return JSON.stringify({
      dailySchedule: this.generateFallbackFullSchedule(studentProfile, totalDays),
    });
  }
}

  
  
  private static extractAndParseJSON(aiResponse: string): any {
    // Method 1: Try to find JSON object boundaries
    const firstBrace = aiResponse.indexOf('{');
    const lastBrace = aiResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const scheduleData = aiResponse.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleanAIJSON(scheduleData));
        
        // Validate that it has the expected structure
        if (parsed && (parsed.dailySchedule || Array.isArray(parsed))) {
          return parsed.dailySchedule ? parsed : { dailySchedule: parsed };
        }
      } catch (error) {
        console.warn('Method 1 JSON parsing failed:', error);
      }
    }
    
    // Method 2: Try to find JSON array boundaries (in case response is just an array)
    const firstBracket = aiResponse.indexOf('[');
    const lastBracket = aiResponse.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        const scheduleData = aiResponse.substring(firstBracket, lastBracket + 1);
        const parsed = JSON.parse(cleanAIJSON(scheduleData));

        
        if (Array.isArray(parsed)) {
          return { dailySchedule: parsed };
        }
      } catch (error) {
        console.warn('Method 2 JSON parsing failed:', error);
      }
    }
    
    // Method 3: Try to clean the response and parse
    try {
      // Remove common prefixes and suffixes that AI might add
      let cleanedResponse = aiResponse
        .replace(/^[^{[]*/, '') // Remove everything before first { or [
        .replace(/[^}\]]*$/, ''); // Remove everything after last } or ]
      
      // Try to find and extract complete JSON
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(cleanAIJSON(jsonMatch[0]));
        if (parsed && (parsed.dailySchedule || Array.isArray(parsed))) {
          return parsed.dailySchedule ? parsed : { dailySchedule: parsed };
        }
      }
    } catch (error) {
      console.warn('Method 3 JSON parsing failed:', error);
    }
    
    // Method 4: Try parsing the entire response as-is (last resort)
    try {
      const parsed = JSON.parse(cleanAIJSON(aiResponse));
      if (parsed && (parsed.dailySchedule || Array.isArray(parsed))) {
        return parsed.dailySchedule ? parsed : { dailySchedule: parsed };
      }
    } catch (error) {
      console.warn('Method 4 JSON parsing failed:', error);
    }
    
    throw new Error('Unable to extract valid JSON from AI response');
  }
  
  private static generateFallbackFullSchedule(studentProfile: any, totalDays: number) {
  const schedule = [];
  const today = new Date();
  
  // Use the imported syllabusBank instead of defining a new one
  const examSyllabus = syllabusBank[studentProfile.examType];
  if (!examSyllabus) {
    console.error(`No syllabus found for exam type: ${studentProfile.examType} in fallback function`);
    // Create a minimal fallback schedule
    for (let i = 0; i < Math.min(totalDays, 7); i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      
      schedule.push({
        date: currentDate.toISOString().split("T")[0],
        dayOfWeek,
        subjects: [{
          subject: studentProfile.subjects[0] || "General Study",
          hours: studentProfile.dailyAvailableHours || 6,
          timeSlot: "9:00 AM - 3:00 PM",
          topics: ["Basic Concepts", "Practice Questions"],
          priority: "medium",
          studyType: "study",
          breakAfter: 15
        }],
        totalHours: studentProfile.dailyAvailableHours || 6,
        focusArea: "Foundation Building",
        motivationalNote: `Day ${i + 1}: Building strong foundations`,
        weeklyGoal: "Week 1: Establish study routine"
      });
    }
    return schedule;
  }


  // Use the imported syllabusBank with correct casing
  const subjects = studentProfile.subjects || [];
  if (subjects.length === 0) {
    console.error('No subjects found in student profile');
    return [];
  }

  const topicProgress: Record<string, number> = {};
  subjects.forEach(sub => (topicProgress[sub] = 0));

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });

    const dailySubjects = [];

    for (const subject of subjects) {
      const chapters = examSyllabus[subject] || [`${subject} - Basic Concepts`, `${subject} - Advanced Topics`, `${subject} - Practice`];
      const chapterIndex = topicProgress[subject] % chapters.length;
      const chapterName = chapters[chapterIndex];

      const allocatedHours = studentProfile.weakSubjects.includes(subject)
        ? Math.ceil((studentProfile.dailyAvailableHours / subjects.length) * 1.4)
        : Math.ceil((studentProfile.dailyAvailableHours / subjects.length) * 0.9);

      topicProgress[subject]++;

      dailySubjects.push({
        subject,
        hours: allocatedHours,
        timeSlot: `${6 + dailySubjects.length * 2}:00 AM - ${6 + dailySubjects.length * 2 + allocatedHours}:00 AM`,
        topics: [chapterName, `${subject} – Practice & PYQs`],
        priority: studentProfile.weakSubjects.includes(subject) ? "high" : "medium",
        studyType: dayOfWeek === "Sunday" ? "revision" : "new-concepts",
        breakAfter: studentProfile.breakPreference || 15
      });
    }

    // Mock test based on frequency
    if (
      (studentProfile.mockTestFrequency === "daily") ||
      (studentProfile.mockTestFrequency === "weekly" && dayOfWeek === "Sunday") ||
      ((i + 1) % 7 === 0 && !studentProfile.mockTestFrequency)
    ) {
      dailySubjects.push({
        subject: "Full Mock Test & Analysis",
        hours: studentProfile.dailyAvailableHours,
        timeSlot: "9:00 AM - 4:00 PM",
        topics: ["Simulated Exam", "Error Log Review", "Weak Area Reinforcement"],
        priority: "high",
        studyType: "mock-test",
        breakAfter: 30
      });
    }

    schedule.push({
      date: currentDate.toISOString().split("T")[0],
      dayOfWeek,
      subjects: dailySubjects,
      totalHours: studentProfile.dailyAvailableHours,
      focusArea: `Master all ${studentProfile.examType} subjects daily`,
      motivationalNote: `Day ${i + 1}: Consistency wins over intensity.`,
      weeklyGoal: `Week ${Math.ceil((i + 1) / 7)}: Cover next chapters in all subjects`
    });
  }

  return schedule;
}


  private static getStudyPlanPrompt(examType: string, subjects: string[], availableHours: number, targetDate: string, studentProfile?: any): string {
    const profileInfo = studentProfile ? `
    Student Profile:
    - Current level: ${studentProfile.currentLevel}
    - Weak subjects: ${studentProfile.weakSubjects?.join(', ') || 'None specified'}
    - Preferred study time: ${studentProfile.preferredStudyTime}
    - Learning style: ${studentProfile.learningStyle || 'mixed'}
    - Content preference: ${studentProfile.contentPreference || 'balanced'}
    - Motivation level: ${studentProfile.motivationLevel || 'medium'}
    - Common distractions: ${studentProfile.commonDistractions?.join(', ') || 'None specified'}
    - Short-term goal: ${studentProfile.shortTermGoal || 'Not specified'}
    ` : '';

    return `Create a comprehensive study plan for ${examType} exam with the following details:
    - Subjects: ${subjects.join(', ')}
    - Available daily hours: ${availableHours}
    - Target date: ${targetDate}
    ${profileInfo}
    
    Please provide a JSON response with:
    1. weeklyBreakdown: Array of weeks with focus areas and hours
    2. milestones: Array of important milestones with titles and descriptions
    3. dailySchedule: Object with morning, afternoon, evening study plans
    
    Consider the student's learning style, motivation level, and distractions when creating the plan.
    Tailor the approach based on their content preference and short-term goals.
    
    Format the response as a valid JSON object.`;
  }

  private static getDetailedSchedulePrompt(studentProfile: any, totalWeeks: number, totalDays: number): string {
    // Create a concise syllabus summary instead of sending the full syllabus
    const examSyllabus = syllabusBank[studentProfile.examType];
    let syllabusSummary = '';
    
    if (examSyllabus && studentProfile.subjects) {
      syllabusSummary = studentProfile.subjects.map((subject: string) => {
        const topics = examSyllabus[subject] || [];
        const topicCount = topics.length;
        const sampleTopics = topics.slice(0, 3).join(', ');
        return `${subject}: ${sampleTopics}${topicCount > 3 ? ` ... (${topicCount} total topics)` : ''}`;
      }).join('\n');
    }

    return `🚨 CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. NO explanatory text, NO markdown formatting, NO code blocks, NO additional commentary. Start your response immediately with { and end with }.
    

🚨 ABSOLUTE REQUIREMENTS:
- RESPOND WITH JSON ONLY - NO OTHER TEXT
- NO \`\`\`json\`\`\` CODE BLOCKS
- NO EXPLANATIONS OUTSIDE JSON
- START WITH { AND END WITH }
- VALID JSON SYNTAX ONLY

    
    You are an expert study mentor with 20+ years of experience helping students achieve top ranks in competitive exams. Create a comprehensive, day-by-day study schedule for ${studentProfile.examType} preparation.

STUDENT PROFILE:
- Exam: ${studentProfile.examType}
- Target Date: ${studentProfile.examDate}
- Current Level: ${studentProfile.currentLevel}
- Daily Available Hours: ${studentProfile.dailyAvailableHours}
- Study Pattern: ${studentProfile.studyPattern}
- Concentration Span: ${studentProfile.concentrationSpan} minutes
- Break Preference: ${studentProfile.breakPreference} minutes
- Subjects: ${studentProfile.subjects.join(', ')}
- Weak Subjects: ${studentProfile.weakSubjects.join(', ')}
- Strong Subjects: ${studentProfile.strongSubjects.join(', ')}

SYLLABUS OVERVIEW (for reference):
${syllabusSummary}

SYLLABUS INSTRUCTIONS:
- Use your knowledge of ${studentProfile.examType} syllabus to create detailed daily topics
- Progress systematically through each subject's curriculum
- Ensure comprehensive coverage of all important topics
- Prioritize weak subjects with more detailed topic breakdown
- Include both theory and practice components for each topic

- Revision Frequency: ${studentProfile.revisionFrequency}
- Mock Test Frequency: ${studentProfile.mockTestFrequency}
- Previous Experience: ${studentProfile.previousExperience}
- Target Score: ${studentProfile.targetScore}%
${studentProfile.learningStyle ? `- Learning Style: ${studentProfile.learningStyle}` : ''}
${studentProfile.contentPreference ? `- Content Preference: ${studentProfile.contentPreference}` : ''}
${studentProfile.motivationLevel ? `- Motivation Level: ${studentProfile.motivationLevel}` : ''}
${studentProfile.commonDistractions ? `- Common Distractions: ${studentProfile.commonDistractions.join(', ')}` : ''}
${studentProfile.shortTermGoal ? `- Short-term Goal: ${studentProfile.shortTermGoal}` : ''}

SCHEDULE REQUIREMENTS:
- Total Duration: ${totalWeeks} weeks (${totalDays} days)
- Daily study hours: ${studentProfile.dailyAvailableHours}
- Preferred study time: ${studentProfile.studyPattern}
- Break every ${studentProfile.concentrationSpan} minutes for ${studentProfile.breakPreference} minutes
${studentProfile.learningStyle ? `- Adapt content delivery for ${studentProfile.learningStyle} learning style` : ''}
${studentProfile.contentPreference ? `- Balance theory/practice based on ${studentProfile.contentPreference} preference` : ''}
${studentProfile.motivationLevel === 'low' ? '- Include extra motivational elements and shorter initial sessions' : ''}
${studentProfile.commonDistractions?.length > 0 ? `- Account for distraction management: ${studentProfile.commonDistractions.join(', ')}` : ''}

TOPPER'S STRATEGY PRINCIPLES:
1. 80-20 Rule: Focus 80% time on high-weightage topics
2. Weak Subject Priority: Allocate 40% more time to weak subjects
3. Spaced Repetition: Review at 1 day, 3 days, 1 week, 1 month intervals
4. Active Recall: Test without notes every session
5. Mock Tests: ${studentProfile.mockTestFrequency} frequency as specified
6. Revision: ${studentProfile.revisionFrequency} as per preference

DAILY SCHEDULE FORMAT:
Create a detailed day-by-day schedule with the following JSON structure:

{
  "dailySchedule": [
    {
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "subjects": [
        {
          "subject": "Subject Name",
          "hours": 2.5,
          "timeSlot": "6:00 AM - 8:30 AM",
          "topics": ["Specific Topic 1", "Specific Topic 2"],
          "priority": "high|medium|low",
          "studyType": "new-concepts|practice|revision|mock-test|analysis",
          "breakAfter": 15
        }
      ],
      "totalHours": ${studentProfile.dailyAvailableHours},
      "focusArea": "Primary focus for the day",
      "motivationalNote": "Daily motivation and guidance",
      "weeklyGoal": "Week X goal and milestone"
    }
  ]
}

SUBJECT ALLOCATION STRATEGY:
- Weak subjects get 40% more time allocation
- Strong subjects maintain regular practice
- Rotate subjects to prevent monotony
- Include cross-subject integration sessions
- Schedule mock tests on ${studentProfile.mockTestFrequency} basis

TIME SLOT ALLOCATION BASED ON STUDY PATTERN:
${studentProfile.studyPattern === 'morning' ? 
  '- Peak hours: 5:00 AM - 10:00 AM (most difficult subjects)\n- Secondary: 10:30 AM - 12:30 PM (practice)\n- Evening: 4:00 PM - 6:00 PM (revision)' :
  studentProfile.studyPattern === 'evening' ?
  '- Afternoon: 2:00 PM - 5:00 PM (new concepts)\n- Peak hours: 6:00 PM - 9:00 PM (most difficult subjects)\n- Night: 9:30 PM - 11:00 PM (revision)' :
  studentProfile.studyPattern === 'night' ?
  '- Evening: 7:00 PM - 9:00 PM (warm-up)\n- Peak hours: 9:30 PM - 12:30 AM (most difficult subjects)\n- Late night: 1:00 AM - 2:00 AM (light revision)' :
  '- Flexible timing based on daily schedule\n- Maintain consistency in peak performance hours\n- Adapt to daily energy levels'
}

WEEKLY PATTERN:
- Monday-Friday: New concepts and practice (70% new, 30% revision)
- Saturday: Comprehensive revision and weak area focus
- Sunday: Mock tests and performance analysis

MOTIVATION AND GUIDANCE:
- Include daily motivational notes
- Weekly milestone tracking
- Progress celebration points
- Difficulty adjustment suggestions
- Stress management tips

CRITICAL REQUIREMENTS: 
- Ensure total daily hours match exactly: ${studentProfile.dailyAvailableHours} hours
- Include specific topics, not just subject names
- Use detailed, exam-specific topics from ${studentProfile.examType} syllabus
- Progress systematically through the curriculum for each subject
- Balance theory, practice, and revision
- Account for breaks and meal times
- Provide realistic and achievable daily targets
- Include buffer time for unexpected delays
- MUST generate schedule for ALL ${totalDays} days until the target exam date
- NEVER limit to 14 days or any other number - create COMPLETE schedule until exam date
- Each day must be unique and progressive in difficulty and topics
- Include weekend variations and mock test days
- Ensure proper subject rotation and revision cycles
- Account for increasing intensity as exam approaches

MANDATORY: Generate a complete ${totalDays}-day schedule following this expert methodology. The schedule MUST cover every single day from today until the exam date (${studentProfile.examDate}). Do not truncate or limit the schedule - provide all ${totalDays} days with detailed planning for each day.

🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }
}
