import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import pdfParse from 'pdf-parse';
import { Assignment } from '../models/Assignment.js';
import { generationQueue } from '../jobs/queues.js';
import { redisConnection } from '../config/redis.js';

export async function createAssignment(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let sourceText = req.body.sourceText || '';
  if (req.file?.buffer) {
    if (req.file.mimetype === 'application/pdf') {
      const parsed = await pdfParse(req.file.buffer);
      sourceText = parsed.text;
    } else {
      sourceText = req.file.buffer.toString('utf-8');
    }
  }

  const questionTypes = JSON.parse(req.body.questionTypes);
  const assignment = await Assignment.create({
    title: req.body.title,
    subject: req.body.subject,
    dueDate: req.body.dueDate,
    instructions: req.body.instructions,
    questionTypes,
    sourceText,
    fileName: req.file?.originalname,
    status: 'queued'
  });

  await redisConnection.set(`assignment:${assignment.id}:status`, 'queued', 'EX', 60 * 60);
  await generationQueue.add('generate-paper', { assignmentId: assignment.id }, { attempts: 2, backoff: { type: 'exponential', delay: 3000 } });

  res.status(201).json({ assignmentId: assignment.id, status: assignment.status });
}

export async function getAssignment(req: Request, res: Response) {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json(assignment);
}

export async function regenerateAssignment(req: Request, res: Response) {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, { status: 'queued', error: null }, { new: true });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  await generationQueue.add('generate-paper', { assignmentId: assignment.id });
  res.json({ assignmentId: assignment.id, status: 'queued' });
}
