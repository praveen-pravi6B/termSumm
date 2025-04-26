
"use server";

import { summarizeTermsAndConditions, type SummarizeTermsAndConditionsInput, type SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';
import { tailorSummaryToDocumentType, type TailorSummaryToDocumentTypeInput, type TailorSummaryToDocumentTypeOutput } from '@/ai/flows/tailor-summary-to-document-type';


export async function handleSummarization(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> {
  try {
    // Use the existing flow which already considers document type for tone
    const result = await summarizeTermsAndConditions(input);
    console.log("Summarization successful:", result);
    return result;
  } catch (error) {
    console.error("Error during summarization flow:", error);
    // Optionally, you could try the tailoring flow as a fallback,
    // but the primary flow should already handle this based on the prompt.
    // For now, just return null or throw an error.
    // Example fallback (consider if needed):
    /*
    try {
        console.warn("Primary summarization failed, trying tailoring flow...");
        const tailoredResult = await tailorSummaryToDocumentType(input);
        return { summary: tailoredResult.summary, tone: input.documentType }; // Need to explicitly add tone back
    } catch (tailorError) {
        console.error("Error during tailoring flow:", tailorError);
        return null;
    }
    */
    return null;
  }
}
