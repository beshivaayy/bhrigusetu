"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "./desk.css";

const API = "/backend-api";

type Analysis = Record<string, any>;

const systems = [
  { group: "Vedic Jyotisha", name: "Parashari", detail: "Rashi, bhava, shodashvarga, yoga, dasha, bala and ashtakavarga.", state: "Foundation available", href: "/calculator" },
  { group: "Vedic Jyotisha", name: "Jaimini", detail: "Chara karaka, rashi drishti, arudha, upapada and Jaimini dasha.", state: "Planned module" },
  { group: "Bhrigu traditions", name: "Bhrigu Chakra Paddhati", detail: "Running year, 12-house activation, calculation record and year sequence.", state: "Working calculation", href: "/bcp" },
  { group: "Bhrigu traditions", name: "Bhrigu Saral Paddhati", detail: "Source-linked research register, Kakshya lookup and whole-degree utility.", state: "Research foundation", href: "/bsp" },
  { group: "Bhrigu traditions", name: "Bhrigu Nandi Nadi", detail: "Planetary linkage, progression and event-validation workflows.", state: "Planned module" },
  { group: "Other Vedic systems", name: "KP Astrology", detail: "Cusps, sub-lords, significators and ruling planets.", state: "Planned module" },
  { group: "Other Vedic systems", name: "Tajika · Varshaphala · Lal Kitab", detail: "Independent calculation and interpretation methods.", state: "Planned module" },
  { group: "Western astrology", name: "Western & Hellenistic", detail: "Tropical charts, traditional techniques, progressions and returns.", state: "Planned module" },
  { group: "World astrology", name: "Mundane & world systems", detail: "Ingresses, national charts and distinct cultural systems.", state: "Planned module" },
  { group: "Divination & number systems", name: "Numerology", detail: "Pythagorean, Chaldean, Indian and Lo Shu methods.", state: "Planned module" },
  { group: "Divination & number systems", name: "Tarot & card systems", detail: "RWS, Thoth, Marseille, Lenormand, spreads and reading journals.", state: "Planned module" },
  { group: "Knowledge arts", name: "Palmistry · Vastu · I Ching", detail: "Separate knowledge areas with their own references and workflows.", state: "Planned module" },
];

const groups = [...new Set(systems.map((item) => item.group))];

function Field({ label, name, type = "text", value, onChange, required = true, step }: {
  label: string; name: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean; step?: string;
}) {
  return <label className="desk-field"><span>{label}</span><input name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} step={step} /></label>;
}

