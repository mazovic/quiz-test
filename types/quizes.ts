export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface QuizGenerationParams {
    category: string;
    numberOfQuestions: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  export interface QuizResponse {
    questions: QuizQuestion[];
    metadata: {
      category: string;
      difficulty: string;
      generatedAt: string;
    };
  }