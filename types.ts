
export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  LEARNING = 'LEARNING',
  SUMMARY = 'SUMMARY',
  ERROR = 'ERROR'
}

export enum LessonType {
  VOCABULARY = 'Vocabulary',
  GRAMMAR_FIX = 'Grammar Fix',
  TECH_READING = 'Tech Reading',
  QUIZ = 'Quick Quiz'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface QuestionItem {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string; // For quiz
  explanation: string;
  context?: string; // For vocabulary (example sentence) or reading passage
  term?: string; // For vocabulary
  // New rich content fields
  derivatives?: string[]; // e.g., ["compile (verb)", "compilation (noun)"]
  examples?: string[]; // Multiple example sentences
  visualPrompt?: string; // Description for image generation
}

export interface LessonContent {
  topic: string;
  items: QuestionItem[];
}

export interface UserSelection {
  duration: number; // in minutes
  type: LessonType;
  topicFocus: string; // e.g., "Software Engineering", "Business", "Casual"
}
