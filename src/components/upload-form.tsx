
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UploadCloud, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
// Update import path if necessary, ensure types align
import type { SummarizeTermsAndConditionsInput, SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';


// Define the allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Zod schema for form validation - remove documentType
const formSchema = z.object({
  document: z
    .custom<FileList>((val) => val instanceof FileList, "Input required")
    .refine((files) => files.length > 0, `Input required.`)
    .refine((files) => files.length <= 1, `Maximum 1 file.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) => Array.from(files).every((file) => ALLOWED_MIME_TYPES.includes(file.type)),
      "Only .pdf, .doc, .docx, .txt files are accepted."
    ),
});

type UploadFormProps = {
  // Update onSubmit prop to expect the new input type
  onSubmit: (data: SummarizeTermsAndConditionsInput) => Promise<SummarizeTermsAndConditionsOutput | null>;
  setSummary: (summary: SummarizeTermsAndConditionsOutput | null) => void;
};

export function UploadForm({ onSubmit, setSummary }: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: undefined,
    },
  });

  // Function to read file as data URI
  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission - remove documentType handling
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSummary(null); // Clear previous summary

    try {
      const file = values.document[0];
      if (!file) {
        toast({
            title: "Error",
            description: "No file selected.",
            variant: "destructive",
          });
        setIsLoading(false);
        return;
      }

      const documentDataUri = await readFileAsDataURI(file);
      // Keep setting filename for UI display before clearing
      // No need to setFileName here as the form will be hidden during loading
      // setFileName(file.name);

      // Call onSubmit with only the documentDataUri
      const result = await onSubmit({ documentDataUri });

      if (result) {
        setSummary(result);
        toast({
          title: "Success!",
          description: "Your document has been analyzed.",
        });
        form.reset(); // Reset form after successful submission
        setFileName(null); // Clear file name display after successful submission

        // Reset the file input visually
        const fileInput = document.getElementById('document-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }

      } else {
         toast({
            title: "Analysis Failed",
            description: "Could not analyze the document. Please try again.",
            variant: "destructive",
          });
          setFileName(null); // Clear filename on error as well
      }
    } catch (error) {
       console.error('Error during form submission:', error);
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
       toast({
         title: "Error",
         description: errorMessage,
         variant: "destructive",
       });
       // Clear filename on error as well
       setFileName(null);
       const fileInput = document.getElementById('document-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }
    } finally {
      setIsLoading(false);
    }
  };

  const fileRef = form.register("document");

  return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader>
              <CardTitle className="text-center text-xl md:text-2xl font-semibold">Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
              {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-10">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-lg font-medium text-muted-foreground">Analyzing & Summarizing...</p>
                      <p className="text-sm text-muted-foreground">This may take a moment.</p>
                  </div>
              ) : (
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 md:space-y-6">
                          <FormField
                              control={form.control}
                              name="document"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel className="sr-only">Terms & Conditions Document</FormLabel>
                                      <FormControl>
                                          <div className="relative flex flex-col items-center justify-center w-full h-40 md:h-48 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors bg-background hover:bg-muted/50">
                                               <Input
                                                   id="document-upload"
                                                   type="file"
                                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                   accept=".pdf,.doc,.docx,.txt"
                                                   {...fileRef}
                                                   onChange={(e) => {
                                                    field.onChange(e.target.files);
                                                    setFileName(e.target.files?.[0]?.name || null);
                                                   }}
                                                   disabled={isLoading} // Disable while loading
                                               />
                                               <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                  {fileName ? (
                                                      <>
                                                         <FileText className="w-10 h-10 mb-3 text-primary" />
                                                         <p className="text-sm font-medium text-foreground truncate max-w-[90%]">{fileName}</p>
                                                         <p className="text-xs text-muted-foreground mt-1">Click button below to analyze</p>
                                                      </>
                                                  ) : (
                                                      <>
                                                         <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                                         <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                                         <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT (MAX. 5MB)</p>
                                                      </>
                                                  )}
                                               </div>
                                          </div>
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base" disabled={isLoading || !form.formState.isValid}>
                              {isLoading ? (
                                  // This part is inside the conditional loading block now
                                  'Processing...'
                              ) : (
                                  'Analyze & Summarize'
                              )}
                          </Button>
                      </form>
                  </Form>
              )}
          </CardContent>
      </Card>
  );
}

