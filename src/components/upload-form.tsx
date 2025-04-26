
"use client";

import type * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';


// Define the allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Zod schema for form validation
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
  documentType: z.string().min(1, 'Document type is required.'),
});

type UploadFormProps = {
  onSubmit: (data: { documentDataUri: string; documentType: string }) => Promise<SummarizeTermsAndConditionsOutput | null>;
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
      documentType: '',
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

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSummary(null); // Clear previous summary
    setFileName(null); // Clear file name

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
      setFileName(file.name);

      const result = await onSubmit({
        documentDataUri,
        documentType: values.documentType,
      });

      if (result) {
        setSummary(result);
        toast({
          title: "Success!",
          description: "Your document has been summarized.",
        });
        form.reset(); // Reset form after successful submission
         // Clear file name display
        // Reset the file input visually if possible (complex, might need direct DOM manipulation or key prop change)
        const fileInput = document.getElementById('document-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = ''; // This might not always trigger a UI reset depending on the browser
        }


      } else {
         toast({
            title: "Summarization Failed",
            description: "Could not summarize the document. Please try again.",
            variant: "destructive",
          });
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
    } finally {
      setIsLoading(false);
    }
  };

  const fileRef = form.register("document");

  return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold">Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                      <FormField
                          control={form.control}
                          name="document"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Terms & Conditions Document</FormLabel>
                                  <FormControl>
                                      <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors">
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
                                           />
                                           <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                              {fileName ? (
                                                  <>
                                                     <FileText className="w-8 h-8 mb-2 text-primary" />
                                                     <p className="text-sm text-foreground">{fileName}</p>
                                                  </>
                                              ) : (
                                                  <>
                                                     <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                     <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
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

                      <FormField
                          control={form.control}
                          name="documentType"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Document Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select document type" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          <SelectItem value="legal">Legal Document</SelectItem>
                                          <SelectItem value="user agreement">User Agreement</SelectItem>
                                          <SelectItem value="privacy policy">Privacy Policy</SelectItem>
                                          <SelectItem value="service agreement">Service Agreement</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FormDescription>
                                      This helps tailor the summary tone.
                                  </FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                          {isLoading ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Summarizing...
                              </>
                          ) : (
                              'Summarize Document'
                          )}
                      </Button>
                  </form>
              </Form>
          </CardContent>
      </Card>
  );
}

