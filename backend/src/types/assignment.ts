export type Difficulty = 'easy' | 'medium' | 'hard';
export type JobStatus = 'queued' | 'generating' | 'completed' | 'failed';

export interface QuestionInput {
  type: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
  marks: number;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  title: string;
  totalMarks: number;
  duration: string;
  sections: GeneratedSection[];
}
