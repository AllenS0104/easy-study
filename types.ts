
export enum ViewState {
  HOME = 'HOME',
  KNOWLEDGE = 'KNOWLEDGE', // Uses Search Grounding with Categories
  MOCK_TEST = 'MOCK_TEST', // Uses JSON Mode
  PROBLEM_SOLVER = 'PROBLEM_SOLVER', // New: Visual Problem Solving
}

export type CategoryId = 'ALL' | 'PRIMARY' | 'SECONDARY' | 'UNIVERSITY' | 'OLYMPIAD' | 'CS' | 'HISTORY' | 'EXAMS';

export interface Category {
  id: CategoryId;
  labelZh: string;
  labelEn: string;
  description: string;
  suggestedQueries: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}