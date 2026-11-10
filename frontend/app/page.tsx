"use client";

import { FormEvent, useState } from "react";

type Analysis = {
  status: string;
  analysis_date: string;
  running_year: number;
  bcp: {
    status: string;
    activated_house: number;
    cycle: number;
    chakra_swami: string | null;
    chakra_swami_status: string;
    interpretation_status: string;
    message: string;
  };
  bsp: { status: string; triggered_rules: unknown[]; enabled_rule_count: number; message: string };
  chart: { status: string; reason: string };
  warnings: string[];
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export default function Home() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [tz, setTz] = useState("Asia/Kolkata");
  const [timeFold, setTimeFold] = useState("");\n  const [timeFold, setTimeFold] = useState("");
  const [asOf, setAsOf] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_of_birth: dob,
          time_of_birth: tob,
          time_fold: timeFold === "" ? null : Number(timeFold),\n          time_fold: timeFold === "" ? null : Number(timeFold),
          place_name: place || null,
          latitude: Number(lat),
          longitude: Number(lon),
          timezone: tz,
          as_of_date: asOf || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const detail = Array.isArray(payload.detail)
          ? payload.detail.map((item: { msg?: string }) => item.msg).join("; ")
          : payload.detail || "The calculation service returned an error.";
        throw new Error(detail);
      }
      setResult(payload as Analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to the BhriguSetu API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="BhriguSetu home">
          <span className="brand-mark">ॐ</span>
          <span><strong>BhriguSetu</strong><small>BRIHGU CHAKRA · BRIHGU SARAL</small></span>
        </a>
        <span className="top-note">A research-first Jyotish project</span>
      </header>

      <section className="hero">
        <p className="eyebrow">BHRIGU CHAKRA PADDHATI · BHRIGU SARAL PADDHATI</p>
        <h1>Tradition, calculated<br /><em>with traceability.</em></h1>
        <p className="hero-copy">A focused research platform for BCP and BSP. Every enabled calculation is designed to be inspectable, testable and connected to its source.</p>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div><p className="eyebrow">01 / NATAL INPUT</p><h2>Birth details</h2></div>
          <span className="required-note">All fields marked * are required</span>
        </div>
        <form onSubmit={submit}>
          <label>Date of birth *<input type="date" value={dob} onChange={e => setDob(e.target.value)} required /></label>
          <label>Time of birth *<input type="time" step="1" value={tob} onChange={e => setTob(e.target.value)} required /></label>
          <label className="full">Birthplace name<input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. Maheshwar, Madhya Pradesh" /></label>
          <label>Latitude *<input type="number" step="any" min="-90" max="90" value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 22.17" required /></label>
          <label>Longitude *<input type="number" step="any" min="-180" max="180" value={lon} onChange={e => setLon(e.target.value)} placeholder="e.g. 75.58" required /></label>
          <label>Timezone (IANA) *<input value={tz} onChange={e => setTz(e.target.value)} placeholder="Asia/Kolkata" required /></label>
          <label>Repeated local time (DST only)<select value={timeFold} onChange={e => setTimeFold(e.target.value)}><option value="">Not applicable / unknown</option><option value="0">Earlier occurrence (fold 0)</option><option value="1">Later occurrence (fold 1)</option></select></label>\n          <label>Repeated local time (DST only)<select value={timeFold} onChange={e => setTimeFold(e.target.value)}><option value="">Not applicable / unknown</option><option value="0">Earlier occurrence (fold 0)</option><option value="1">Later occurrence (fold 1)</option></select></label>
          <label>Analyse for date<input type="date" value={asOf} onChange={e => setAsOf(e.target.value)} /></label>
          <p className="form-hint full">Leave “Analyse for date” empty to use today in the selected timezone. Coordinates are required; birthplace text alone is not used for astronomical calculations. If a timezone repeats a clock time during a DST change, select the earlier or later occurrence. If a timezone repeats a clock time during a DST change, select the earlier or later occurrence.</p>
          <button className="submit full" disabled={loading}>{loading ? "Calculating…" : "Calculate BCP activation + BSP status"} <span>→</span></button>
        </form>
        {error && <div className="error" role="alert">{error}</div>}
      </section>

      {result && <section className="results" aria-live="polite">
        <div className="section-heading"><div><p className="eyebrow">02 / ENGINE OUTPUT</p><h2>Calculation report</h2></div><span className="status-pill">Partial calculation</span></div>
        <div className="metric-grid">
          <article className="metric"><span>Running year</span><strong>{result.running_year}</strong><small>As of {result.analysis_date}</small></article>
          <article className="metric"><span>BCP activated house</span><strong>{result.bcp.activated_house}</strong><small>House activation only</small></article>
          <article className="metric"><span>BCP cycle</span><strong>{result.bcp.cycle}</strong><small>{result.bcp.chakra_swami ? `Provisional swami: ${result.bcp.chakra_swami}` : "Swami not defined"}</small></article>
        </div>
        <div className="report-row"><div><p className="eyebrow">BCP</p><h3>House activation calculated</h3><p>{result.bcp.message}</p><small>Chakra-swami status: {result.bcp.chakra_swami_status.replaceAll("_", " ")}</small></div><span className="status-pill">Provisional</span></div>
        <div className="report-row"><div><p className="eyebrow">BSP</p><h3>Rule evaluation not enabled</h3><p>{result.bsp.message}</p><small>Enabled rules: {result.bsp.enabled_rule_count}</small></div><span className="status-pill muted">Research pending</span></div>
        <div className="notice"><strong>Why no horoscope is shown yet</strong><p>{result.chart.reason}</p></div>
        <div className="warnings"><strong>Methodology and accuracy notes</strong><ul>{result.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div>
      </section>}

      <section className="principles">
        <p className="eyebrow">PROJECT PRINCIPLES</p>
        <div><article><b>01</b><h3>Source before rule</h3><p>No unattributed rule enters the production engine.</p></article><article><b>02</b><h3>Calculation before claim</h3><p>Unimplemented astronomy is never replaced with guessed chart data.</p></article><article><b>03</b><h3>Trace every result</h3><p>Rule IDs, source locations and validation cases belong beside the output.</p></article></div>
      </section>
      <footer><strong>BhriguSetu</strong><span>BCP · BSP</span><span>Research status: in development</span></footer>
    </main>
  );
}
