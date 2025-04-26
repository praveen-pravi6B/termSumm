'use server';
/**
 * @fileOverview Summarizes terms and conditions of a document and tailors the tone to the document type.
 *
 * - tailorSummaryToDocumentType - A function that summarizes a document and tailors the tone.
 * - TailorSummaryToDocumentTypeInput - The input type for the tailorSummaryToDocumentType function.
 * - TailorSummaryToDocumentTypeOutput - The return type for the tailorSummaryToDocumentType function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TailorSummaryToDocumentTypeInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z
    .string()
    .describe('The type of the document (e.g., legal, user agreement).'),
});
export type TailorSummaryToDocumentTypeInput = z.infer<
  typeof TailorSummaryToDocumentTypeInputSchema
>;

const TailorSummaryToDocumentTypeOutputSchema = z.object({
  summary: z.string().describe('The summarized terms and conditions.'),
});
export type TailorSummaryToDocumentTypeOutput = z.infer<
  typeof TailorSummaryToDocumentTypeOutputSchema
>;

export async function tailorSummaryToDocumentType(
  input: TailorSummaryToDocumentTypeInput
): Promise<TailorSummaryToDocumentTypeOutput> {
  return tailorSummaryToDocumentTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorSummaryToDocumentTypePrompt',
  input: {
    schema: z.object({
      documentDataUri: z
        .string()
        .describe(
          "The document to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      documentType: z
        .string()
        .describe('The type of the document (e.g., legal, user agreement).'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summarized terms and conditions.'),
    }),
  },
  prompt: `You are an AI expert in summarizing documents, especially terms and conditions.  You are able to understand the type of document, and tailor the summary to be appropriate for the audience.

  Summarize the terms and conditions of the following document, tailoring the tone and presentation to match the document type ({{{documentType}}}). Ensure the summary is easy to understand and relevant to the document type.

  Document: {{media url=documentDataUri}}`,
});

const tailorSummaryToDocumentTypeFlow = ai.defineFlow<
  typeof TailorSummaryToDocumentTypeInputSchema,
  typeof TailorSummaryToDocumentTypeOutputSchema
>(
  {
    name: 'tailorSummaryToDocumentTypeFlow',
    inputSchema: TailorSummaryToDocumentTypeInputSchema,
    outputSchema: TailorSummaryToDocumentTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
