import { supabase } from '../supabase';

export interface RAGContext {
  relevantMaterials: {
    filename: string;
    content: string;
    relevanceScore: number;
    extractedTopics: string[];
    uploadDate: string;
  }[];
  studyHistory: {
    subject: string;
    topics: string[];
    performance: number;
    lastStudied: string;
  }[];
  weaknessContext: {
    subject: string;
    weakAreas: string[];
    mistakePatterns: string[];
    improvementNeeded: number;
  }[];
  strengthContext: {
    subject: string;
    strongAreas: string[];
    masteredTopics: string[];
    confidenceLevel: number;
  }[];
}

export class RAGEnhancer {
  static async getEnhancedContext(
    query: string, 
    userId: string, 
    contextType: 'question' | 'guidance' | 'analysis' = 'question'
  ): Promise<RAGContext> {
    try {
      // Extract key terms from query for better matching
      const queryTerms = this.extractKeyTerms(query);
      
      // Get relevant materials with advanced matching
      const relevantMaterials = await this.getRelevantMaterials(userId, queryTerms, contextType);
      
      // Get study history context
      const studyHistory = await this.getStudyHistoryContext(userId, queryTerms);
      
      // Get weakness context
      const weaknessContext = await this.getWeaknessContext(userId, queryTerms);
      
      // Get strength context
      const strengthContext = await this.getStrengthContext(userId, queryTerms);

      return {
        relevantMaterials,
        studyHistory,
        weaknessContext,
        strengthContext
      };
    } catch (error) {
      console.error('Error getting enhanced RAG context:', error);
      return {
        relevantMaterials: [],
        studyHistory: [],
        weaknessContext: [],
        strengthContext: []
      };
    }
  }

  private static extractKeyTerms(query: string): string[] {
    // Extract meaningful terms from the query
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must', 'ought', 'how', 'what', 'when', 'where', 'why', 'who', 'whom', 'whose', 'which', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
    
    const words = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Add subject and topic detection
    const subjects = ['mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography', 'economics', 'english', 'reasoning', 'aptitude'];
    const detectedSubjects = words.filter(word => 
      subjects.some(subject => subject.includes(word) || word.includes(subject))
    );
    
    return [...new Set([...words, ...detectedSubjects])];
  }

  private static async getRelevantMaterials(
    userId: string, 
    queryTerms: string[], 
    contextType: string
  ) {
    try {
      const { data: materials, error } = await supabase
        .from('uploaded_materials')
        .select('*')
        .eq('user_id', userId)
        .gte('exam_relevance_score', 3);

      if (error || !materials) return [];

      // Advanced relevance scoring
      const scoredMaterials = materials.map(material => {
        let relevanceScore = material.exam_relevance_score || 0;
        const content = (material.extracted_content || '').toLowerCase();
        const filename = (material.filename || '').toLowerCase();
        const topics = material.processed_topics || [];

        // Boost score based on query term matches
        queryTerms.forEach(term => {
          // Content matches (weighted by frequency)
          const contentMatches = (content.match(new RegExp(term, 'gi')) || []).length;
          relevanceScore += contentMatches * 0.5;

          // Filename matches (higher weight)
          if (filename.includes(term)) {
            relevanceScore += 2;
          }

          // Topic matches (highest weight)
          if (topics.some((topic: string) => topic.toLowerCase().includes(term))) {
            relevanceScore += 3;
          }

          // Exact phrase matches (bonus)
          if (content.includes(queryTerms.join(' '))) {
            relevanceScore += 5;
          }
        });

        // Context-specific boosting
        if (contextType === 'analysis' && content.includes('analysis')) relevanceScore += 1;
        if (contextType === 'guidance' && content.includes('method')) relevanceScore += 1;

        return {
          ...material,
          calculatedRelevance: relevanceScore
        };
      });

      // Sort by relevance and return top materials
      return scoredMaterials
        .sort((a, b) => b.calculatedRelevance - a.calculatedRelevance)
        .slice(0, 5)
        .map(material => ({
          filename: material.filename,
          content: this.extractRelevantSections(material.extracted_content || '', queryTerms),
          relevanceScore: Math.round(material.calculatedRelevance * 10) / 10,
          extractedTopics: material.processed_topics || [],
          uploadDate: material.created_at
        }));
    } catch (error) {
      console.error('Error getting relevant materials:', error);
      return [];
    }
  }

  private static extractRelevantSections(content: string, queryTerms: string[]): string {
    if (!content || queryTerms.length === 0) return content.substring(0, 1000);

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 50);

    // Score sentences based on query term presence
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      const lowerSentence = sentence.toLowerCase();
      
