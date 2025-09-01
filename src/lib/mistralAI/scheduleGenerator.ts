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
    const isBeginnerLevel = studentProfile.currentLevel === 'beginner';
    const isIntermediateLevel = studentProfile.currentLevel === 'intermediate';

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayOfWeek = currentDate.toLocaleDateString('en-IN', { weekday: 'long' });
      const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
      const weekNumber = Math.ceil((i + 1) / 7);

      const subjectIndex = i % studentProfile.subjects.length;
      const primarySubject = studentProfile.subjects[subjectIndex];
      const secondarySubject = studentProfile.subjects[(subjectIndex + 1) % studentProfile.subjects.length];

      const isPrimaryWeak = studentProfile.weakSubjects.includes(primarySubject);
      const primaryHours = isPrimaryWeak ?
        Math.ceil(studentProfile.dailyAvailableHours * 0.6) :
        Math.ceil(studentProfile.dailyAvailableHours * 0.5);
      const secondaryHours = studentProfile.dailyAvailableHours - primaryHours;

      // Generate specific topics based on progression and level
      const topicNumber = Math.floor(i / studentProfile.subjects.length) + 1;
      const subTopicIndex = i % (isBeginnerLevel ? 4 : isIntermediateLevel ? 3 : 2);
      
      const generateSpecificTopics = (subject: string, isSecondary: boolean = false) => {
        if (isBeginnerLevel) {
          const subTopics = ['Introduction & Basics', 'Core Concepts', 'Examples & Practice', 'Simple Applications'];
          const currentSubTopic = subTopics[subTopicIndex];
          return isSecondary ? [
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Quick Review`,
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Practice Problems`
          ] : [
            `${subject} - Topic ${topicNumber}: ${currentSubTopic}`,
            `${subject} - Topic ${topicNumber}: Step-by-step Learning`
          ];
        } else if (isIntermediateLevel) {
          const subTopics = ['Theory & Concepts', 'Applications', 'Problem Solving'];
          const currentSubTopic = subTopics[subTopicIndex];
          return isSecondary ? [
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Review & Practice`,
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Advanced Problems`
          ] : [
            `${subject} - Topic ${topicNumber}: ${currentSubTopic}`,
            `${subject} - Topic ${topicNumber}: Comprehensive Understanding`
          ];
        } else {
          return isSecondary ? [
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Advanced Review`,
            `${subject} - Topic ${Math.max(1, topicNumber - 1)}: Integration & Synthesis`
          ] : [
            `${subject} - Topic ${topicNumber}: Mastery & Integration`,
            `${subject} - Topic ${topicNumber}: Complex Problem Solving`
          ];
        }
      };
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
            topics: generateSpecificTopics(primarySubject),
            priority: isPrimaryWeak ? 'high' : 'medium',
            studyType: isWeekend ? 'revision' : 'new-concepts',
            breakAfter: studentProfile.breakPreference || 15,
            difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard',
            expectedOutcome: isBeginnerLevel ?
              `Understand basic concepts of Topic ${topicNumber} in ${primarySubject}` :
              `Master Topic ${topicNumber} concepts and applications in ${primarySubject}`
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
            topics: generateSpecificTopics(secondarySubject, true),
            title: `Week ${Math.ceil((index + 1) * diffWeeks / subjects.length)}: ${subject} ${studentProfile?.currentLevel === 'beginner' ? 'Foundation' : 'Mastery'}`,
            description: `${studentProfile?.currentLevel === 'beginner' ? 'Build strong foundation in' : 'Complete comprehensive study and assessment of'} ${subject} topics`,
            breakAfter: studentProfile.breakPreference || 15,
            difficultyLevel: isBeginnerLevel ? 'easy' : 'medium',
            expectedOutcome: `Reinforce previous learning in ${secondarySubject}`
          },
        ],
        totalHours: studentProfile.dailyAvailableHours,
        focusArea: isPrimaryWeak ? 
          `Strengthen ${primarySubject} - Topic ${topicNumber}` : 
          `Balanced Study - ${primarySubject} Topic ${topicNumber}`,
        motivationalNote: isBeginnerLevel ?
          `Day ${i + 1}: Focus on understanding Topic ${topicNumber}. ${isWeekend ? 'Weekend review helps consolidate learning.' : 'Take your time with each concept.'}` :
          `Day ${i + 1}: Master Topic ${topicNumber} concepts. ${isWeekend ? 'Weekend revision strengthens memory.' : 'Build on yesterday\'s progress!'}`,
        weeklyGoal: `Week ${weekNumber}: ${isBeginnerLevel ? 'Build foundation in' : 'Master'} ${primarySubject} Topics ${Math.max(1, topicNumber - 2)}-${topicNumber}`,
        studyPhase: isBeginnerLevel ? 'foundation' : isIntermediateLevel ? 'building' : 'mastery',
        difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard'
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

    if (parsed && parsed.dailySchedule && Array.isArray(parsed.dailySchedule) && parsed.dailySchedule.length > 0) {
      // AI generated a valid schedule, extend it if needed
      const fullSchedule = extendSchedule(parsed, studentProfile, totalDays);
      console.log("✅ Final AI schedule after extension:", fullSchedule);
      
      // Check if extension was successful
      if (fullSchedule.dailySchedule && fullSchedule.dailySchedule.length > 0) {
        return JSON.stringify(fullSchedule);
      } else {
        console.warn("Extension failed, falling back to comprehensive fallback");
      }
    } else {
      console.warn("AI did not generate a valid schedule, using comprehensive fallback");
    }
    
    // Use comprehensive fallback if AI parsing fails or extension fails
    console.log("Using enhanced fallback schedule generation");
    return JSON.stringify({
      dailySchedule: this.generateFallbackFullSchedule(studentProfile, totalDays),
    });
  } catch (error) {
    console.error('Error generating detailed schedule:', error);
    console.log("Error occurred, using enhanced fallback schedule generation");
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
  const isBeginnerLevel = studentProfile.currentLevel === 'beginner';
  const isIntermediateLevel = studentProfile.currentLevel === 'intermediate';
  
  if (!examSyllabus) {
    console.error(`No syllabus found for exam type: ${studentProfile.examType} in fallback function`);
    // Create a comprehensive fallback schedule even without syllabus
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      const weekNumber = Math.ceil((i + 1) / 7);
      const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
      
      // Create more specific fallback topics
      const subjectIndex = i % studentProfile.subjects.length;
      const primarySubject = studentProfile.subjects[subjectIndex];
      const topicNumber = Math.floor(i / studentProfile.subjects.length) + 1;
      
      let specificTopics: string[];
      if (isBeginnerLevel) {
        const subTopics = ['Introduction & Basics', 'Core Concepts', 'Examples & Practice', 'Simple Applications'];
        const currentSubTopic = subTopics[i % 4];
        specificTopics = [
          `${primarySubject} - Chapter ${topicNumber}: ${currentSubTopic}`,
          `${primarySubject} - Chapter ${topicNumber}: Step-by-step Learning`
        ];
      } else if (isIntermediateLevel) {
        const subTopics = ['Theory & Concepts', 'Applications', 'Problem Solving'];
        const currentSubTopic = subTopics[i % 3];
        specificTopics = [
          `${primarySubject} - Chapter ${topicNumber}: ${currentSubTopic}`,
          `${primarySubject} - Chapter ${topicNumber}: Comprehensive Practice`
        ];
      } else {
        specificTopics = [
          `${primarySubject} - Chapter ${topicNumber}: Advanced Concepts & Integration`,
          `${primarySubject} - Chapter ${topicNumber}: Complex Problem Solving`
        ];
      }
      
      schedule.push({
        date: currentDate.toISOString().split("T")[0],
        dayOfWeek,
        subjects: [{
          subject: primarySubject,
          hours: studentProfile.dailyAvailableHours || 6,
          timeSlot: studentProfile.studyPattern === 'morning' ? "6:00 AM - 12:00 PM" : 
                   studentProfile.studyPattern === 'evening' ? "4:00 PM - 10:00 PM" : "9:00 AM - 3:00 PM",
          topics: specificTopics,
          priority: studentProfile.weakSubjects?.includes(primarySubject) ? "high" : "medium",
          studyType: isWeekend ? "revision" : "new-concepts",
          breakAfter: 15,
          difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard',
          expectedOutcome: isBeginnerLevel ?
            `Understand basic concepts of Chapter ${topicNumber} in ${primarySubject}` :
            `Master Chapter ${topicNumber} concepts and applications in ${primarySubject}`
        }],
        totalHours: studentProfile.dailyAvailableHours || 6,
        focusArea: `${primarySubject} - ${isBeginnerLevel ? 'Foundation Building' : 'Concept Mastery'}`,
        motivationalNote: isBeginnerLevel ?
          `Day ${i + 1}: Focus on ${primarySubject} Chapter ${topicNumber}. Take your time to understand each concept thoroughly!` :
          `Day ${i + 1}: Master ${primarySubject} Chapter ${topicNumber}. Build on yesterday's progress!`,
        weeklyGoal: `Week ${weekNumber}: ${isBeginnerLevel ? 'Build foundation in' : 'Master'} ${primarySubject} Chapters ${Math.max(1, topicNumber - 1)}-${topicNumber}`,
        studyPhase: isBeginnerLevel ? 'foundation' : isIntermediateLevel ? 'building' : 'mastery',
        difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard'
      });
    }
    return schedule;
  }


  // Enhanced fallback schedule generation using syllabusBank
  const subjects = studentProfile.subjects || [];
  if (subjects.length === 0) {
    console.error('No subjects found in student profile');
    return [];
  }

  // Enhanced topic tracking with detailed progression
  const topicProgress: Record<string, { 
    currentChapterIndex: number; 
    subTopicIndex: number; 
    chaptersCompleted: number;
    lastStudied: Date | null;
  }> = {};
  
  subjects.forEach(sub => {
    topicProgress[sub] = { 
      currentChapterIndex: 0, 
      subTopicIndex: 0, 
      chaptersCompleted: 0,
      lastStudied: null 
    };
  });

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    const weekNumber = Math.ceil((i + 1) / 7);
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

    const dailySubjects = [];

    for (const subject of subjects) {
      const chapters = examSyllabus[subject] || [`${subject} - Basic Concepts`, `${subject} - Advanced Topics`, `${subject} - Practice`];
      const progress = topicProgress[subject];
      
      // Get current chapter
      const currentChapter = chapters[progress.currentChapterIndex % chapters.length];
      
      // Generate specific topics based on level and progression
      let specificTopics: string[];
      
      if (isBeginnerLevel) {
        // For beginners, break down each chapter into smaller, manageable parts
        const subTopicLabels = ['Introduction & Basics', 'Core Concepts', 'Examples & Practice', 'Simple Applications'];
        const currentSubTopic = subTopicLabels[progress.subTopicIndex % subTopicLabels.length];
        
        specificTopics = [
          `${currentChapter} - ${currentSubTopic}`,
          `${currentChapter} - Step-by-step Understanding`,
          `${currentChapter} - Foundation Building`
        ];
        
        // Advance progression for beginners (slower pace)
        progress.subTopicIndex++;
        if (progress.subTopicIndex >= subTopicLabels.length) {
          progress.subTopicIndex = 0;
          progress.currentChapterIndex++;
          progress.chaptersCompleted++;
        }
      } else if (isIntermediateLevel) {
        // For intermediate, moderate breakdown
        const subTopicLabels = ['Theory & Concepts', 'Applications & Examples', 'Problem Solving & Practice'];
        const currentSubTopic = subTopicLabels[progress.subTopicIndex % subTopicLabels.length];
        
        specificTopics = [
          `${currentChapter} - ${currentSubTopic}`,
          `${currentChapter} - Comprehensive Understanding`,
          `${currentChapter} - Practical Applications`
        ];
        
        // Advance progression for intermediate
        progress.subTopicIndex++;
        if (progress.subTopicIndex >= subTopicLabels.length) {
          progress.subTopicIndex = 0;
          progress.currentChapterIndex++;
          progress.chaptersCompleted++;
        }
      } else {
        // For advanced, comprehensive coverage
        specificTopics = [
          `${currentChapter} - Advanced Concepts & Integration`,
          `${currentChapter} - Complex Problem Solving`,
          `${currentChapter} - Mastery & Applications`
        ];
        
        // Advance progression for advanced (faster pace)
        progress.currentChapterIndex++;
        progress.chaptersCompleted++;
      }

      const allocatedHours = studentProfile.weakSubjects.includes(subject)
        ? Math.ceil((studentProfile.dailyAvailableHours / subjects.length) * 1.4)
        : Math.ceil((studentProfile.dailyAvailableHours / subjects.length) * 0.9);

      // Generate appropriate time slots
      const getTimeSlot = (subjectIndex: number, hours: number) => {
        const baseHour = studentProfile.studyPattern === 'morning' ? 6 :
                        studentProfile.studyPattern === 'evening' ? 16 :
                        studentProfile.studyPattern === 'night' ? 20 : 9;
        const startHour = baseHour + (subjectIndex * Math.ceil(hours));
        const endHour = startHour + hours;
        
        const formatHour = (hour: number) => {
          const adjustedHour = hour % 24;
          const period = adjustedHour >= 12 ? 'PM' : 'AM';
          const displayHour = adjustedHour === 0 ? 12 : adjustedHour > 12 ? adjustedHour - 12 : adjustedHour;
          return `${displayHour}:00 ${period}`;
        };
        
        return `${formatHour(startHour)} - ${formatHour(endHour)}`;
      };

      progress.lastStudied = currentDate;
      topicProgress[subject]++;

      dailySubjects.push({
        subject,
        hours: allocatedHours,
        timeSlot: getTimeSlot(dailySubjects.length, allocatedHours),
        topics: specificTopics,
        priority: studentProfile.weakSubjects.includes(subject) ? "high" : "medium",
        studyType: isWeekend ? "revision" : "new-concepts",
        breakAfter: studentProfile.breakPreference || 15,
        difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard',
        expectedOutcome: isBeginnerLevel ?
          `Understand and practice ${currentChapter} fundamentals` :
          `Master ${currentChapter} concepts and applications`
      });
    }

    // Enhanced mock test scheduling based on level
    if (
      (studentProfile.mockTestFrequency === "daily") ||
      (studentProfile.mockTestFrequency === "weekly" && dayOfWeek === "Sunday") ||
      (isWeekend && weekNumber % (isBeginnerLevel ? 3 : 2) === 0) // Less frequent for beginners
    ) {
      const mockTestTopics = isBeginnerLevel ? [
        `Week ${weekNumber} Concepts Review`,
        "Foundation Assessment",
        "Confidence Building Practice"
      ] : isIntermediateLevel ? [
        `Week ${weekNumber} Comprehensive Review`,
        "Skill Assessment & Analysis",
        "Strategic Improvement Planning"
      ] : [
        `${studentProfile.examType} - Full Length Mock Test`,
        "Advanced Performance Analysis",
        "Strategic Optimization"
      ];
      
      dailySubjects.push({
        subject: isBeginnerLevel ? "Weekly Assessment" : isIntermediateLevel ? "Progress Assessment" : "Full Mock Test",
        hours: isBeginnerLevel ? 
          Math.min(2, studentProfile.dailyAvailableHours * 0.4) :
          Math.min(4, studentProfile.dailyAvailableHours * 0.6),
        timeSlot: studentProfile.studyPattern === 'morning' ? "9:00 AM - 1:00 PM" : "2:00 PM - 6:00 PM",
        topics: mockTestTopics,
        priority: "high",
        studyType: "mock-test",
        breakAfter: 30,
        difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard',
        expectedOutcome: isBeginnerLevel ?
          "Assess foundation building progress and build confidence" :
          "Evaluate comprehensive understanding and exam readiness"
      });
    }

    schedule.push({
      date: currentDate.toISOString().split("T")[0],
      dayOfWeek,
      subjects: dailySubjects,
      totalHours: studentProfile.dailyAvailableHours,
      focusArea: dailySubjects.length > 0 ?
        `${dailySubjects[0].subject} - ${isBeginnerLevel ? 'Foundation Building' : 'Concept Mastery'}` :
        `${studentProfile.examType} - Comprehensive Study`,
      motivationalNote: isBeginnerLevel ?
        `Day ${i + 1}: Focus on understanding each concept thoroughly. Quality over speed builds lasting knowledge!` :
        `Day ${i + 1}: Build on yesterday's learning. Consistency creates excellence!`,
      weeklyGoal: `Week ${weekNumber}: ${isBeginnerLevel ? 'Build strong foundations in' : 'Master key concepts across'} ${subjects.slice(0, 2).join(' & ')}`,
      studyPhase: isBeginnerLevel ? 'foundation' : isIntermediateLevel ? 'building' : 'mastery',
      difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard'
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
        const sampleTopics = topics.slice(0, 5).join(', ');
        return `${subject}: ${sampleTopics}${topicCount > 5 ? ` ... (${topicCount} total topics)` : ''}`;
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

CRITICAL TOPIC GENERATION REQUIREMENTS:
- NEVER use generic terms like "Advanced Concepts", "Quick Review", "Mixed Practice"
- ALWAYS use SPECIFIC topic names from the syllabus provided below
- For ${studentProfile.currentLevel} level students, break down topics appropriately:
  * Beginner: Break each topic into smaller, digestible parts (e.g., "Algebra - Linear Equations Basics", "Algebra - Solving Simple Equations")
  * Intermediate: Use moderate breakdown (e.g., "Algebra - Linear & Quadratic Equations", "Algebra - Advanced Problem Solving")
  * Advanced: Use comprehensive topics (e.g., "Algebra - Complete Mastery & Integration", "Algebra - Complex Applications")
- Each day should have ACTIONABLE, SPECIFIC topics that tell the student exactly what to study
- Progress systematically through the syllabus, ensuring logical topic sequence
- For revision sessions, specify exactly which previous topics to review

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

COMPLETE SYLLABUS FOR TOPIC SELECTION:
${syllabusSummary}

MANDATORY SYLLABUS USAGE INSTRUCTIONS:
- You MUST use the specific topic names provided in the syllabus above
- Progress systematically through each subject's curriculum in logical order
- For ${studentProfile.currentLevel} level students, adjust topic granularity:
  * Beginner: Each syllabus topic should be broken into 3-4 study sessions
  * Intermediate: Each syllabus topic should be covered in 2-3 study sessions  
  * Advanced: Each syllabus topic can be covered in 1-2 comprehensive sessions
- NEVER use generic descriptions - always specify the exact syllabus topic being studied
- Include specific subtopic focus (e.g., "Percentage - Basic Calculations", "Percentage - Advanced Word Problems")

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

TOPIC SPECIFICATION EXAMPLES FOR ${studentProfile.currentLevel.toUpperCase()} LEVEL:
${studentProfile.currentLevel === 'beginner' ? `
GOOD: "Percentage - Introduction to Basic Concepts", "Percentage - Simple Calculation Methods", "Percentage - Practice with Easy Problems"
BAD: "Percentage - Advanced Concepts", "Percentage - Quick Review", "Percentage - Mixed Practice"
` : studentProfile.currentLevel === 'intermediate' ? `
GOOD: "Percentage - Theory & Applications", "Percentage - Word Problems & Real-world Applications", "Percentage - Advanced Problem Solving"
BAD: "Percentage - Advanced Concepts", "Percentage - Quick Review", "Percentage - Mixed Practice"
` : `
GOOD: "Percentage - Complete Mastery & Integration", "Percentage - Complex Multi-step Problems", "Percentage - Advanced Applications & Shortcuts"
BAD: "Percentage - Advanced Concepts", "Percentage - Quick Review", "Percentage - Mixed Practice"
`}
TOPPER'S STRATEGY PRINCIPLES:
1. 80-20 Rule: Focus 80% time on high-weightage topics
2. Weak Subject Priority: Allocate 40% more time to weak subjects
3. Spaced Repetition: Review at 1 day, 3 days, 1 week, 1 month intervals
4. Active Recall: Test without notes every session
5. Mock Tests: ${studentProfile.mockTestFrequency} frequency as specified
6. Revision: ${studentProfile.revisionFrequency} as per preference
7. Progressive Learning: Start with basics, build complexity gradually
8. Specific Focus: Each session should have clear, actionable learning objectives

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
          "topics": ["Specific Syllabus Topic - Detailed Focus Area", "Specific Syllabus Topic - Practical Application"],
          "priority": "high|medium|low",
          "studyType": "new-concepts|practice|revision|mock-test|analysis",
          "breakAfter": 15,
          "difficultyLevel": "easy|medium|hard",
          "expectedOutcome": "Clear learning objective for this session"
        }
      ],
      "totalHours": ${studentProfile.dailyAvailableHours},
      "focusArea": "Primary focus for the day",
      "motivationalNote": "Daily motivation and guidance",
      "weeklyGoal": "Week X goal and milestone",
      "studyPhase": "foundation|building|mastery|revision|final-prep",
      "difficultyLevel": "easy|medium|hard"
    }
  ]
}

