"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/v1/workflows/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? "Unable to queue workflow.");
      setMessage(`Workflow ${payload.status}. Your video is ready for the next processing stage.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reach the API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">IMAGINARIUM FOUNDRY</p>
        <h1>Turn one video into a content intelligence system.</h1>
        <p className="lede">Submit a YouTube video and prepare it for transcription, insight extraction, clips, hooks, captions, and distribution.</p>
      </section>
      <form className="card" onSubmit={submit}>
        <label htmlFor="url">YouTube URL</label>
        <input id="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
        <label htmlFor="goal">Primary goal (optional)</label>
        <input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Teach, grow an audience, sell, or repurpose" />
        <button type="submit" disabled={busy}>{busy ? "Starting…" : "Start workflow"}</button>
        {message && <p className="status">{message}</p>}
      </form>
    </main>
  );
}
