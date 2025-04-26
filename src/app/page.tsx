
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
    // Add pt-20 to account for AppBar height (approx h-16 + padding)
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-20 md:p-12 lg:p-24 bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Updated Header Section */}
      <div className="z-10 w-full max-w-5xl items-center text-center mb-12">
         <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight w-full">
          AI Terms &amp; Conditions Analyzer
        </h1>
         {/* Ensure subtitle breaks on smaller screens if needed */}
         <p className="text-muted-foreground w-full text-sm md:text-base block">
          Upload any T&amp;C document (PDF, DOCX, TXT) for a clear summary, pros, and cons.
        </p>
      </div>
      {/* End of Updated Header Section */}

      <div className="w-full flex flex-col items-center space-y-8">
        {/* Conditionally render UploadForm based on isLoading state */}
        {!isLoading && (
          <UploadForm
            onSubmit={handleSummarization}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSummary={setSummary}
          />
        )}

        {/* Attach the ref to the SummaryDisplay container */}
        <div ref={summaryRef} className="w-full">
            {/* Show loading indicator here if needed, or rely on UploadForm's disappearance */}
             {isLoading && (
                 <div className="flex flex-col items-center justify-center space-y-4 py-10">
                     {/* Consistent Loading indicator */}
                     {/* <Loader2 className="h-12 w-12 animate-spin text-primary" />
                     <p className="text-lg font-medium text-muted-foreground">Analyzing & Summarizing...</p>
                     <p className="text-sm text-muted-foreground">This may take a moment.</p> */}
                 </div>
             )}
            {summary && !isLoading && <SummaryDisplay summaryData={summary} />}
        </div>
      </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
            Powered by AI | Created with Firebase Studio
        </footer>
    </main>
  );
}
