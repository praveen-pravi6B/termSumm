
"use server";

import { summarizeTermsAndConditions, type SummarizeTermsAndConditionsInput, type SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';

// Rename to avoid conflict with client-side handler in page.tsx
export async function serverHandleSummarization(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> {
  try {
    const result = await summarizeTermsAndConditions(input);
    console.log("Summarization successful:", result);
    return result;
  } catch (error) {
    // Log the detailed error on the server
    console.error("Error during server summarization flow:", error);
    // Optionally, return a more specific error structure or re-throw
    // Re-throwing might be better for the client to catch specific errors if needed
    // throw new Error("Summarization failed on the server.");
    return null; // Keep returning null for simplicity based on previous structure
  }
}
