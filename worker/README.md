# ollama-proxy

A tiny Cloudflare Worker that proxies chat requests from the GitHub Pages
portfolio (`agent.html`) to Ollama Cloud. It exists so the API key never
ships to the browser.

## One-time setup

1. Install Wrangler if you don't have it:
   ```
   npm i -g wrangler
   wrangler login
   ```

2. From this directory:
   ```
   wrangler deploy
   ```
   First run will prompt you to pick a `workers.dev` subdomain. After deploy
   it prints the URL — something like
   `https://ollama-proxy.<your-subdomain>.workers.dev`.

3. Add your Ollama Cloud key as a secret (it never appears in code or logs):
   ```
   wrangler secret put OLLAMA_API_KEY
   ```
   Paste the key when prompted.

4. Open `../agent.html`, find `CONFIG.workerUrl`, paste the Worker URL.

## Verify

```
curl -X POST https://ollama-proxy.<sub>.workers.dev \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://sinha96.github.io' \
  -d '{
    "model": "gpt-oss:120b-cloud",
    "messages": [{"role": "user", "content": "Say hello in one word."}],
    "stream": false
  }'
```

Should return a JSON object with `message.content`. If you get a 401 or 403,
the API key isn't set or the model name is wrong.

## Things to verify against current Ollama Cloud docs

These were accurate as of late 2025 — re-check before you rely on them:

- **Endpoint**: `https://ollama.com/api/chat` (set in `ollama-proxy.js` as
  `UPSTREAM_URL`).
- **Auth header**: `Authorization: Bearer <key>`.
- **Default model**: `gpt-oss:120b-cloud`. Other options that have existed:
  `gpt-oss:20b-cloud`, `deepseek-v3.1:671b-cloud`, `qwen3-coder:480b-cloud`,
  `kimi-k2:1t-cloud`. Pick what fits your throughput + cost. The caller
  (agent.html) overrides this.
- **Streaming format**: NDJSON, one JSON object per line, each with
  `message.content`. The Worker pipes the response body straight through; no
  parsing required server-side.

If Ollama Cloud has moved endpoints, only `UPSTREAM_URL` in
`ollama-proxy.js` needs to change.

## What the Worker enforces

- **Origin allowlist** — only `sinha96.github.io` (and localhost for dev)
  can call it. Easy to broaden in `ALLOWED_ORIGINS`.
- **Rate limit** — 20 req/min and 200 req/hour per IP. In-memory, best
  effort; resets on cold start.
- **Body cap** — 16KB. Prevents pathological prompts.
- **Last-20 messages only** — passes through at most the last 20 chat turns.

## Cost

Cloudflare Workers free tier: 100k requests/day. You will not hit that.
Ollama Cloud charges per token — see the dashboard for pricing.
