
"use client"; // Required for useState, useRef, and client-side interactions

import { useState, useRef, useEffect } from 'react';
import { UploadForm } from '@/components/upload-form';
import { SummaryDisplay } from '@/components/summary-display';
import { serverHandleSummarization } from './actions'; // Correctly import the exported function name
import type { SummarizeTermsAndConditionsInput, SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function Home() {
  const [summary, setSummary] = useState<SummarizeTermsAndConditionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null); // Ref for the summary display section
  const { toast } = useToast(); // Initialize toast

  // Effect to scroll to the summary when it appears
  useEffect(() => {
    if (summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [summary]); // Dependency array ensures this runs only when summary changes

  // Client-side handler that wraps the server action and manages state/scrolling
  const handleSummarization = async (input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> => {
    setIsLoading(true);
    setSummary(null); // Clear previous summary immediately

    try {
      const result = await serverHandleSummarization(input); // Call the server action

      if (result) {
        setSummary(result); // Set summary, triggering the useEffect for scrolling
        toast({
          title: "Success!",
          description: "Your document has been analyzed.",
        });
      } else {
         toast({
            title: "Analysis Failed",
            description: "Could not analyze the document. Please try again.",
            variant: "destructive",
          });
      }
      return result; // Return the result for UploadForm if needed
    } catch (error) {
       console.error("Error during summarization flow:", error);
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
       toast({
         title: "Error",
         description: errorMessage,
         variant: "destructive",
       });
       return null; // Return null on error
    } finally {
      setIsLoading(false);
    }
  };


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
        {/* Pass the client-side handler and loading state to UploadForm */}
        <UploadForm
            onSubmit={handleSummarization}
            isLoading={isLoading}
            setIsLoading={setIsLoading} // Pass setIsLoading if UploadForm still manages its own loading indicator text/button state
            setSummary={setSummary} // Keep passing setSummary if UploadForm needs to clear it internally
        />

        {/* Attach the ref to the SummaryDisplay container */}
        <div ref={summaryRef} className="w-full">
            {summary && !isLoading && <SummaryDisplay summaryData={summary} />}
        </div>
      </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
            Powered by AI | Created with Firebase Studio
        </footer>
    </main>
  );
}
