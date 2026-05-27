import { AssignmentForm } from '@/components/AssignmentForm';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-gradient-to-br from-brand to-indigo-700 p-8 text-white shadow-xl">
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">VedaAI Hiring Assignment</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Generate classroom-ready assessments with AI.</h2>
            <p className="mt-4 text-indigo-100">Async generation using Express, MongoDB, Redis, BullMQ and WebSocket updates.</p>
          </div>
          <div className="mt-8 grid gap-4">
            {['Prompt structuring + parsing', 'Real-time job state', 'Structured exam output', 'PDF export ready'].map(item => <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-semibold">✓ {item}</div>)}
          </div>
        </section>
        <AssignmentForm />
      </div>
    </main>
  );
}
