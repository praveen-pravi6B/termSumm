'use server';

/**
 * @fileOverview A terms and conditions summarization AI agent that automatically identifies the document type and extracts pros and cons.
 *
 * - summarizeTermsAndConditions - A function that handles the summarization process.
 * - SummarizeTermsAndConditionsInput - The input type for the summarizeTermsAndConditions function.
 * - SummarizeTermsAndConditionsOutput - The return type for the summarizeTermsAndConditions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Input schema remains the same
const SummarizeTermsAndConditionsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeTermsAndConditionsInput = z.infer<typeof SummarizeTermsAndConditionsInputSchema>;

// Update output schema to include pros and cons
const SummarizeTermsAndConditionsOutputSchema = z.object({
  summary: z.string().describe('The summarized key terms and conditions.'),
  identifiedDocumentType: z.string().describe('The identified type of the document (e.g., legal, user agreement, privacy policy).'),
  pros: z.array(z.string()).describe('A list of potential benefits or user-friendly aspects found in the document.'),
  cons: z.array(z.string()).describe('A list of potential drawbacks, risks, or strict limitations found in the document.'),
});
export type SummarizeTermsAndConditionsOutput = z.infer<typeof SummarizeTermsAndConditionsOutputSchema>;

// Wrapper function signature remains the same
export async function summarizeTermsAndConditions(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput> {
  return summarizeTermsAndConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTermsAndConditionsPrompt',
  // Input schema reference remains the same
  input: {
    schema: z.object({
      documentDataUri: z
        .string()
        .describe(
          "A document of various formats (e.g., DOC, PDF, TXT), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  // Update output schema reference to include pros and cons
  output: {
    schema: z.object({
        summary: z.string().describe('The summarized key terms and conditions.'),
        identifiedDocumentType: z.string().describe('The identified type of the document (e.g., legal, user agreement, privacy policy).'),
        pros: z.array(z.string()).describe('A list of potential benefits or user-friendly aspects found in the document. Provide at least 2-3 points if applicable, otherwise an empty array.'),
        cons: z.array(z.string()).describe('A list of potential drawbacks, risks, or strict limitations found in the document. Provide at least 2-3 points if applicable, otherwise an empty array.'),
    }),
  },
  // Update prompt instructions to request pros and cons
  prompt: `You are an AI expert in analyzing and summarizing documents, especially legal and terms & conditions documents.

You will receive a document. Your tasks are:
1. Identify the type of the document (e.g., Legal Document, User Agreement, Privacy Policy, Service Agreement, Other). Store this in the 'identifiedDocumentType' field.
2. Summarize the key terms and conditions of the document concisely.
3. Identify potential benefits or user-friendly aspects ('pros') from the document. List them clearly. If none are apparent, return an empty array for 'pros'.
4. Identify potential drawbacks, risks, or strict limitations ('cons') from the document. List them clearly. If none are apparent, return an empty array for 'cons'.
5. Ensure the tone and focus of the summary, pros, and cons are appropriate for the identified document type.

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
  // Ensure pros and cons are always arrays, even if the model returns null/undefined
  return {
      summary: output?.summary || 'Summary could not be generated.',
      identifiedDocumentType: output?.identifiedDocumentType || 'Unknown',
      pros: output?.pros || [],
      cons: output?.cons || [],
    };
});
