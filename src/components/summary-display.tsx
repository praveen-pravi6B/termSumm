
import * as React from 'react'; // Import React
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, ShieldCheck, Users, Handshake, Info } from 'lucide-react';
import type { SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';


type SummaryDisplayProps = {
  summaryData: SummarizeTermsAndConditionsOutput | null;
};

// Helper to get icon and style based on document type
const getDocumentStyle = (docType: string | undefined) => {
  switch (docType?.toLowerCase()) {
    case 'legal document':
    case 'legal':
      return { icon: <FileText className="h-5 w-5 mr-2" />, color: 'bg-secondary text-secondary-foreground' };
    case 'user agreement':
      return { icon: <Users className="h-5 w-5 mr-2" />, color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' }; // Keeping explicit colors for distinction for now
    case 'privacy policy':
      return { icon: <ShieldCheck className="h-5 w-5 mr-2" />, color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' }; // Keeping explicit colors for distinction for now
    case 'service agreement':
      return { icon: <Handshake className="h-5 w-5 mr-2" />, color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' }; // Keeping explicit colors for distinction for now
    default:
      return { icon: <Info className="h-5 w-5 mr-2" />, color: 'bg-muted text-muted-foreground' };
  }
};

export function SummaryDisplay({ summaryData }: SummaryDisplayProps) {
  if (!summaryData) {
    return null; // Don't render anything if there's no summary
  }

  const { summary, tone } = summaryData;
  const { icon, color } = getDocumentStyle(tone); // Use tone which likely contains the document type


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
        <Badge variant="outline" className={`flex items-center ${color} border-none`}>
           {icon}
           <span className="capitalize">{tone || 'Document'}</span> {/* Display the tone/doc type */}
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/30">
          <div className="text-sm leading-relaxed text-foreground">
            {formattedSummary}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
      
