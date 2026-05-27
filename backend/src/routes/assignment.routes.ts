import { Router } from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import { createAssignment, getAssignment, regenerateAssignment } from '../controllers/assignment.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  '/',
  upload.single('file'),
  body('title').trim().notEmpty(),
  body('subject').trim().notEmpty(),
  body('dueDate').isISO8601(),
  body('questionTypes').custom(value => {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('At least one question type is required');
    parsed.forEach(q => {
      if (!q.type || q.count <= 0 || q.marks <= 0) throw new Error('Invalid question type data');
    });
    return true;
  }),
  createAssignment
);

router.get('/:id', getAssignment);
router.post('/:id/regenerate', regenerateAssignment);

export default router;
