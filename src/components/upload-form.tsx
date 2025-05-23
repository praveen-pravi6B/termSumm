
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadCloud, FileText } from 'lucide-react'; // Removed Loader2

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SummarizeTermsAndConditionsInput, SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  onSubmit: (data: SummarizeTermsAndConditionsInput) => Promise<SummarizeTermsAndConditionsOutput | null>;
  isLoading: boolean; // Still needed to disable elements
  // Removed setIsLoading and setSummary as they are not directly used for loading display here anymore
};

export function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: undefined,
    },
  });

  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Corrected method name
    });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const file = values.document[0];
      if (!file) {
        console.error("No file selected.");
        return;
      }

      const documentDataUri = await readFileAsDataURI(file);
      const result = await onSubmit({ documentDataUri }); // onSubmit now handles setIsLoading

      if (result) {
        form.reset();
        setFileName(null);
        const fileInput = document.getElementById('document-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }
      } else {
         setFileName(null); // Clear filename even on failure
      }
    } catch (error) {
       console.error('Error during form submission in UploadForm:', error);
       setFileName(null); // Clear filename on error
       const fileInput = document.getElementById('document-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }
       // Error handling (toast) is done in page.tsx
    }
    // Do not set isLoading here, it's managed by the caller (page.tsx)
  };

  const fileRef = form.register("document");

  // The form is now rendered or not rendered based on isLoading in page.tsx
  // No internal loading state display needed here.

  return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader>
              <CardTitle className="text-center text-xl md:text-2xl font-semibold">Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
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
                                               disabled={isLoading} // Disable input while loading
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

                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base" disabled={isLoading || !form.formState.isValid || !fileName}>
                          {/* Button text changes are handled implicitly by disabling */}
                          Analyze & Summarize
                      </Button>
                  </form>
              </Form>
          </CardContent>
      </Card>
  );
}
