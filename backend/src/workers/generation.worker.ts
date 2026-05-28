import { Worker } from 'bullmq';
import { connectDB } from '../config/db.js';
import { redisConnection } from '../config/redis.js';
import { Assignment } from '../models/Assignment.js';
import { buildStructuredPrompt } from '../utils/promptBuilder.js';
import { generatePaperWithAI } from '../utils/ai.js';

await connectDB();

new Worker(
  'generation-queue',
  async (job) => {
    const { assignmentId } = job.data as { assignmentId: string };

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    assignment.status = 'generating';
    await assignment.save();

    await redisConnection.set(
      `assignment:${assignmentId}:status`,
      'generating',
      'EX',
      60 * 60
    );

    await redisConnection.publish(
      'assignment-events',
      JSON.stringify({ assignmentId, status: 'generating' })
    );

    const prompt = buildStructuredPrompt({
  title: assignment.title,
  subject: assignment.subject,
  dueDate: assignment.dueDate.toISOString(),
  questionTypes: assignment.questionTypes.map((q: any) => ({
    type: q.type || 'Short Answer',
    count: q.count || 1,
    marks: q.marks || 1
  })),
  instructions: assignment.instructions ?? undefined,
  sourceText: assignment.sourceText ?? undefined
});

    const result = await generatePaperWithAI(prompt, {
      title: assignment.title,
      subject: assignment.subject,
      questionTypes: assignment.questionTypes as any
    });

    assignment.result = result as any;
    assignment.status = 'completed';
    await assignment.save();

    await redisConnection.set(
      `assignment:${assignmentId}:status`,
      'completed',
      'EX',
      60 * 60
    );

    await redisConnection.publish(
      'assignment-events',
      JSON.stringify({ assignmentId, status: 'completed', result })
    );

    return result;
  },
  { connection: redisConnection }
);

console.log('Generation worker running');