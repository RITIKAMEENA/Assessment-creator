'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GeneratedPaper } from '@/types/assignment';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: 'Helvetica' },
  title: { textAlign: 'center', fontSize: 18, marginBottom: 8, fontWeight: 'bold' },
  meta: { textAlign: 'center', marginBottom: 18 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  line: { borderBottom: '1px solid #000', width: 140, marginLeft: 6 },
  field: { flexDirection: 'row' },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  instruction: { fontSize: 10, color: '#444', marginBottom: 8 },
  question: { marginBottom: 8 },
  qMeta: { fontSize: 9, color: '#555' }
});

export function PaperPDF({ paper }: { paper: GeneratedPaper }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.meta}>Total Marks: {paper.totalMarks} | Duration: {paper.duration}</Text>
        <View style={styles.infoRow}>
          {['Name', 'Roll Number', 'Section'].map(label => <View key={label} style={styles.field}><Text>{label}:</Text><View style={styles.line} /></View>)}
        </View>
        {paper.sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.instruction}>{section.instruction}</Text>
            {section.questions.map((q, index) => (
              <View key={q.id} style={styles.question}>
                <Text>{index + 1}. {q.text}</Text>
                <Text style={styles.qMeta}>Difficulty: {q.difficulty.toUpperCase()} | Marks: {q.marks}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
