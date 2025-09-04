import { Mistral } from '@mistralai/mistralai';
import { safeParseJSON, parseFirstJSONCandidate  } from '../../utils/jsonParser';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

export class QuestionGenerator {
  static async generateTestQuestions(content: string, subject: string) {
    if (useMockAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract actual content for better mock questions
      const contentLines = content.split('\n').filter(line => line.trim().length > 10);
      const keyTerms = content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 20) || [];
      const hasFormulas = /[=+\-*/()0-9]/.test(content);
      const hasDefinitions = /definition|concept|principle|theory|law/i.test(content);
      const hasExamples = /example|instance|case|illustration/i.test(content);
      const hasSteps = /step|process|method|procedure/i.test(content);
      
      // Extract specific phrases from content
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 10);
      const firstSentence = sentences[0]?.trim() || `This ${subject} content covers important concepts`;
      

      const rawQuestions = [
          {
            id: '1',
            question: `Based on the uploaded content, which statement best describes the main topic discussed?`,
            options: [
              firstSentence.length > 50 ? firstSentence.substring(0, 50) + '...' : 'Core concepts and principles',
              hasFormulas ? 'Mathematical calculations and formulas' : 'Theoretical frameworks',
              hasExamples ? 'Practical applications and examples' : 'General overview',
              'Background information only'
            ],
            correctAnswer: 0,
            explanation: 'This is the main focus based on the uploaded content analysis.',
            topic: 'Main Concepts'
          },
          {
            id: '2',
            question: keyTerms.length > 0 ? 
              `The uploaded content mentions "${keyTerms[0]}" in the context of:` :
              `According to the material, what is the key approach for understanding this ${subject} topic?`,
            options: [
              hasSteps ? 'Following systematic procedures' : 'Understanding fundamental principles',
              hasDefinitions ? 'Learning key definitions' : 'Applying theoretical knowledge',
              hasExamples ? 'Studying practical examples' : 'Memorizing important facts',
              'General overview approach'
            ],
            correctAnswer: 0,
            explanation: 'This approach is emphasized in the uploaded material.',
            topic: 'Learning Approach'
          },
          {
            id: '3',
            question: contentLines.length > 0 ? 
              `The content states that the most important aspect is:` :
              `What does the uploaded material emphasize as most important?`,
            options: [
              hasDefinitions ? 'Understanding core definitions' : 'Grasping basic principles',
              hasFormulas ? 'Mastering mathematical relationships' : 'Learning key concepts',
              hasExamples ? 'Analyzing practical examples' : 'Studying theoretical aspects',
              'Memorizing all information'
            ],
            correctAnswer: 0,
            explanation: 'This is highlighted as the most important aspect in the content.',
            topic: 'Key Concepts'
          },
          {
            id: '4',
            question: sentences.length > 1 ? 
              `According to the material, which statement is most accurate?` :
              `The uploaded content primarily focuses on:`,
            options: [
              sentences[1]?.trim().substring(0, 60) + '...' || 'Detailed explanations of concepts',
              hasFormulas ? 'Mathematical formulations' : 'Conceptual understanding',
              hasExamples ? 'Real-world applications' : 'Theoretical principles',
              'General background information'
            ],
            correctAnswer: 0,
            explanation: 'This statement accurately reflects the content focus.',
            topic: 'Content Analysis'
          },
          {
            id: '5',
            question: keyTerms.length > 1 ? 
              `The content discusses "${keyTerms[1]}" in relation to:` :
              `What learning sequence does the material suggest?`,
            options: [
              hasSteps ? 'Following the outlined steps' : 'Starting with fundamentals',
              hasExamples ? 'Learning through examples' : 'Building on basic concepts',
              hasDefinitions ? 'Mastering definitions first' : 'Understanding principles',
              'Jumping to advanced topics'
            ],
            correctAnswer: 0,
            explanation: 'This sequence is recommended based on the content structure.',
            topic: 'Learning Strategy'
          },
          {
            id: '6',
            question: contentLines.length > 2 ? 
              `The material explains that:` :
              `According to the uploaded content, which is true?`,
            options: [
              contentLines[2]?.trim().substring(0, 50) + '...' || 'Key concepts are interconnected',
              hasFormulas ? 'Calculations are the primary focus' : 'Theory is most important',
              hasExamples ? 'Examples illustrate main points' : 'Concepts build upon each other',
              'All information is equally important'
            ],
            correctAnswer: 0,
            explanation: 'This explanation is provided in the uploaded material.',
            topic: 'Content Understanding'
          }
        ];
      const shuffledQuestions = rawQuestions.map(q => this.shuffleQuestionOptions(q));
      return JSON.stringify({ questions: shuffledQuestions });


    }

    const prompt = this.getTestQuestionsPrompt(content, subject);

    try {
      const response = await client!.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1, // Very low temperature for consistent JSON output
        max_tokens: 4000,
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.warn('No AI response received for question generation');
        return JSON.stringify({
          questions: [
            {
              id: '1',
              question: `Based on the uploaded content, what is the main topic discussed?`,
              options: ['Content-specific concept', 'Alternative concept', 'Different approach', 'General overview'],
              correctAnswer: 0,
              explanation: 'This is the main focus of the uploaded material.',
              topic: 'Main Content'
            }
          ]
        });
      }

      // Use robust JSON parsing
      const parsedQuestions = safeParseJSON<{ questions: any[] }>(aiResponse);
      
     if (parsedQuestions && parsedQuestions.questions && Array.isArray(parsedQuestions.questions)) {
  const shuffled = parsedQuestions.questions.map(q => this.shuffleQuestionOptions(q));
  return JSON.stringify({ questions: shuffled });
}

      

      let parsed: any | null = parseFirstJSONCandidate(aiResponse);

      if (!parsed) {
  const firstBrace = aiResponse.indexOf('{');
  const lastBrace = aiResponse.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      parsed = JSON.parse(aiResponse.substring(firstBrace, lastBrace + 1));
    } catch (e) {
      // ignore - we already attempted multi-pass parsing above
    }
  }
}

