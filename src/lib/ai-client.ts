import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// --- Provider config ---

export type AIProvider = "openai" | "anthropic" | "lmstudio";

const AI_PROVIDER = (process.env.AI_PROVIDER || "openai") as AIProvider;

function getOpenAIClient(): OpenAI {
  if (AI_PROVIDER === "lmstudio") {
    return new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: "lm-studio" });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required when AI_PROVIDER=openai");
  }
  return new OpenAI({ apiKey });
}

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required when AI_PROVIDER=anthropic");
  }
  return new Anthropic({ apiKey });
}

// Singleton caching
const globalForAI = globalThis as unknown as {
  openaiClient: OpenAI | undefined;
  anthropicClient: Anthropic | undefined;
};

function openai(): OpenAI {
  if (!globalForAI.openaiClient) {
    globalForAI.openaiClient = getOpenAIClient();
  }
  return globalForAI.openaiClient;
}

function anthropic(): Anthropic {
  if (!globalForAI.anthropicClient) {
    globalForAI.anthropicClient = getAnthropicClient();
  }
  return globalForAI.anthropicClient;
}

// --- Model defaults ---

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";
const ANTHROPIC_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514";
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL ?? "default";

function getModel(): string {
  switch (AI_PROVIDER) {
    case "openai": return OPENAI_MODEL;
    case "anthropic": return ANTHROPIC_MODEL;
    case "lmstudio": return LMSTUDIO_MODEL;
  }
}

// --- Chat completion ---

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  json?: boolean;
  maxTokens?: number;
}

export async function chatCompletion(
  systemPrompt: string,
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  const { json = false, maxTokens = 2048 } = options;

  if (AI_PROVIDER === "anthropic") {
    return chatCompletionAnthropic(systemPrompt, messages, maxTokens);
  }

  return chatCompletionOpenAI(systemPrompt, messages, maxTokens, json);
}

async function chatCompletionOpenAI(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens: number,
  json: boolean
): Promise<string> {
  const client = openai();
  const model = getModel();

  const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: openaiMessages,
    ...(json ? { response_format: { type: "json_object" as const } } : {}),
  });

  return response.choices[0]?.message?.content ?? "";
}

async function chatCompletionAnthropic(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  const client = anthropic();
  const model = getModel();

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export { AI_PROVIDER };