CRITICAL TOPIC GENERATION RULES:
1. Use EXACT topic names from the syllabus provided above
2. Break down topics based on student level (${studentProfile.currentLevel})
3. Ensure logical progression through the curriculum
4. Specify clear subtopic focus for each session
5. Avoid generic terms like "Advanced Concepts", "Quick Review", "Mixed Practice"
6. Each topic should tell the student exactly what to study that day
7. For weak subjects (${studentProfile.weakSubjects.join(', ')}), provide more detailed breakdown
8. Include specific learning objectives for each session
SUBJECT ALLOCATION STRATEGY:
- Weak subjects get 40% more time allocation
- Strong subjects maintain regular practice
- Rotate subjects to prevent monotony
- Include cross-subject integration sessions
- Schedule mock tests on ${studentProfile.mockTestFrequency} basis
- Ensure topic progression is appropriate for ${studentProfile.currentLevel} level
- Break down complex topics into manageable daily chunks

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
- Monday-Friday: New concepts and practice (${studentProfile.currentLevel === 'beginner' ? '80% new, 20% revision' : '70% new, 30% revision'})
- Saturday: Comprehensive revision and weak area focus with specific topic review
- Sunday: ${studentProfile.currentLevel === 'beginner' ? 'Weekly consolidation and confidence building' : 'Mock tests and performance analysis'}

MOTIVATION AND GUIDANCE:
- Include daily motivational notes
- Weekly milestone tracking
- Progress celebration points
- Difficulty adjustment suggestions
- Stress management tips
- Level-appropriate encouragement and expectations
- Clear daily learning objectives

CRITICAL REQUIREMENTS: 
- Ensure total daily hours match exactly: ${studentProfile.dailyAvailableHours} hours
- Include SPECIFIC SYLLABUS TOPICS, never generic descriptions
- Use detailed, exam-specific topics from ${studentProfile.examType} syllabus provided above
- Progress systematically through the curriculum for each subject
- Adapt topic granularity to ${studentProfile.currentLevel} level (beginners need smaller chunks)
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
- ENSURE EVERY TOPIC IS SPECIFIC AND ACTIONABLE - tell students exactly what to study each day

MANDATORY: Generate a complete ${totalDays}-day schedule following this expert methodology. The schedule MUST cover every single day from today until the exam date (${studentProfile.examDate}). Do not truncate or limit the schedule - provide all ${totalDays} days with detailed planning for each day.

🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }
}
