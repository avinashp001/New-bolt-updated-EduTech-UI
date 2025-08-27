// Main AI Service that coordinates all AI modules
import { QuestionGenerator } from './questionGenerator';
import { PerformanceAnalyzer } from './performanceAnalyzer';
import { AIMentor } from './mentor';
import { TheoryGeneratorV2 } from './theoryGeneratorV2';
import { TheoryGenerator } from './theoryGenerator';
import { TheoryQuestionGenerator } from './theoryquestionGenerator';

export class AIService {
  // Question Generation
  static async generateTestQuestions(content: string, subject: string) {
    return QuestionGenerator.generateTestQuestions(content, subject);
  }

  // Theory Quiz Generation (High-Level Questions)
  static async generateTheoryQuizQuestions(content: string, subject: string, topic: string) {
    return TheoryQuestionGenerator.generateQuestions(content, subject, topic);
  }

  // Performance Analysis
  static async analyzeTestPerformance(testData: any) {
    return PerformanceAnalyzer.analyzeTestPerformance(testData);
  }

  static async analyzeWeeklyPerformance(testData: any) {
    return PerformanceAnalyzer.analyzeWeeklyPerformance(testData);
  }

  static async analyzeProgress(studySessions: any[], currentWeek: number) {
    return PerformanceAnalyzer.analyzeProgress(studySessions, currentWeek);
  }

  // Mentorship
  static async provideMentorship(question: string, userProgress: any, examType: string) {
    return AIMentor.provideMentorship(question, userProgress, examType);
  }

  static async extractPDFContent(content: string, examType: string) {
    return AIMentor.extractPDFContent(content, examType);
  }

  // Theory Generation
  static async generateTheory(subject: string, topic: string, userId: string) {
    return TheoryGenerator.generateTheory(subject, topic, userId);
  }

  // Theory Generation V2
  static async generateTheoryV2(subject: string, topic: string, userId: string, examLevel: string) {
    return TheoryGeneratorV2.generateTheory(subject, topic, userId, examLevel);
  }
}

// Export individual modules for direct access if needed
export { QuestionGenerator, PerformanceAnalyzer, AIMentor, TheoryGenerator, TheoryGeneratorV2, TheoryQuestionGenerator };