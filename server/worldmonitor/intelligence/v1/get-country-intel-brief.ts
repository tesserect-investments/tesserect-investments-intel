declare const process: { env: Record<string, string | undefined> };

import type {
  ServerContext,
  GetCountryIntelBriefRequest,
  GetCountryIntelBriefResponse,
} from '../../../../src/generated/server/worldmonitor/intelligence/v1/service_server';

import { getCachedJson, setCachedJson } from '../../../_shared/redis';
import { UPSTREAM_TIMEOUT_MS, GROQ_API_URL, GROQ_MODEL, TIER1_COUNTRIES } from './_shared';
import { CHROME_UA } from '../../../_shared/constants';

// ========================================================================
// Constants
// ========================================================================

const INTEL_CACHE_TTL = 7200;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openrouter/free'; // free tier; same as news summarization

// ========================================================================
// Helpers: call OpenAI-compatible chat API and return brief text
// ========================================================================

async function callChatApi(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string,
  extraHeaders: Record<string, string> = {},
): Promise<string> {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': CHROME_UA,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.4,
      max_tokens: 900,
    }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!resp.ok) return '';
  const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ========================================================================
// RPC handler: try Groq first, then OpenRouter
// ========================================================================

export async function getCountryIntelBrief(
  _ctx: ServerContext,
  req: GetCountryIntelBriefRequest,
): Promise<GetCountryIntelBriefResponse> {
  const empty: GetCountryIntelBriefResponse = {
    countryCode: req.countryCode,
    countryName: '',
    brief: '',
    model: '',
    generatedAt: Date.now(),
  };

  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!groqKey && !openRouterKey) return empty;

  const cacheKey = `ci-sebuf:v1:${req.countryCode}`;
  const cached = (await getCachedJson(cacheKey)) as GetCountryIntelBriefResponse | null;
  if (cached?.brief) return cached;

  const countryName = TIER1_COUNTRIES[req.countryCode] || req.countryCode;
  const dateStr = new Date().toISOString().split('T')[0];
  const userContent = `Country: ${countryName} (${req.countryCode})`;

  const systemPrompt = `You are a senior intelligence analyst providing comprehensive country situation briefs focused on international trade and commercial context. Current date: ${dateStr}. Provide geopolitical context appropriate for the current date.

Write a concise intelligence brief for the requested country covering:
1. Current Situation - what is happening right now (emphasize trade, supply chains, and economic developments where relevant)
2. Trade & Economic Links - key trade partners, ports, corridors, tariffs/sanctions impact, and supply-chain exposure
3. Security risks that affect trade - include sanctions, port security, chokepoints, or policy risks only when they matter for trade or commerce
4. Regional Context - especially trade blocs, agreements, and commercial ties
5. Outlook & Watch Items - trade deals, policy shifts, and supply-chain watch items

Rules:
- Prioritize international trade, supply chains, and commercial implications over purely military developments
- Keep security/trade-policy risks (sanctions, tariffs, port closures, embargoes) when they affect trade
- Be specific and analytical; 4-5 paragraphs, 250-350 words
- No speculation beyond what data supports; use plain language, not jargon`;

  let brief = '';
  let model = '';

  if (groqKey) {
    try {
      brief = await callChatApi(GROQ_API_URL, groqKey, GROQ_MODEL, systemPrompt, userContent);
      model = GROQ_MODEL;
    } catch {
      /* try OpenRouter next */
    }
  }

  if (!brief && openRouterKey) {
    try {
      brief = await callChatApi(OPENROUTER_API_URL, openRouterKey, OPENROUTER_MODEL, systemPrompt, userContent, {
        'HTTP-Referer': 'https://intel.tesserect.com',
        'X-Title': 'Tesserect',
      });
      model = OPENROUTER_MODEL;
    } catch {
      /* already empty */
    }
  }

  const result: GetCountryIntelBriefResponse = {
    countryCode: req.countryCode,
    countryName,
    brief,
    model: model || (groqKey ? GROQ_MODEL : 'openrouter'),
    generatedAt: Date.now(),
  };

  if (brief) await setCachedJson(cacheKey, result, INTEL_CACHE_TTL);
  return result;
}
