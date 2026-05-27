'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { api } from '@/lib/api';
import { Assignment } from '@/types/assignment';
import { QuestionPaper } from '@/components/QuestionPaper';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function OutputPage() {
  const params = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  async function load() {
    const { data } = await api.get(`/assignments/${params.id}`);
    setAssignment(data);
  }

  async function regenerate() {
    await api.post(`/assignments/${params.id}/regenerate`);
    setAssignment(prev => prev ? { ...prev, status: 'queued' } : prev);
  }

  useEffect(() => {
    load();
    const socket = io(SOCKET_URL);
    socket.emit('join-assignment', params.id);
    socket.on('assignment-update', () => load());
    return () => { socket.disconnect(); };
  }, [params.id]);

  if (!assignment || assignment.status === 'queued' || assignment.status === 'generating') {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-lg text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <h1 className="text-2xl font-black">{assignment?.status === 'generating' ? 'Generating questions...' : 'Queued successfully'}</h1>
          <p className="mt-3 text-gray-500">Worker is processing the assignment. This page updates automatically through WebSocket.</p>
        </div>
      </main>
    );
  }

  if (assignment.status === 'failed') {
    return <main className="p-8"><div className="card text-red-600">Generation failed: {assignment.error}</div></main>;
  }

  return assignment.result ? <QuestionPaper paper={assignment.result} onRegenerate={regenerate} /> : null;
}
