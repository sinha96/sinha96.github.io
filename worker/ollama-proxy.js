// ════════════════════════════════════════════════════════════
//  ollama-proxy.js — Cloudflare Worker
//
//  Proxies chat requests from sinha96.github.io to Ollama Cloud,
//  injecting the API key from a Worker secret so the key never
//  ships to the browser.
//
//  Deploy:
//    1. cd worker
//    2. wrangler deploy
//    3. wrangler secret put OLLAMA_API_KEY   (paste your key)
//
//  Once deployed it returns a URL like
//    https://ollama-proxy.<your-subdomain>.workers.dev
//  Put that URL in agent.html → CONFIG.workerUrl.
// ════════════════════════════════════════════════════════════

// Verify these against current Ollama Cloud docs — they were
// accurate as of late 2025 but change occasionally.
const UPSTREAM_URL = 'https://ollama.com/api/chat';

// Allow only your site to call this Worker. Add localhost for dev.
const ALLOWED_ORIGINS = new Set([
  'https://sinha96.github.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

// Cap on free-form input size so a bad actor can't DOS the upstream.
const MAX_BODY_BYTES = 16 * 1024;

// Per-IP rate limit (sliding window in memory — best-effort,
// resets on Worker cold start; good enough for a portfolio).
const RATE = { perMin: 20, perHour: 200 };
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
    if (!env.OLLAMA_API_KEY) {
      return new Response(JSON.stringify({ error: 'Worker not configured: OLLAMA_API_KEY missing' }),
        { status: 500, headers: { ...cors_h, 'Content-Type': 'application/json' } });
    }

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limited. Try again in a minute.' }),
        { status: 429, headers: { ...cors_h, 'Content-Type': 'application/json' } });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { ...cors_h, 'Content-Type': 'application/json' } });
    }

    let payload;
    try { payload = JSON.parse(raw); }
    catch { return new Response('Bad JSON', { status: 400, headers: cors_h }); }

    // Defensive defaults — caller can override model + options.
    const upstreamBody = {
      model: payload.model || 'gpt-oss:120b-cloud',
      messages: Array.isArray(payload.messages) ? payload.messages.slice(-20) : [],
      stream: payload.stream !== false,
      options: payload.options || {
        temperature: 0.6,
        num_predict: 800,
      },
    };

    let upstream;
    try {
      upstream = await fetch(UPSTREAM_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OLLAMA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upstreamBody),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed: ' + e.message }),
        { status: 502, headers: { ...cors_h, 'Content-Type': 'application/json' } });
    }

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: `Upstream ${upstream.status}: ${text.slice(0, 400)}` }),
        { status: upstream.status, headers: { ...cors_h, 'Content-Type': 'application/json' } });
    }

    // Stream NDJSON straight through.
    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...cors_h,
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  },
};
