import mongoose, { Schema } from 'mongoose';

const questionInputSchema = new Schema(
  { type: String, count: Number, marks: Number },
  { _id: false }
);

const generatedQuestionSchema = new Schema(
  {
    id: String,
    text: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    marks: Number
  },
  { _id: false }
);

const generatedSectionSchema = new Schema(
  {
    title: String,
    instruction: String,
    questions: [generatedQuestionSchema]
  },
  { _id: false }
);

const generatedPaperSchema = new Schema(
  {
    title: String,
    totalMarks: Number,
    duration: String,
    sections: [generatedSectionSchema]
  },
  { _id: false }
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    sourceText: String,
    fileName: String,
    questionTypes: [questionInputSchema],
    instructions: String,
    status: { type: String, enum: ['queued', 'generating', 'completed', 'failed'], default: 'queued' },
    result: generatedPaperSchema,
    error: String
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);
