
"use client"; // Required for useState and client-side interactions

import { useState } from 'react';
import { UploadForm } from '@/components/upload-form';
import { SummaryDisplay } from '@/components/summary-display';
import { handleSummarization } from './actions'; // Import the server action
// Update import path and type name if necessary
import type { SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';

export default function Home() {
  // State type remains SummarizeTermsAndConditionsOutput, but its structure includes pros/cons now
  const [summary, setSummary] = useState<SummarizeTermsAndConditionsOutput | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12 text-center">
         <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight w-full">
          TermSumm: AI T&amp;C Analysis
        </h1>
         <p className="text-muted-foreground w-full">
          Upload your terms & conditions for an AI-powered summary, including pros and cons.
        </p>
      </div>

      <div className="w-full flex flex-col items-center space-y-8">
        {/* Pass the server action to UploadForm */}
        <UploadForm onSubmit={handleSummarization} setSummary={setSummary} />

        {/* Pass the summary state to SummaryDisplay */}
        {/* SummaryDisplay now expects pros/cons within summaryData */}
        {summary && <SummaryDisplay summaryData={summary} />}
      </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
            Powered by AI | Created with Firebase Studio
        </footer>
    </main>
  );
}
