
"use server";

import { summarizeTermsAndConditions, type SummarizeTermsAndConditionsInput, type SummarizeTermsAndConditionsOutput } from '@/ai/flows/summarize-terms-and-conditions';
import { generateAudioFromText, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/text-to-speech-flow'; // Import TTS flow

// Action for summarization
export async function serverHandleSummarization(input: SummarizeTermsAndConditionsInput): Promise<SummarizeTermsAndConditionsOutput | null> {
  try {
    const result = await summarizeTermsAndConditions(input);
    console.log("Summarization successful:", result);
    return result;
  } catch (error) {
    console.error("Error during server summarization flow:", error);
    // Optionally, return a more specific error structure or re-throw
    // For simplicity, return null to indicate failure to the client
    return null;
  }
}

// Action for text-to-speech
export async function serverGenerateAudio(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
   console.log("Received request to generate audio for text:", input.text.substring(0, 50) + "...");
  try {
    const result = await generateAudioFromText(input);
     console.log("TTS Flow Result:", result);
    return result;
  } catch (error) {
    console.error("Error during server text-to-speech flow:", error);
    // Return an error structure consistent with TextToSpeechOutput
    return { errorMessage: `Server error during audio generation: ${error instanceof Error ? error.message : String(error)}` };
  }
}
