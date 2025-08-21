import { Mistral } from '@mistralai/mistralai';
import { safeParseJSON } from '../../utils/jsonParser';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

export class AIMentor {
  static async provideMentorship(question: string, userProgress: any, examType: string) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        `Great question about ${examType}! Based on your progress, I recommend focusing on consistent daily practice. Your current performance shows good potential - keep building on your strengths while addressing weak areas systematically.`,
        `For ${examType} preparation, I suggest breaking down complex topics into smaller, manageable chunks. Your study pattern shows dedication, and with targeted practice in your weak areas, you'll see significant improvement.`,
        `Excellent progress so far! For ${examType}, consistency is key. I notice you're doing well in some subjects - use that confidence to tackle challenging topics. Remember, every expert was once a beginner.`,
        `Based on your study data, you're on the right track for ${examType}. I recommend creating a revision schedule and practicing more mock tests. Your analytical skills are developing well - keep pushing forward!`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }

    const prompt = this.getMentorshipPrompt(question, userProgress, examType);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'I\'m here to help with your studies! Please feel free to ask any questions about your exam preparation.';
    } catch (error) {
      console.error('Error providing mentorship:', error);
      return 'I\'m here to help with your studies! Please feel free to ask any questions about your exam preparation.';
    }
  }

  static async extractPDFContent(content: string, examType: string) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return JSON.stringify({
        topics: ["Quadratic Equations", "Coordinate Geometry", "Trigonometry", "Calculus Basics"],
        formulas: ["ax² + bx + c = 0", "Distance formula", "sin²θ + cos²θ = 1"],
        practiceQuestions: ["Solve: x² - 5x + 6 = 0", "Find distance between (1,2) and (4,6)"],
        relevanceScore: 8,
        studyApproach: "Focus on understanding concepts before memorizing formulas. Practice numerical problems daily."
      });
    }

    const prompt = this.getContentExtractionPrompt(content, examType);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2, // Lower temperature for consistent JSON
        max_tokens: 2000,
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.warn('No AI response received for PDF content extraction');
        return JSON.stringify({
          topics: ["Quadratic Equations", "Coordinate Geometry", "Trigonometry", "Calculus Basics"],
          formulas: ["ax² + bx + c = 0", "Distance formula", "sin²θ + cos²θ = 1"],
          practiceQuestions: ["Solve: x² - 5x + 6 = 0", "Find distance between (1,2) and (4,6)"],
          relevanceScore: 8,
          studyApproach: "Focus on understanding concepts before memorizing formulas. Practice numerical problems daily."
        });
      }

      // Use robust JSON parsing
      const parsedContent = safeParseJSON<{
        topics: string[];
        formulas: string[];
        practiceQuestions: string[];
        relevanceScore: number;
        studyApproach: string;
      }>(aiResponse);
      
      if (parsedContent) {
        return JSON.stringify(parsedContent);
      }
      
      console.warn('Failed to parse AI PDF content extraction, using fallback');
      return JSON.stringify({
        topics: ["Quadratic Equations", "Coordinate Geometry", "Trigonometry", "Calculus Basics"],
        formulas: ["ax² + bx + c = 0", "Distance formula", "sin²θ + cos²θ = 1"],
        practiceQuestions: ["Solve: x² - 5x + 6 = 0", "Find distance between (1,2) and (4,6)"],
        relevanceScore: 8,
        studyApproach: "Focus on understanding concepts before memorizing formulas. Practice numerical problems daily."
      });
    } catch (error) {
      console.error('Error extracting PDF content:', error);
      return JSON.stringify({
        topics: ["Quadratic Equations", "Coordinate Geometry", "Trigonometry", "Calculus Basics"],
        formulas: ["ax² + bx + c = 0", "Distance formula", "sin²θ + cos²θ = 1"],
        practiceQuestions: ["Solve: x² - 5x + 6 = 0", "Find distance between (1,2) and (4,6)"],
        relevanceScore: 8,
        studyApproach: "Focus on understanding concepts before memorizing formulas. Practice numerical problems daily."
      });
    }
  }

  private static getMentorshipPrompt(question: string, userProgress: any, examType: string): string {
    return `As an AI mentor for ${examType} exam preparation, answer this question: "${question}"
    
    User's current progress: ${JSON.stringify(userProgress)}
    
    Provide personalized guidance considering their progress, strengths, and weaknesses.
    Be encouraging, specific, and actionable in your response. Keep it conversational and supportive.`;
  }

  private static getContentExtractionPrompt(content: string, examType: string): string {
    return `🚨 CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. NO explanatory text, NO markdown formatting, NO code blocks, NO additional commentary. Start your response immediately with { and end with }.

REQUIRED JSON STRUCTURE:
{
  "topics": ["Array of key topics and concepts"],
  "formulas": ["Array of important formulas/definitions"],
  "practiceQuestions": ["Array of practice questions if any"],
  "relevanceScore": 8,
  "studyApproach": "String with suggested study approach"
}

🚨 ABSOLUTE REQUIREMENTS:
- RESPOND WITH JSON ONLY - NO OTHER TEXT
- NO ``\`json``\` CODE BLOCKS
- NO EXPLANATIONS OUTSIDE JSON
- START WITH { AND END WITH }
- VALID JSON SYNTAX ONLY

Extract and organize the following content for ${examType} exam preparation:
    
    Content: ${content.substring(0, 3000)}...
    
🚨 FINAL REMINDER: RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER. START WITH { AND END WITH }.`;
  }
}