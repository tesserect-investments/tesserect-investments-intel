export const config = { runtime: 'edge' };

import { mapErrorToResponse } from '../server/error-mapper';
import { getCorsHeaders, isDisallowedOrigin } from '../server/cors';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface ChatRequestBody {
  messages: ChatMessage[];
  confidential?: boolean;
}

const TESSERECT_SYSTEM_PROMPT =
  'You are Tesserect AI, an assistant embedded in the Tesserect trade intelligence dashboard. ' +
  'Tesserect focuses on commodity trade facilitation, trade corridors, ports, Gulf investments, and ' +
  'economic intelligence with a strong emphasis on South Africa, Africa, MENA, and Asia. ' +
  'When answering, prioritize international trade, supply chains, and investment flows over military topics. ' +
  'If user questions involve secret or highly sensitive business information, remind them that confidential ' +
  'mode is only available in the desktop app using a local model. Do not fabricate Tesserect products; stick to ' +
  'what a trade intelligence dashboard can reasonably do (maps, ports, corridors, markets, economic signals).';

export default async function handler(request: Request): Promise<Response> {
  if (isDisallowedOrigin(request)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(request);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const body = (await request.json()) as ChatRequestBody;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const userMessages = messages.filter(m => m && typeof m.content === 'string');

    if (userMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { reply, provider, model } = await routeToProvider(userMessages);

    return new Response(
      JSON.stringify({
        reply,
        provider,
        model,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    );
  } catch (err) {
    const mapped = mapErrorToResponse(err);
    return new Response(JSON.stringify({ error: mapped.body.error }), {
      status: mapped.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

async function routeToProvider(messages: ChatMessage[]): Promise<{ reply: string; provider: string; model: string }> {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // Build chat history with Tesserect system prompt
  const chatMessages = [
    { role: 'system' as const, content: TESSERECT_SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  if (groqKey) {
    try {
      const resp = await callChatApi(
        'https://api.groq.com/openai/v1/chat/completions',
        groqKey,
        process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
        chatMessages,
        {},
      );
      if (resp) {
        return { reply: resp, provider: 'groq', model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile' };
      }
    } catch {
      // fall through to OpenRouter
    }
  }

  if (openRouterKey) {
    try {
      const resp = await callChatApi(
        'https://openrouter.ai/api/v1/chat/completions',
        openRouterKey,
        'openrouter/free',
        chatMessages,
        {
          'X-Title': 'Tesserect AI Chat',
        },
      );
      if (resp) {
        return { reply: resp, provider: 'openrouter', model: 'openrouter/free' };
      }
    } catch {
      // final fallback below
    }
  }

  return {
    reply:
      'Tesserect AI is currently unavailable (no AI provider configured). Configure GROQ_API_KEY or OPENROUTER_API_KEY in Settings to enable chat.',
    provider: '',
    model: '',
  };
}

async function callChatApi(
  url: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  extraHeaders: Record<string, string>,
): Promise<string | null> {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      max_tokens: 800,
    }),
  });
  if (!resp.ok) return null;
  const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

