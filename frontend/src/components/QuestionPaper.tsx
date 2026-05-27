'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { GeneratedPaper } from '@/types/assignment';
import { PaperPDF } from './PaperPDF';

const badge: Record<string, string> = { easy: 'bg-green-50 text-green-700', medium: 'bg-yellow-50 text-yellow-700', hard: 'bg-red-50 text-red-700' };

export function QuestionPaper({ paper, onRegenerate }: { paper: GeneratedPaper; onRegenerate: () => void }) {
  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-8">
      <div className="sticky top-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div><p className="text-sm font-bold text-brand">Generated Output</p><h1 className="text-xl font-black">Question Paper Preview</h1></div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={onRegenerate}>Regenerate</button>
          <PDFDownloadLink className="btn-primary" document={<PaperPDF paper={paper} />} fileName="vedaai-question-paper.pdf">Download PDF</PDFDownloadLink>
        </div>
      </div>

      <article className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
        <header className="border-b border-gray-200 pb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-wide">{paper.title}</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">Total Marks: {paper.totalMarks} • Duration: {paper.duration}</p>
        </header>

        <section className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-3">
          {['Name', 'Roll Number', 'Section'].map(item => <div key={item} className="flex items-end gap-2"><span className="font-semibold">{item}:</span><span className="h-7 flex-1 border-b border-gray-500" /></div>)}
        </section>

        <div className="space-y-8 pt-6">
          {paper.sections.map(section => (
            <section key={section.title} className="space-y-4">
              <div>
                <h3 className="text-xl font-black">{section.title}</h3>
                <p className="text-sm font-medium text-gray-500">{section.instruction}</p>
              </div>
              <ol className="space-y-4">
                {section.questions.map((q, index) => (
                  <li key={q.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold leading-7"><span className="mr-2">Q{index + 1}.</span>{q.text}</p>
                      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-black">{q.marks}M</span>
                    </div>
                    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${badge[q.difficulty]}`}>{q.difficulty}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
