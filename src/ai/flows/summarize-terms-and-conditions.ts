'use server';

/**
 * @fileOverview A terms and conditions summarization AI agent.
 *
 * - summarizeTermsAndConditions - A function that handles the summarization process.
 * - SummarizeTermsAndConditionsInput - The input type for the summarizeTermsAndConditions function.
 * - SummarizeTermsAndConditionsOutput - The return type for the summarizeTermsAndConditions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeTermsAndConditionsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z.string().describe('The type of the document (e.g., legal, user agreement).'),
});
export type SummarizeTermsAndConditionsInput = z.infer<typeof SummarizeTermsAndConditionsInputSchema>;

const SummarizeTermsAndConditionsOutputSchema = z.object({
  summary: z.string().describe('The summarized terms and conditions.'),
  tone: z.string().describe('The tone of the summary, matching the document type.'),
});
export type SummarizeTermsAndConditionsOutput = z.infer<typeof SummarizeTermsAndConditionsOutputSchema>;

export async function summarizeTermsAndConditions(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput> {
  return summarizeTermsAndConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTermsAndConditionsPrompt',
  input: {
    schema: z.object({
      documentDataUri: z
        .string()
        .describe(
          "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      documentType: z.string().describe('The type of the document (e.g., legal, user agreement).'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summarized terms and conditions.'),
      tone: z.string().describe('The tone of the summary, matching the document type.'),
    }),
  },
  prompt: `You are an AI expert in summarization, especially for legal documents.

You will receive a document and its identified type. Your goal is to summarize the terms and conditions of the document and adjust the tone to match the document type.

Document Type: {{{documentType}}}
Document: {{media url=documentDataUri}}

Summary:`,
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
