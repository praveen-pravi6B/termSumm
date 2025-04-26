
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, ShieldCheck, Users, Handshake, Info, FileQuestion } from 'lucide-react'; // Added FileQuestion
// Update import path and type name if necessary
import type { SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';


type SummaryDisplayProps = {
  summaryData: SummarizeTermsAndConditionsOutput | null;
};

// Helper to get icon and style based on identified document type
const getDocumentStyle = (docType: string | undefined) => {
  // Standardize the input type for comparison
  const normalizedDocType = docType?.toLowerCase().trim().replace(/\s+/g, ' ') || 'other';

  switch (normalizedDocType) {
    case 'legal document':
    case 'legal':
      return { icon: <FileText className="h-5 w-5 mr-2" />, color: 'bg-secondary text-secondary-foreground' };
    case 'user agreement':
      // Using theme colors now
      return { icon: <Users className="h-5 w-5 mr-2" />, color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' }; // Example: Keeping explicit for now
    case 'privacy policy':
       // Using theme colors now
      return { icon: <ShieldCheck className="h-5 w-5 mr-2" />, color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' }; // Example: Keeping explicit for now
    case 'service agreement':
       // Using theme colors now
      return { icon: <Handshake className="h-5 w-5 mr-2" />, color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' }; // Example: Keeping explicit for now
    case 'other':
       return { icon: <FileQuestion className="h-5 w-5 mr-2" />, color: 'bg-muted text-muted-foreground' }; // Use specific icon for 'Other'
    default:
       // Fallback for unexpected types identified by AI
      return { icon: <Info className="h-5 w-5 mr-2" />, color: 'bg-muted text-muted-foreground' };
  }
};

export function SummaryDisplay({ summaryData }: SummaryDisplayProps) {
  if (!summaryData) {
    return null; // Don't render anything if there's no summary
  }

  // Use identifiedDocumentType instead of tone
  const { summary, identifiedDocumentType } = summaryData;
  const { icon, color } = getDocumentStyle(identifiedDocumentType);


  // Basic formatting: Replace double newlines with paragraph breaks
  const formattedSummary = summary
    .split('\n\n')
    .map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    ));

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Summary</CardTitle>
        {/* Display the identified document type */}
        <Badge variant="outline" className={`flex items-center ${color} border-none`}>
           {icon}
           {/* Capitalize the first letter of the identified type */}
           <span className="capitalize">{identifiedDocumentType || 'Document'}</span>
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Use prose for better typography if desired, apply within ScrollArea */}
        <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/30">
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
            {formattedSummary}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```