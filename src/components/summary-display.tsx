
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // Import Separator
import { FileText, ShieldCheck, Users, Handshake, Info, FileQuestion, ThumbsUp, ThumbsDown } from 'lucide-react'; // Added ThumbsUp, ThumbsDown
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
      // Using theme colors now - Example, replace if theme covers blue better
      return { icon: <Users className="h-5 w-5 mr-2" />, color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' };
    case 'privacy policy':
       // Using theme colors now - Example, replace if theme covers green better
      return { icon: <ShieldCheck className="h-5 w-5 mr-2" />, color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' };
    case 'service agreement':
       // Using theme colors now - Example, replace if theme covers purple better
      return { icon: <Handshake className="h-5 w-5 mr-2" />, color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' };
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

  // Destructure new pros and cons fields
  const { summary, identifiedDocumentType, pros, cons } = summaryData;
  const { icon, color } = getDocumentStyle(identifiedDocumentType);


  // Basic formatting for summary
  const formattedSummary = summary
    .split('\n\n')
    .map((paragraph, index) => (
      <p key={`summary-${index}`} className="mb-4 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={`summary-line-${index}-${lineIndex}`}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    ));

  // Helper to render list items
  const renderListItems = (items: string[], type: 'pro' | 'con') => (
    <ul className="list-none space-y-2 pl-0">
      {items.map((item, index) => (
        <li key={`${type}-${index}`} className="flex items-start">
          {type === 'pro' ? (
             <ThumbsUp className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-green-500" />
          ) : (
             <ThumbsDown className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-red-500" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Analysis Results</CardTitle>
        {/* Display the identified document type */}
        <Badge variant="outline" className={`flex items-center ${color} border-none`}>
           {icon}
           {/* Capitalize the first letter of the identified type */}
           <span className="capitalize">{identifiedDocumentType || 'Document'}</span>
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Summary Section */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">Summary</h3>
             <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/30">
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                    {formattedSummary}
                </div>
            </ScrollArea>
        </div>

        <Separator className="my-6" />

        {/* Pros and Cons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Pros Section */}
            <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
                    <ThumbsUp className="h-5 w-5 mr-2" /> Pros
                </h3>
                {pros && pros.length > 0 ? (
                    renderListItems(pros, 'pro')
                ) : (
                    <p className="text-sm text-muted-foreground italic">No specific pros identified.</p>
                )}
            </div>

             {/* Cons Section */}
            <div>
                 <h3 className="text-lg font-semibold mb-3 flex items-center text-red-600">
                    <ThumbsDown className="h-5 w-5 mr-2" /> Cons
                </h3>
                {cons && cons.length > 0 ? (
                    renderListItems(cons, 'con')
                ) : (
                    <p className="text-sm text-muted-foreground italic">No specific cons identified.</p>
                )}
            </div>
        </div>
      </CardContent>
        {/* Optional Footer */}
       {/* <CardFooter className="pt-4">
            <p className="text-xs text-muted-foreground">
                Note: This analysis is AI-generated and may not capture every nuance. Always review the full document.
            </p>
       </CardFooter> */}
    </Card>
  );
}
