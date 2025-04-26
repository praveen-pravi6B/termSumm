
"use server";

// Update imports for the modified flow
import { summarizeTermsAndConditions, type SummarizeTermsAndConditionsInput, type SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';
// Removed redundant import: import { tailorSummaryToDocumentType, type TailorSummaryToDocumentTypeInput, type TailorSummaryToDocumentTypeOutput } from '@/ai/flows/tailor-summary-to-document-type';


// Update the function signature to accept the modified input type
export async function handleSummarization(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> {
  try {
    // Call the updated flow which now handles document type identification
    const result = await summarizeTermsAndConditions(input);
    console.log("Summarization successful:", result);
    return result;
  } catch (error) {
    console.error("Error during summarization flow:", error);
    return null;
  }
}