      queryTerms.forEach(term => {
        if (lowerSentence.includes(term)) {
          score += 1;
          // Bonus for multiple occurrences
          const matches = (lowerSentence.match(new RegExp(term, 'g')) || []).length;
          score += (matches - 1) * 0.5;
        }
      });

      return { sentence, score };
    });

    // Get top relevant sentences
    const relevantSentences = scoredSentences
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.sentence);

    if (relevantSentences.length > 0) {
      return relevantSentences.join('. ') + '.';
    }

    // Fallback to first few paragraphs
    return paragraphs.slice(0, 3).join('\n\n').substring(0, 2000);
  }

  private static async getStudyHistoryContext(userId: string, queryTerms: string[]) {
    try {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !sessions) return [];

      // Group by subject and analyze
      const subjectGroups: Record<string, any[]> = {};
      sessions.forEach(session => {
        if (!subjectGroups[session.subject]) {
          subjectGroups[session.subject] = [];
        }
        subjectGroups[session.subject].push(session);
      });

      return Object.entries(subjectGroups).map(([subject, subjectSessions]) => {
        const allTopics = [...new Set(subjectSessions.flatMap(s => s.topics_covered || []))];
        const averagePerformance = subjectSessions.reduce((sum, s) => sum + s.performance_score, 0) / subjectSessions.length;
        const lastStudied = subjectSessions[0]?.created_at || '';

        // Filter topics relevant to query
        const relevantTopics = queryTerms.length > 0 
          ? allTopics.filter(topic => 
              queryTerms.some(term => topic.toLowerCase().includes(term))
            )
          : allTopics.slice(0, 5);

        return {
          subject,
          topics: relevantTopics.length > 0 ? relevantTopics : allTopics.slice(0, 5),
          performance: Math.round(averagePerformance * 100) / 100,
          lastStudied
        };
      });
    } catch (error) {
      console.error('Error getting study history context:', error);
      return [];
    }
  }

  private static async getWeaknessContext(userId: string, queryTerms: string[]) {
    try {
      const [progressReports, mistakeTracking] = await Promise.all([
        supabase.from('progress_reports').select('*').eq('user_id', userId),
        supabase.from('mistake_tracking').select('*').eq('user_id', userId).is('resolved_at', null)
      ]);

      const weaknessData: Record<string, any> = {};

      // From progress reports
      progressReports.data?.forEach(report => {
        if (!weaknessData[report.subject]) {
          weaknessData[report.subject] = {
            subject: report.subject,
            weakAreas: [],
            mistakePatterns: [],
            improvementNeeded: 0
          };
        }
        weaknessData[report.subject].weakAreas = report.weak_areas || [];
        weaknessData[report.subject].improvementNeeded = 100 - (report.completion_percentage || 0);
      });

      // From mistake tracking
      mistakeTracking.data?.forEach(mistake => {
        if (!weaknessData[mistake.subject]) {
          weaknessData[mistake.subject] = {
            subject: mistake.subject,
            weakAreas: [],
            mistakePatterns: [],
            improvementNeeded: 50
          };
        }
        if (!weaknessData[mistake.subject].mistakePatterns.includes(mistake.mistake_type)) {
          weaknessData[mistake.subject].mistakePatterns.push(mistake.mistake_type);
        }
      });

      return Object.values(weaknessData);
    } catch (error) {
      console.error('Error getting weakness context:', error);
      return [];
    }
  }

  private static async getStrengthContext(userId: string, queryTerms: string[]) {
    try {
      const [progressReports, topicMastery] = await Promise.all([
        supabase.from('progress_reports').select('*').eq('user_id', userId),
        supabase.from('topic_mastery').select('*').eq('user_id', userId).eq('mastery_status', 'mastered')
      ]);

      const strengthData: Record<string, any> = {};

      // From progress reports
      progressReports.data?.forEach(report => {
        if ((report.completion_percentage || 0) >= 60) {
          strengthData[report.subject] = {
            subject: report.subject,
            strongAreas: report.strong_areas || [],
            masteredTopics: [],
            confidenceLevel: report.completion_percentage || 0
          };
        }
      });

      // From topic mastery
      topicMastery.data?.forEach(topic => {
        if (!strengthData[topic.subject]) {
          strengthData[topic.subject] = {
            subject: topic.subject,
            strongAreas: [],
            masteredTopics: [],
            confidenceLevel: 70
          };
        }
        strengthData[topic.subject].masteredTopics.push(topic.topic);
      });

      return Object.values(strengthData);
    } catch (error) {
      console.error('Error getting strength context:', error);
      return [];
    }
  }
}