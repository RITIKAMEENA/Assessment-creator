import { QuestionInput } from '../types/assignment.js';

export function buildStructuredPrompt(params: {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionInput[];
  instructions?: string;
  sourceText?: string;
}) {
  return `You are an expert school assessment creator. Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "totalMarks": number,
  "duration": "string",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {"id":"q1", "text":"question", "difficulty":"easy|medium|hard", "marks": number}
      ]
    }
  ]
}

Assignment title: ${params.title}
Subject: ${params.subject}
Due date: ${params.dueDate}
Question configuration: ${JSON.stringify(params.questionTypes)}
Additional instructions: ${params.instructions || 'None'}
Reference content: ${params.sourceText?.slice(0, 5000) || 'Use standard syllabus-level knowledge.'}

Rules:
- Group questions into sections A, B, C based on question type or marks.
- Do not include answers.
- Do not include markdown.
- Difficulty must be easy, medium, or hard.
- Marks must match requested marks.
- Output must be parseable JSON only.`;
}
