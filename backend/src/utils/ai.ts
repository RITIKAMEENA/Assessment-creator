import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { GeneratedPaper, QuestionInput } from '../types/assignment.js';
import { v4 as uuid } from 'uuid';

function fallbackPaper(title: string, subject: string, questionTypes: QuestionInput[]): GeneratedPaper {
  const sections = questionTypes.map((qt, index) => ({
    title: `Section ${String.fromCharCode(65 + index)} - ${qt.type}`,
    instruction: qt.marks <= 2 ? 'Attempt all questions.' : 'Answer in detail with proper explanation.',
    questions: Array.from({ length: qt.count }).map((_, i) => ({
      id: uuid(),
      text: `${qt.type} question ${i + 1} for ${subject}: Explain an important concept with a suitable example.`,
      difficulty: (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
      marks: qt.marks
    }))
  }));

  return {
    title: `${title} - Question Paper`,
    totalMarks: questionTypes.reduce((sum, q) => sum + q.count * q.marks, 0),
    duration: '2 Hours',
    sections
  };
}

function safeParseJson(text: string): GeneratedPaper {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as GeneratedPaper;
}

export async function generatePaperWithAI(prompt: string, meta: { title: string; subject: string; questionTypes: QuestionInput[] }) {
  if (env.aiProvider === 'gemini' && env.geminiApiKey) {
    const genAI = new GoogleGenerativeAI(env.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    return safeParseJson(response.response.text());
  }
  return fallbackPaper(meta.title, meta.subject, meta.questionTypes);
}
