'use server';

/**
 * @fileOverview A terms and conditions summarization AI agent that automatically identifies the document type.
 *
 * - summarizeTermsAndConditions - A function that handles the summarization process.
 * - SummarizeTermsAndConditionsInput - The input type for the summarizeTermsAndConditions function.
 * - SummarizeTermsAndConditionsOutput - The return type for the summarizeTermsAndConditions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Remove documentType from input schema
const SummarizeTermsAndConditionsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeTermsAndConditionsInput = z.infer<typeof SummarizeTermsAndConditionsInputSchema>;

// Add identifiedDocumentType to output schema
const SummarizeTermsAndConditionsOutputSchema = z.object({
  summary: z.string().describe('The summarized terms and conditions.'),
  identifiedDocumentType: z.string().describe('The identified type of the document (e.g., legal, user agreement, privacy policy).'),
});
export type SummarizeTermsAndConditionsOutput = z.infer<typeof SummarizeTermsAndConditionsOutputSchema>;

// Update the wrapper function signature
export async function summarizeTermsAndConditions(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput> {
  return summarizeTermsAndConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTermsAndConditionsPrompt',
  // Update input schema reference
  input: {
    schema: z.object({
      documentDataUri: z
        .string()
        .describe(
          "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  // Update output schema reference
  output: {
    schema: z.object({
        summary: z.string().describe('The summarized terms and conditions.'),
        identifiedDocumentType: z.string().describe('The identified type of the document (e.g., legal, user agreement, privacy policy).'),
    }),
  },
  // Update prompt instructions
  prompt: `You are an AI expert in analyzing and summarizing documents, especially legal and terms & conditions documents.

You will receive a document. Your tasks are:
1. Identify the type of the document (e.g., Legal Document, User Agreement, Privacy Policy, Service Agreement, Other). Store this in the 'identifiedDocumentType' field.
2. Summarize the key terms and conditions of the document.
3. Ensure the tone and focus of the summary are appropriate for the identified document type.

Document: {{media url=documentDataUri}}

Output:`,
});

const summarizeTermsAndConditionsFlow = ai.defineFlow<
  typeof SummarizeTermsAndConditionsInputSchema,
  typeof SummarizeTermsAndConditionsOutputSchema
>({
  name: 'summarizeTermsAndConditionsFlow',
  inputSchema: SummarizeTermsAndConditionsInputSchema,
  outputSchema: SummarizeTermsAndConditionsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
