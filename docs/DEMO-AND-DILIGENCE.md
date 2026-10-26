# Imaginarium Foundry: demo and diligence
Reviewed 2026-10-26. This is an early content-intelligence prototype, not the entire ecosystem described in the root vision.

## What exists
A Next.js form submits a YouTube URL to a FastAPI job. The job retrieves an English transcript and requests structured content ideas from OpenAI. The browser polls for a result. Clip candidates are ideas, not rendered video clips. Human review remains pending after generation.

## Run locally
Terminal one, from the repository root:
```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r apps/api/requirements.txt
cd apps/api
python -m pytest -q
# Set OPENAI_API_KEY securely in this shell before starting.
# Optionally set OPENAI_MODEL to an available model for your account.
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Terminal two:
```bash
cd apps/web
npm install
npm run dev
```
Open http://localhost:3000. Use a video you own or may process with an available English transcript. Live execution needs internet access and can incur API charges. A missing transcript or API key is a failure case, not a successful demo.

## Demonstration acceptance
Submit a permitted source; retrieve the same job ID; inspect summary and clip ideas; confirm review is still pending. Record source permission, runtime, errors, API usage cost, and reviewer corrections. Show a failure case too.

## Current limits
Jobs live in process memory and disappear on restart. No authentication, tenant isolation, durable queue, measured quality benchmark, or production deployment is established here. Keep the demo local until these concerns are addressed. Automated tests use isolated service doubles; they do not establish live provider reliability.

## Commercial hypothesis
Start with a paid content-intelligence pilot for a defined creator or education team. Measure editing time saved and willingness to renew. Consider a software product only after repeated usage, delivery economics, and retention are demonstrated. No customer count, revenue, valuation, or investment commitment is asserted.

## Diligence needed
Clarify licensing and contributor rights (root license is currently TBD); demonstrate live execution; measure per-job costs; add durable storage, access control, input/output limits, and operational monitoring before hosting for external users.
