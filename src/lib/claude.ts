const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

export interface MessageContent {
  type: "text" | "image";
  text?: string;
  source?: {
    type: "base64";
    media_type: string;
    data: string;
  };
}

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string | MessageContent[];
}

export interface ClaudeOptions {
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
}

export async function callClaude({
  system,
  messages,
  maxTokens = 1000,
}: ClaudeOptions): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Claude API call failed");
  }

  const data = await response.json();
  return data.content
    .map((block: MessageContent) => (block.type === "text" ? block.text : ""))
    .join("");
}

export function imageToMessageContent(
  base64: string,
  mediaType: string = "image/jpeg"
): MessageContent {
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: mediaType,
      data: base64,
    },
  };
}

export function parseJSON<T>(text: string): T {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    throw new Error("Failed to parse Claude response as JSON");
  }
}
