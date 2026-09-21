"use client";

import { FormEvent, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Stage = { name: string; status: string };
type WorkflowResult = {
  job_id: string;
  status: string;
  workflow: string;
  stages: Stage[];
  artifacts: { summary?: string | null; clip_candidates?: unknown[]; titles?: unknown[]; captions?: unknown[] };
  quality: { warnings: string[]; requires_review: boolean };
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!result || ["completed", "failed"].includes(result.status)) return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`${API_URL}/v1/workflows/${result.job_id}`);
      if (response.ok) setResult(await response.json());
    }, 2500);
    return () => window.clearInterval(timer);
  }, [result]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/v1/workflows/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal, audience, platforms: ["youtube", "shorts", "reels", "tiktok"] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Unable to start workflow.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">IMAGINARIUM FOUNDRY / COMMAND CENTER</p>
        <h1>Turn one video into a content intelligence system.</h1>
        <p className="lede">Submit a YouTube video to retrieve its transcript, extract insights, and generate short-form content opportunities.</p>
      </section>
      <form className="card" onSubmit={submit}>
        <label htmlFor="url">YouTube URL</label>
        <input id="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
        <label htmlFor="audience">Target audience (optional)</label>
        <input id="audience" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Creators, entrepreneurs, students..." />
        <label htmlFor="goal">Primary goal (optional)</label>
        <input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Teach, grow an audience, sell, or repurpose" />
        <button type="submit" disabled={loading}>{loading ? "Starting..." : "Start workflow"}</button>
        {error && <p className="status error">{error}</p>}
      </form>
      {result && (
        <section className="card results">
          <p className="eyebrow">WORKFLOW {result.status.toUpperCase()}</p>
          <h2>{result.workflow}</h2>
          <p>Status: <strong>{result.status}</strong></p>
          <p>Job ID: <code>{result.job_id}</code></p>
          <h3>Pipeline</h3>
          <ul>{result.stages.map((stage) => <li key={stage.name}>{stage.name}: {stage.status}</li>)}</ul>
          {result.artifacts.summary && <><h3>Summary</h3><p>{result.artifacts.summary}</p></>}
          {result.artifacts.clip_candidates?.length ? <p>Clip candidates: {result.artifacts.clip_candidates.length}</p> : null}
          {result.artifacts.titles?.length ? <p>Suggested titles: {result.artifacts.titles.length}</p> : null}
          {result.quality.warnings.map((warning) => <p className="status" key={warning}>{warning}</p>)}
        </section>
      )}
    </main>
  );
}
