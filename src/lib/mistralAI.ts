// Re-export the main AIService from the new modular structure
export { AIService } from './mistralAI/index';

// Also export individual modules for backward compatibility
export { QuestionGenerator, PerformanceAnalyzer, AIMentor, ScheduleGenerator } from './mistralAI/index';


