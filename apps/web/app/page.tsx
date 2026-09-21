"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Prototype ready: connect the API to queue this workflow.");
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
        <button type="submit">Start workflow</button>
        {message && <p className="status">{message}</p>}
      </form>
    </main>
  );
}
