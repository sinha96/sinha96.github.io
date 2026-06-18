// ════════════════════════════════════════════════════════════
//  ollama-proxy.js — Cloudflare Worker
//
//  Two routes:
//    POST /         (and /chat) → proxies to Ollama Cloud /api/chat,
//                                  injecting OLLAMA_API_KEY.
//    POST /tts                  → proxies to Hugging Face Inference
//                                  for text-to-speech, injecting
//                                  HF_TOKEN. Returns audio bytes.
//
//  Deploy:
//    1. cd worker
//    2. npx wrangler deploy
//    3. npx wrangler secret put OLLAMA_API_KEY   (paste your key)
//    4. npx wrangler secret put HF_TOKEN          (free at huggingface.co/settings/tokens)
//
//  Once deployed it returns a URL like
//    https://ollama-proxy.<your-subdomain>.workers.dev
//  Put that URL in index.html → CONFIG.workerUrl.
// ════════════════════════════════════════════════════════════

const UPSTREAM_OLLAMA  = 'https://ollama.com/api/chat';

// Default HF TTS model. Override by sending {"model": "<repo/name>"} on
// the /tts request. Other open-weight options worth trying:
//   - facebook/mms-tts-eng           (single voice, fast, multilingual)
//   - espnet/kan-bayashi_ljspeech_vits
//   - microsoft/speecht5_tts         (needs speaker embeddings)
const HF_DEFAULT_TTS_MODEL = 'facebook/mms-tts-eng';

const ALLOWED_ORIGINS = new Set([
  'https://sinha96.github.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

// 128KB body cap for /chat (system prompt + context + history + JD).
// /tts has its own much smaller text cap.
const MAX_BODY_BYTES = 128 * 1024;
const MAX_TTS_CHARS  = 4000;

// Per-IP rate limit (in-memory, resets on Worker cold start).
const RATE = { perMin: 30, perHour: 300 };
const ipHits = new Map(); // ip -> [timestamps]

function cors(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://sinha96.github.io';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function rateLimited(ip) {
  const now = Date.now();
  const arr = (ipHits.get(ip) || []).filter(t => now - t < 3600_000);
  const lastMin = arr.filter(t => now - t < 60_000).length;
  if (lastMin >= RATE.perMin || arr.length >= RATE.perHour) return true;
  arr.push(now);
  ipHits.set(ip, arr);
  return false;
}

function jsonError(msg, status, cors_h) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...cors_h, 'Content-Type': 'application/json' },
  });
}

// ── /chat handler (Ollama Cloud) ────────────────────────────
async function handleChat(req, env, cors_h) {
  if (!env.OLLAMA_API_KEY) {
    return jsonError('Worker not configured: OLLAMA_API_KEY missing', 500, cors_h);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return jsonError('Request too large', 413, cors_h);
  }

  let payload;
  try { payload = JSON.parse(raw); }
  catch { return new Response('Bad JSON', { status: 400, headers: cors_h }); }

  const upstreamBody = {
    model: payload.model || 'gpt-oss:120b-cloud',
    messages: Array.isArray(payload.messages) ? payload.messages.slice(-20) : [],
    stream: payload.stream !== false,
    options: payload.options || { temperature: 0.6, num_predict: 800 },
  };

  let upstream;
  try {
    upstream = await fetch(UPSTREAM_OLLAMA, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch (e) {
    return jsonError('Upstream fetch failed: ' + e.message, 502, cors_h);
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return jsonError(`Upstream ${upstream.status}: ${text.slice(0, 400)}`, upstream.status, cors_h);
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...cors_h,
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

// ── /tts handler (Hugging Face Inference) ───────────────────
async function handleTts(req, env, cors_h) {
  if (!env.HF_TOKEN) {
    return jsonError('Worker not configured: HF_TOKEN missing. `npx wrangler secret put HF_TOKEN`.', 500, cors_h);
  }

  let payload;
  try { payload = await req.json(); }
  catch { return jsonError('Bad JSON', 400, cors_h); }

  const text = (payload.text || '').trim();
  if (!text) return jsonError('Missing "text" field', 400, cors_h);
  if (text.length > MAX_TTS_CHARS) {
    return jsonError(`Text too long (${text.length} > ${MAX_TTS_CHARS} chars)`, 413, cors_h);
  }

  const model = payload.model || HF_DEFAULT_TTS_MODEL;
  // HF migrated free serverless inference from api-inference.huggingface.co
  // to the new router. Try the new URL first; if it fails (DNS, 404), fall
  // back to the legacy endpoint for repos that still serve there.
  const HF_URLS = [
    `https://router.huggingface.co/hf-inference/models/${model}`,
    `https://api-inference.huggingface.co/models/${model}`,
  ];

  let upstream = null;
  let lastErr = '';
  for (const url of HF_URLS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'audio/wav',
          'x-wait-for-model': 'true',
        },
        body: JSON.stringify({ inputs: text }),
      });
      if (r.ok) { upstream = r; break; }
      // Read once for the diagnostic; the response body can only be read once.
      lastErr = `${url} → ${r.status} ${await r.text().then(t => t.slice(0, 200)).catch(() => '')}`;
    } catch (e) {
      lastErr = `${url} → ${e.message}`;
    }
  }

  if (!upstream) {
    return jsonError(`HF unreachable. Last: ${lastErr}`, 502, cors_h);
  }

  const ct = upstream.headers.get('Content-Type') || 'audio/wav';
  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...cors_h,
      'Content-Type': ct,
      'Cache-Control': 'no-store',
    },
  });
}

// ── Router ──────────────────────────────────────────────────
export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors_h = cors(origin);

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors_h });
    }
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors_h });
    }

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return jsonError('Rate limited. Try again in a minute.', 429, cors_h);
    }

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (path === '/tts')  return handleTts(req, env, cors_h);
    // Everything else (/, /chat) → Ollama chat handler
    return handleChat(req, env, cors_h);
  },
};
