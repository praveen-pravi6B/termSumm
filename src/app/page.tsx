
"use client"; // Required for useState, useRef, and client-side interactions

import { useState, useRef, useEffect } from 'react';
import { UploadForm } from '@/components/upload-form';
import { SummaryDisplay } from '@/components/summary-display';
import { serverHandleSummarization } from './actions'; // Correctly import the exported function name
import type { SummarizeTermsAndConditionsInput, SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading indicator
import { Card, CardContent } from '@/components/ui/card'; // Import Card for loading state

export default function Home() {
  const [summary, setSummary] = useState<SummarizeTermsAndConditionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null); // Ref for the summary display section
  const { toast } = useToast(); // Initialize toast

  // Effect to scroll to the summary when it appears
  useEffect(() => {
    if (summary && summaryRef.current && !isLoading) { // Ensure not loading when scrolling
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [summary, isLoading]); // Add isLoading to dependency array

  // Client-side handler that wraps the server action and manages state/scrolling
  const handleSummarization = async (input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> => {
    setIsLoading(true);
    setSummary(null); // Clear previous summary immediately

    try {
      const result = await serverHandleSummarization(input); // Call the server action

      if (result) {
        setSummary(result); // Set summary, triggering the useEffect for scrolling after loading finishes
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
      setIsLoading(false); // Set loading to false after operation completes (success or error)
    }
  };


  return (
    // Use flex-grow to make this main container take available space
    <main className="flex flex-col flex-grow items-center justify-start p-6 pt-20 md:p-12 lg:p-24 bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header Section */}
      <div className="z-10 w-full max-w-5xl items-center text-center mb-12">
         <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight w-full">
          AI Terms &amp; Conditions Analyzer
        </h1>
         <p className="text-muted-foreground w-full text-sm md:text-base block">
          Upload any T&amp;C document (PDF, DOCX, TXT) for a clear summary, pros, and cons.
        </p>
      </div>
      {/* End of Header Section */}

      {/* Content area that grows */}
      <div className="w-full flex flex-col items-center space-y-8 flex-grow">
        {/* Conditionally render UploadForm OR Loading Indicator */}
        {isLoading ? (
           <Card className="w-full max-w-lg mx-auto shadow-lg">
                <CardContent className="pt-6"> {/* Add padding top for CardContent */}
                    <div className="flex flex-col items-center justify-center space-y-4 py-10">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-lg font-medium text-muted-foreground">Analyzing & Summarizing...</p>
                        <p className="text-sm text-muted-foreground">This may take a moment.</p>
                    </div>
                </CardContent>
            </Card>
        ) : (
          <UploadForm
            onSubmit={handleSummarization}
            isLoading={isLoading}
            // Pass only necessary props
          />
        )}

        {/* Attach the ref to the SummaryDisplay container */}
        {/* SummaryDisplay is only rendered when summary exists AND not loading */}
        <div ref={summaryRef} className="w-full">
            {summary && !isLoading && <SummaryDisplay summaryData={summary} />}
        </div>
      </div>

        {/* Fixed Footer - positioned by the flex container */}
        <footer className="w-full mt-16 py-4 text-center text-sm text-muted-foreground border-t border-border">
            Powered by AI | Created with Firebase Studio
        </footer>
    </main>
  );
}