export default function AstrologersDeskPage() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [asOf, setAsOf] = useState("");
  const [place, setPlace] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_of_birth: dob,
          time_of_birth: tob.length === 5 ? `${tob}:00` : tob,
          latitude: Number(lat),
          longitude: Number(lon),
          timezone,
          place_name: place || null,
          as_of_date: asOf || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || "Analysis could not be completed. Check the birth details and try again.");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The analysis service is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  const bcp = result?.bcp;
  const bsp = result?.bsp;

  return <main className="desk-page">
    <div className="desk-topline"><span>॥ श्री गणेशाय नमः ॥</span><span>BHRIGUSETU / ASTROLOGER'S WORKSPACE</span><span>गणित · शास्त्र · अनुसन्धान</span></div>
    <header className="desk-header">
      <Link href="/" className="desk-brand"><span className="desk-seal">भृ</span><span><strong>BhriguSetu</strong><small>THE ASTROLOGER'S WORKSPACE</small></span></Link>
      <nav aria-label="Workspace navigation"><Link href="/">Home</Link><Link href="/calculator">Chart calculator</Link><Link href="/granthalaya">Granthalaya</Link><span className="desk-nav-current">Astrologer's desk</span></nav>
    </header>

    <section className="desk-hero">
      <div className="desk-hero-copy">
        <p className="desk-eyebrow"><i /> A WORKSPACE FOR THE PRACTICE OF JYOTISHA</p>
        <p className="desk-sanskrit">जन्म · गणना · विचार · प्रमाण</p>
        <h1>One desk.<br /><em>Many traditions.</em></h1>
        <p>Calculate a chart, examine a method, follow its source and keep each tradition's rules distinct. BhriguSetu is being built as a complete professional workspace — with transparent calculations and no invented predictions.</p>
        <div className="desk-hero-links"><a href="#birth-workspace" className="desk-primary">Open birth workspace <span>↗</span></a><Link href="/granthalaya" className="desk-secondary">Explore the library ↗</Link></div>
      </div>
      <div className="desk-hero-art" aria-label="Illustrated celestial instrument">
        <div className="desk-art-orbit orbit-a" /><div className="desk-art-orbit orbit-b" />
        <img src="/artwork/jyotisha-observatory.svg" alt="Celestial instrument with orbital rings" />
        <span className="desk-art-note note-a">27 NAKSHATRAS</span><span className="desk-art-note note-b">12 RASHIS</span><span className="desk-art-caption">OBSERVE · CALCULATE · VERIFY</span>
      </div>
    </section>

    <section className="desk-statline" aria-label="Platform principles"><span>Independent calculation engines</span><b>✳</b><span>Source-linked methods</span><b>✳</b><span>Reproducible results</span><b>✳</b><span>Clear evidence status</span></section>

    <section className="desk-section desk-workspace" id="birth-workspace">
      <div className="desk-section-heading"><div><p className="desk-eyebrow">01 / BIRTH DATA & METHOD</p><h2>Begin with the <em>birth chart.</em></h2></div><p>Enter local birth details and choose an analysis date. The current research endpoint calculates the running year and BCP/BSP research context; it does not generate a complete prediction.</p></div>
      <div className="desk-calculator-layout">
        <form className="desk-form" onSubmit={runAnalysis}>
          <div className="desk-form-head"><span>CHART INPUT</span><small>LOCAL CIVIL TIME · IANA TIMEZONE</small></div>
          <div className="desk-form-grid">
            <Field label="Date of birth" name="dob" type="date" value={dob} onChange={setDob} />
            <Field label="Time of birth" name="tob" type="time" value={tob} onChange={setTob} />
            <Field label="Birthplace (optional)" name="place" value={place} onChange={setPlace} required={false} />
            <Field label="Timezone" name="timezone" value={timezone} onChange={setTimezone} />
            <Field label="Latitude" name="latitude" type="number" step="any" value={lat} onChange={setLat} />
            <Field label="Longitude" name="longitude" type="number" step="any" value={lon} onChange={setLon} />
            <Field label="Analyse as of (optional)" name="asOf" type="date" value={asOf} onChange={setAsOf} required={false} />
          </div>
          <div className="desk-form-foot"><p>Coordinates and timezone must match the birthplace. This form does not silently infer or adjust them.</p><button type="submit" disabled={loading}>{loading ? "Calculating…" : "Calculate research context"} <span>→</span></button></div>
          {error && <p className="desk-error" role="alert">{error}</p>}
        </form>
        <aside className="desk-method-note"><span className="desk-note-mark">✳</span><p className="desk-eyebrow">CALCULATION POLICY</p><h3>Calculation is not prediction.</h3><p>Birth data, chart positions, running-year arithmetic and method-specific interpretation are separate layers. Every result must disclose its calculation basis and evidence status.</p><Link href="/calculator">Open detailed chart calculator ↗</Link></aside>
      </div>

      {result && <div className="desk-results" aria-live="polite">
        <div className="desk-results-heading"><div><p className="desk-eyebrow">CALCULATION RESULT</p><h3>Research context <em>ready.</em></h3></div><span className="desk-result-status">{result.status || "Calculated"}</span></div>
        <div className="desk-result-cards">
          <article className="desk-result-card"><small>RUNNING YEAR</small><strong>{result.running_year ?? "—"}</strong><span>Analysis date: {result.analysis_date || "—"}</span></article>
          <article className="desk-result-card" id="bcp"><small>BCP · ACTIVATED HOUSE</small><strong>{bcp?.activated_house ? `House ${bcp.activated_house}` : "—"}</strong><span>Cycle {bcp?.cycle ?? "—"} · {bcp?.interpretation_status || "Not available"}</span></article>
          <article className="desk-result-card" id="bsp"><small>BSP · RULE MATCHING</small><strong>{bsp?.enabled_rule_count ?? 0} enabled</strong><span>{bsp?.research_candidate_count ?? 0} research candidates · no predictions</span></article>
        </div>
        <div className="desk-result-detail">
          <section><h4>BCP calculation details</h4><p>{bcp?.message || "No BCP detail returned."}</p><dl><div><dt>Running year</dt><dd>{bcp?.running_year ?? "—"}</dd></div><div><dt>Activated house</dt><dd>{bcp?.activated_house ?? "—"}</dd></div><div><dt>Cycle</dt><dd>{bcp?.cycle ?? "—"}</dd></div><div><dt>Interpretation</dt><dd>Disabled pending rule verification</dd></div></dl></section>
          <section><h4>BSP research register</h4><p>{bsp?.message || "No BSP detail returned."}</p>{Array.isArray(bsp?.research_candidates) && bsp.research_candidates.length > 0 ? <ul>{bsp.research_candidates.map((rule: Analysis) => <li key={rule.id}><strong>{rule.id}</strong><span>{rule.statement}</span><small>{rule.source_author} · {rule.confidence}</small></li>)}</ul> : <p>No research candidates returned.</p>}</section>
        </div>
        {Array.isArray(result.warnings) && <div className="desk-warnings"><strong>Method and accuracy notes</strong>{result.warnings.map((warning: string, index: number) => <p key={index}>— {warning}</p>)}</div>}
      </div>}
    </section>

    <section className="desk-section desk-systems" id="systems">
      <div className="desk-section-heading"><div><p className="desk-eyebrow">02 / SYSTEMS & METHODS</p><h2>A library of <em>distinct systems.</em></h2></div><p>Every tradition gets its own calculation logic, terminology, source policy and interpretation workflow. A listing here is a roadmap, not a claim that the module is already implemented.</p></div>
      {groups.map((group) => <div className="desk-system-group" key={group}><h3>{group}</h3><div className="desk-system-grid">{systems.filter((item) => item.group === group).map((item) => <article className="desk-system-card" key={item.name}><div className="desk-system-top"><span>{item.group}</span><i>{item.state}</i></div><h4>{item.name}</h4><p>{item.detail}</p>{item.href ? <a href={item.href}>Open workspace ↗</a> : <span className="desk-system-soon">In the platform roadmap</span>}</article>)}</div></div>)}
    </section>

    <section className="desk-principles">
      <div><p className="desk-eyebrow">03 / HOW BHRIGUSETU WORKS</p><h2>Keep the method.<br /><em>Show the evidence.</em></h2></div>
      <div className="desk-principle-grid"><article><b>01</b><h3>Calculate</h3><p>Explicit birth data, astronomical settings, time conversion and reproducible chart outputs.</p></article><article><b>02</b><h3>Interpret</h3><p>Rules stay within their own school. A Parashari principle is not silently relabelled as a BCP or BSP rule.</p></article><article><b>03</b><h3>Validate</h3><p>Source location, worked examples, conflicting views and regression tests before a rule is enabled.</p></article></div>
    </section>

    <section className="desk-library-cta"><div><p className="desk-eyebrow">04 / GRAN THALAYA</p><h2>Knowledge without <em>lost sources.</em></h2><p>Study classical texts, modern teachers, research notes and method registers with attribution and evidence status kept visible.</p></div><Link href="/granthalaya">Enter Granthalaya ↗</Link></section>
    <footer className="desk-footer"><Link href="/">BhriguSetu</Link><span>Tradition with method. Research with attribution.</span><Link href="/calculator">Chart calculator ↗</Link></footer>
  </main>;
}
