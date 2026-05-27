'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuestionInput } from '@/types/assignment';

const defaultTypes: QuestionInput[] = [
  { type: 'Short Answer', count: 5, marks: 2 },
  { type: 'Long Answer', count: 3, marks: 5 }
];

export function AssignmentForm() {
  const router = useRouter();
  const [questionTypes, setQuestionTypes] = useState<QuestionInput[]>(defaultTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateQuestion(index: number, key: keyof QuestionInput, value: string | number) {
    setQuestionTypes(prev => prev.map((q, i) => (i === index ? { ...q, [key]: value } : q)));
  }

  async function submit(formData: FormData) {
    setError('');
    const invalid = questionTypes.some(q => !q.type.trim() || Number(q.count) <= 0 || Number(q.marks) <= 0);
    if (invalid) return setError('Question type, count and marks must be valid positive values.');

    setLoading(true);
    formData.set('questionTypes', JSON.stringify(questionTypes));
    try {
      const { data } = await api.post('/assignments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push(`/output/${data.assignmentId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please check backend/Redis/MongoDB.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="card space-y-6">
      <div>
        <p className="text-sm font-bold text-brand">AI ASSESSMENT CREATOR</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Create Assignment</h1>
        <p className="mt-2 text-gray-500">Upload content, configure questions and generate a structured exam paper.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2"><span className="label">Assignment Title</span><input name="title" required className="input" placeholder="Mid Term Assessment" /></label>
        <label className="space-y-2"><span className="label">Subject</span><input name="subject" required className="input" placeholder="Science / Mathematics" /></label>
        <label className="space-y-2"><span className="label">Due Date</span><input name="dueDate" type="date" required className="input" /></label>
        <label className="space-y-2"><span className="label">Upload PDF/Text Optional</span><input name="file" type="file" accept=".pdf,.txt" className="input" /></label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Question Types</h2>
          <button type="button" className="btn-secondary py-2" onClick={() => setQuestionTypes([...questionTypes, { type: '', count: 1, marks: 1 }])}>+ Add</button>
        </div>
        {questionTypes.map((q, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 md:grid-cols-3">
            <input className="input" value={q.type} onChange={e => updateQuestion(index, 'type', e.target.value)} placeholder="MCQ / Short Answer" />
            <input className="input" type="number" min={1} value={q.count} onChange={e => updateQuestion(index, 'count', Number(e.target.value))} placeholder="Count" />
            <input className="input" type="number" min={1} value={q.marks} onChange={e => updateQuestion(index, 'marks', Number(e.target.value))} placeholder="Marks" />
          </div>
        ))}
      </div>

      <label className="space-y-2 block"><span className="label">Additional Instructions</span><textarea name="instructions" className="input min-h-28" placeholder="Include application based questions, keep language simple..." /></label>
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      <button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? 'Creating...' : 'Generate Question Paper'}</button>
    </form>
  );
}
