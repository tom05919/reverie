import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const FAST_MODEL = "claude-haiku-3-20250219";
const MAX_RETRIES = 2;

export async function generateAgentMessage(
  systemPrompt: string,
  history: LLMMessage[],
  options?: { model?: string; temperature?: number; maxOutputTokens?: number },
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(options?.model ?? DEFAULT_MODEL),
    system: systemPrompt,
    messages: history.map((m) => ({
      role: m.role === "system" ? "user" : m.role,
      content: m.content,
    })),
    temperature: options?.temperature ?? 0.8,
    maxOutputTokens: options?.maxOutputTokens ?? 400,
    maxRetries: MAX_RETRIES,
  });

  return text;
}

/**
 * Lightweight classification call used by completion detection.
 */
export async function classifyText(
  systemPrompt: string,
  input: string,
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(FAST_MODEL),
    system: systemPrompt,
    prompt: input,
    temperature: 0,
    maxOutputTokens: 20,
    maxRetries: MAX_RETRIES,
  });

  return text.trim().toLowerCase();
}
