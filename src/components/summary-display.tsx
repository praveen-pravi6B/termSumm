
import * as React from 'react';
import { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'; // Import Button
import { FileText, ShieldCheck, Users, Handshake, Info, FileQuestion, ThumbsUp, ThumbsDown, Volume2, Loader2 } from 'lucide-react'; // Import icons
import { serverGenerateAudio } from '@/app/actions'; // Import the server action
import { useToast } from "@/hooks/use-toast"; // Import useToast
import type { SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';


type SummaryDisplayProps = {
  summaryData: SummarizeTermsAndConditionsOutput | null;
};

// Helper to get icon and style based on identified document type
const getDocumentStyle = (docType: string | undefined) => {
  const normalizedDocType = docType?.toLowerCase().trim().replace(/\s+/g, ' ') || 'other';

  switch (normalizedDocType) {
    case 'legal document':
    case 'legal':
      return { icon: <FileText className="h-5 w-5 mr-2" />, color: 'bg-secondary text-secondary-foreground' };
    case 'user agreement':
      return { icon: <Users className="h-5 w-5 mr-2" />, color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' };
    case 'privacy policy':
      return { icon: <ShieldCheck className="h-5 w-5 mr-2" />, color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' };
    case 'service agreement':
      return { icon: <Handshake className="h-5 w-5 mr-2" />, color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' };
    case 'other':
       return { icon: <FileQuestion className="h-5 w-5 mr-2" />, color: 'bg-muted text-muted-foreground' };
    default:
      return { icon: <Info className="h-5 w-5 mr-2" />, color: 'bg-muted text-muted-foreground' };
  }
};

// Use React.forwardRef to allow passing a ref to the Card component
export const SummaryDisplay = React.forwardRef<HTMLDivElement, SummaryDisplayProps>(
    ({ summaryData }, ref) => {
        const [isAudioLoading, setIsAudioLoading] = useState(false);
        const [audioSrc, setAudioSrc] = useState<string | null>(null);
        const { toast } = useToast();

        if (!summaryData) {
            return null; // Don't render anything if there's no summary
        }

        const { summary, identifiedDocumentType, pros, cons } = summaryData;
        const { icon, color } = getDocumentStyle(identifiedDocumentType);

        const handleGenerateAudio = async () => {
            if (!summary) return;
            setIsAudioLoading(true);
            setAudioSrc(null); // Clear previous audio

            try {
                const result = await serverGenerateAudio({ text: summary });
                if (result.audioDataUri) {
                    setAudioSrc(result.audioDataUri);
                    toast({
                        title: "Audio Generated",
                        description: "Press play to listen to the summary.",
                    });
                } else {
                    // Use console.warn as this is expected simulation behavior
                    console.warn("Audio generation failed (simulation):", result.errorMessage);
                    toast({
                        title: "Audio Generation Failed",
                        description: result.errorMessage || "Could not generate audio for the summary.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error calling serverGenerateAudio:", error);
                toast({
                  title: "Error",
                  description: "An unexpected error occurred while generating audio.",
                  variant: "destructive",
                });
            } finally {
                setIsAudioLoading(false);
            }
        };


        const formattedSummary = summary
            .split('\n\n')
            .map((paragraph, index) => (
            // Use React.Fragment shorthand <>
            <p key={`summary-${index}`} className="mb-4 last:mb-0">
                {paragraph.split('\n').map((line, lineIndex) => (
                <React.Fragment key={`summary-line-${index}-${lineIndex}`}>
                    {line}
                    <br />
                </React.Fragment>
                ))}
            </p>
            ));

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
            // Attach the forwarded ref to the root Card element
            <Card ref={ref} className="w-full max-w-2xl mx-auto mt-8 shadow-lg transition-opacity duration-500 ease-in-out opacity-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Analysis Results</CardTitle>
                    <Badge variant="outline" className={`flex items-center ${color} border-none`}>
                        {icon}
                        <span className="capitalize">{identifiedDocumentType || 'Document'}</span>
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-primary">Summary</h3>
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleGenerateAudio}
                                disabled={isAudioLoading || !summary}
                                aria-label="Listen to summary"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                {isAudioLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Volume2 className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                         {audioSrc && !isAudioLoading && (
                            <audio controls src={audioSrc} className="w-full mb-4">
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/30">
                            {/* Use Tailwind Typography for better text rendering */}
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                                {formattedSummary}
                            </div>
                        </ScrollArea>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </Card>
        );
    }
);

SummaryDisplay.displayName = 'SummaryDisplay'; // Set display name for forwarded ref component