if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
  const shuffled = parsed.questions.map(q => this.shuffleQuestionOptions(q));
  return JSON.stringify({ questions: shuffled });
}



      // console.warn('Failed to parse AI question response, using fallback');
    } catch (error: any) {
      console.error('Error generating test questions:', error);
      // Wrap and rethrow so UI can show popup
  const errMsg = error?.message ?? String(error);
  const e = new Error(errMsg);
  (e as any).code = error?.code ?? error?.status ?? "GENERATION_FAILED";
  throw e;
    }
  }
   private static shuffleQuestionOptions(question: any): any {
  const options = [...question.options];
  const correctAnswerIndex = question.correctAnswer; 
  const correctAnswerText = options[correctAnswerIndex];

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Find new index of the correct answer
  const newCorrectAnswer = options.findIndex(opt => opt === correctAnswerText);

  return {
    ...question,
    options,
    correctAnswer: newCorrectAnswer,
  };
}



  private static getTestQuestionsPrompt(content: string, subject: string): string {
    const truncatedContent = content.length > 500000 ? content.substring(0, 500000) + '...' : content;

    return `CRITICAL: You must generate questions EXCLUSIVELY from the actual content provided. Extract specific information, facts, concepts, examples, and details ONLY from the given text.

Subject: ${subject}

ACTUAL CONTENT TO ANALYZE:
${truncatedContent}

INSTRUCTIONS:
1. Read the content thoroughly and identify specific facts, concepts, definitions, examples, procedures, or statements
2. Create questions that test understanding of SPECIFIC information from this content
3. Use exact terms, phrases, concepts, and examples mentioned in the text
4. Questions should be answerable ONLY by someone who has read this specific content
5. Avoid any generic knowledge - focus on content-specific details
6. Extract key sentences, definitions, examples, or explanations from the text
7. Create options using actual information from the content
8. Make questions challenging but directly related to the provided material

CONTENT ANALYSIS REQUIREMENTS:
- Identify specific facts, figures, definitions, examples mentioned
- Extract key concepts, principles, or theories explained
- Note any procedures, steps, or methods described
- Find specific examples, case studies, or illustrations provided
- Look for cause-effect relationships, comparisons, or explanations
- Identify any formulas, equations, or technical details

Generate 10-15 multiple choice questions with these requirements:

JSON Response Format:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Question using specific information from the content",
      "options": ["Correct answer from content", "Plausible but incorrect", "Another incorrect option", "Fourth incorrect option"],
      "correctAnswer": 0,
      "explanation": "Explanation citing specific part of the content",
      "topic": "Specific topic/concept from the material"
    }
  ]
}

QUESTION TYPES TO CREATE:
1. Direct fact questions: "According to the content, what is..."
2. Definition questions: "The material defines X as..."
3. Example-based questions: "The content provides an example of..."
4. Process questions: "The described procedure involves..."
5. Relationship questions: "The content explains that X relates to Y by..."
6. Application questions: "Based on the material, how would you..."

Remember: Every question must be answerable ONLY from the provided content. Do not use external knowledge.`;
  }
}