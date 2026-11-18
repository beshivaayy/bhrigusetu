"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Message = { role: "user" | "gemini"; text: string; model?: string; status?: string };

const starter = "You are Gemini, an independent AI collaborator for BhriguSetu. Help with research, architecture, implementation planning and code review. Be precise, distinguish verified facts from assumptions, and never claim to have inspected files that were not supplied.";

export default function AIWorkspacePage() {
  const [token, setToken] = useState("");
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [model, setModel] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(true);

  const conversationContext = useMemo(() => {
    const recent = messages.slice(-10).map((m) => `${m.role === "user" ? "User" : "Gemini"}: ${m.text}`).join("\\n\\n");
    return [starter, context.trim() ? `User-provided project context:\\n${context.trim()}` : "", recent ? `Conversation so far:\\n${recent}` : ""].filter(Boolean).join("\\n\\n");
  }, [context, messages]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTask = task.trim();
    if (!token.trim()) { setError("Enter the existing BHRIGUSETU_MCP_TOKEN to authorize this private workspace."); return; }
    if (!cleanTask || busy) return;
    setError("");
    setBusy(true);
    setMessages((current) => [...current, { role: "user", text: cleanTask }]);
    setTask("");
    try {
      const response = await fetch("/backend-api/api/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.trim()}` },
        body: JSON.stringify({ task: cleanTask, context: conversationContext, ...(model.trim() ? { model: model.trim() } : {}) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || `Request failed (HTTP ${response.status}).`);
      if (payload.status !== "ok") throw new Error(payload.message || `Gemini returned status: ${payload.status || "unknown"}.`);
      setMessages((current) => [...current, { role: "gemini", text: payload.text, model: payload.model, status: payload.status }]);
      setShowSettings(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach Gemini. Check the token, API key and backend logs.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="ai-workspace">
    <header className="aiw-header">
      <Link href="/" className="aiw-brand"><span>भृ</span><strong>BhriguSetu</strong></Link>
      <nav><Link href="/">मुखपृष्ठ</Link><Link href="/calculator">ज्योतिष गणना</Link><Link href="/granthalaya">ग्रन्थालय</Link></nav>
    </header>
    <section className="aiw-intro">
      <p className="aiw-kicker">AI COLLABORATION · PRIVATE WORKSPACE</p>
      <h1>Gemini <em>Workspace</em></h1>
      <p>Google Gemini ko research, planning aur independent code review ke liye yahin command dein. Responses isi session mein dikhte hain.</p>
      <div className="aiw-boundary"><strong>Clear boundary</strong><span>Gemini ko sirf aapka prompt aur yahan diya gaya context bheja jaata hai. Repository files automatically share nahi hoti; koi code change ya deployment automatically nahi hota.</span></div>
    </section>
    <section className="aiw-shell">
      <aside className="aiw-sidebar">
        <div className="aiw-side-title">WORKSPACE SETTINGS</div>
        <button className="aiw-settings-toggle" type="button" onClick={() => setShowSettings((v) => !v)}>{showSettings ? "Hide settings" : "Show settings"} <span>{showSettings ? "−" : "+"}</span></button>
        {showSettings && <div className="aiw-settings">
          <label>Workspace access token <input type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Existing BHRIGUSETU_MCP_TOKEN" /></label>
          <small>Render par pehle se configured BhriguSetu MCP bearer token. Sirf request ke waqt use hota hai; browser storage mein save nahi hota.</small>
          <label>Gemini model <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Backend default (gemini-3.8-flash)" /></label>
          <label>Project context <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={7} placeholder="Optional: paste relevant files, requirements, architecture notes or task context. Nothing is attached automatically." /></label>
          <button type="button" className="aiw-clear" onClick={() => { setMessages([]); setContext(""); setError(""); }}>Clear conversation</button>
        </div>}
        <div className="aiw-side-note"><span>PROVIDER</span><strong>Google Gemini API</strong><span>AUTHENTICATION</span><strong>Existing BhriguSetu bearer token</strong><span>CODE ACCESS</span><strong>Only context you provide</strong></div>
      </aside>
      <div className="aiw-chat">
        <div className="aiw-chat-head"><div><span>INDEPENDENT AI ASSISTANT</span><h2>Gemini conversation</h2></div><span className="aiw-live-dot">API connected on demand</span></div>
        <div className="aiw-messages" aria-live="polite">
          {!messages.length && <div className="aiw-empty"><div className="aiw-spark">✳</div><h3>What should Gemini work on?</h3><p>Ask for a second opinion, research synthesis, architecture review, implementation plan or code critique.</p><div className="aiw-prompts">{["Review BhriguSetu's current architecture and identify the highest-risk gaps.","Propose a secure ChatGPT–Gemini collaboration workflow for this repository.","Review a code snippet I provide and suggest tests and edge cases."].map((item) => <button key={item} type="button" onClick={() => setTask(item)}>{item}<span>↗</span></button>)}</div></div>}
          {messages.map((message, index) => <article className={message.role === "user" ? "aiw-message user" : "aiw-message gemini"} key={index}><div className="aiw-message-label">{message.role === "user" ? "YOU" : `GEMINI${message.model ? ` · ${message.model}` : ""}`}</div><div className="aiw-message-body">{message.text}</div></article>)}
          {busy && <article className="aiw-message gemini"><div className="aiw-message-label">GEMINI</div><div className="aiw-thinking"><i/><i/><i/> Gemini is thinking…</div></article>}
        </div>
        {error && <div className="aiw-error" role="alert">{error}</div>}
        <form className="aiw-composer" onSubmit={send}><textarea value={task} onChange={(e) => setTask(e.target.value)} rows={3} placeholder="Gemini ko command dein…" disabled={busy}/><div><span>Enter a clear task. Add source files or context in workspace settings when needed.</span><button type="submit" disabled={busy || !task.trim()}>{busy ? "Sending…" : "Send to Gemini"} <b>→</b></button></div></form>
      </div>
    </section>
    <footer className="aiw-footer"><span>BhriguSetu · AI Workspace</span><span>Independent opinion · Human-reviewed changes only</span></footer>
  </main>;
}
