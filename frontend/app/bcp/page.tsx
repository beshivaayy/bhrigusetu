"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "../methods.css";

type Result = Record<string, any>;
const API = "/backend-api";

export default function BcpWorkspace() {
  const [dob,setDob]=useState("");
  const [tob,setTob]=useState("");
  const [lat,setLat]=useState("");
  const [lon,setLon]=useState("");
  const [timezone,setTimezone]=useState("Asia/Kolkata");
  const [place,setPlace]=useState("");
  const [asOf,setAsOf]=useState("");
  const [result,setResult]=useState<Result|null>(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function calculate(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setResult(null);
    try {
      const response=await fetch(`${API}/api/analyze`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          date_of_birth:dob,time_of_birth:tob.length===5?`${tob}:00`:tob,
          latitude:Number(lat),longitude:Number(lon),timezone,place_name:place||null,
          as_of_date:asOf||null
        })
      });
      const payload=await response.json();
      if(!response.ok) throw new Error(payload?.detail||"BCP calculation could not be completed.");
      setResult(payload);
    } catch(e) { setError(e instanceof Error?e.message:"The calculation service is unavailable."); }
    finally { setLoading(false); }
  }

  const bcp=result?.bcp;
  const chart=result?.chart;
  const current=Number(bcp?.running_year||result?.running_year||0);
  const timeline=Array.from({length:7},(_,i)=>current-2+i).filter(year=>year>0).map(year=>({year,house:((year-1)%12)+1,cycle:Math.floor((year-1)/12)+1}));

  return <main className="method-page">
    <div className="method-topline"><span>॥ श्री गणेशाय नमः ॥</span><span>BHRIGUSETU / BHRIGU CHAKRA PADDHATI</span><span>गणित · स्रोत · परीक्षण</span></div>
    <header className="method-header"><Link href="/" className="method-brand"><span className="method-seal">भृ</span><span><strong>BhriguSetu</strong><small>THE ASTROLOGER'S WORKSPACE</small></span></Link><nav><Link href="/desk">Astrologer's desk</Link><Link href="/bsp">BSP workspace</Link><Link href="/calculator">Chart calculator</Link><Link href="/granthalaya">Granthalaya</Link></nav></header>
    <section className="method-hero"><div><p className="method-eyebrow">01 / BHRIGU TRADITIONS · WORKING MODULE</p><p className="method-sanskrit">भृगु चक्र पद्धति</p><h1>Bhrigu Chakra<br/><em>Paddhati.</em></h1><p>Calculate the running year and its corresponding 12-house activation from the entered birth date. Inspect the natal chart context and the calculation basis — without presenting unverified interpretations as established rules.</p><div className="method-hero-tags"><span>Running year</span><span>12-house rotation</span><span>Source-gated interpretation</span></div></div><div className="method-hero-mark"><div className="method-orbit"></div><strong>१२</strong><span>HOUSE CYCLE</span><small>१ → १२ → १</small></div></section>
    <section className="method-body">
      <div className="method-heading"><div><p className="method-eyebrow">02 / BIRTH DETAILS</p><h2>Calculate the <em>active year.</em></h2></div><p>Birth time and location are used for the chart context. The running-year and house-rotation calculation is date-based and uses the local calendar date in the selected timezone.</p></div>
      <div className="method-columns">
        <form className="method-form" onSubmit={calculate}>
          <div className="method-form-title"><strong>Birth data</strong><span>LOCAL CIVIL TIME · IANA TIMEZONE</span></div>
          <div className="method-fields">
            <label>Date of birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)} required/></label>
            <label>Time of birth<input type="time" value={tob} onChange={e=>setTob(e.target.value)} required/></label>
            <label>Birthplace<input value={place} onChange={e=>setPlace(e.target.value)} placeholder="City, region (optional)"/></label>
            <label>Timezone<input value={timezone} onChange={e=>setTimezone(e.target.value)} required/></label>
            <label>Latitude<input type="number" step="any" value={lat} onChange={e=>setLat(e.target.value)} required/></label>
            <label>Longitude<input type="number" step="any" value={lon} onChange={e=>setLon(e.target.value)} required/></label>
            <label>Analyse as of<input type="date" value={asOf} onChange={e=>setAsOf(e.target.value)}/></label>
          </div>
          <button className="method-submit" disabled={loading}>{loading?"Calculating…":"Calculate BCP running year"} <span>→</span></button>
          {error&&<p className="method-error" role="alert">{error}</p>}
        </form>
        <aside className="method-explainer"><span className="method-star">✳</span><p className="method-eyebrow">CALCULATION CONVENTION</p><h3>One year at a time.</h3><p>Running year = completed years + 1. The next running year begins on the local-calendar anniversary of birth. The 12-house activation rotates from the natal Lagna reference.</p><div className="method-formula">House = ((Year − 1) mod 12) + 1</div><p className="method-small">For a 29 February birth in a non-leap year, this implementation uses 1 March as the anniversary. This is an explicit software convention, not a universal statement about every BCP school.</p></aside>
      </div>

      {result&&<div className="method-results" aria-live="polite">
        <div className="method-results-head"><div><p className="method-eyebrow">03 / CALCULATION OUTPUT</p><h2>Running year <em>{current}</em></h2></div><span className="method-status">{result.methodology_status||result.status}</span></div>
        <div className="method-metrics">
          <article><small>RUNNING YEAR</small><strong>{current}</strong><span>Analysis date · {result.analysis_date}</span></article>
          <article><small>ACTIVATED HOUSE</small><strong>{bcp?.activated_house? `House ${bcp.activated_house}`:"—"}</strong><span>12-house rotation</span></article>
          <article><small>ROTATION CYCLE</small><strong>{bcp?.cycle??"—"}</strong><span>Cycle count from running year</span></article>
          <article><small>NATAL LAGNA</small><strong>{chart?.lagna?.sign||"—"}</strong><span>Approximate Lahiri model</span></article>
        </div>
        <section className="method-timeline"><div className="method-subhead"><h3>Year activation sequence</h3><span>Arithmetic reference · not prediction</span></div><div className="method-year-strip">{timeline.map(item=><article key={item.year} className={item.year===current?"is-current":""}><small>YEAR {item.year}</small><strong>H{item.house}</strong><span>Cycle {item.cycle}</span></article>)}</div></section>
        <div className="method-details">
          <section><h3>Calculation record</h3><dl><div><dt>Running year</dt><dd>{current}</dd></div><div><dt>Activated house</dt><dd>{bcp?.activated_house??"—"}</dd></div><div><dt>Formula</dt><dd>{bcp?.formula?.activated_house||"((year − 1) mod 12) + 1"}</dd></div><div><dt>Reference basis</dt><dd>{bcp?.reference_basis||"Natal Lagna only"}</dd></div><div><dt>Interpretation</dt><dd>Not enabled · pending source verification</dd></div></dl></section>
          <section><h3>Cycle reference status</h3><p>{bcp?.cycle_ruler_reference_note||"Additional cycle-ruler reference is not calculated."}</p><p className="method-small">Chakra-swami labels are treated as a secondary extension until the primary BCP source basis is confirmed.</p><dl><div><dt>Chakra-swami label</dt><dd>{bcp?.chakra_swami||"Not assigned"}</dd></div><div><dt>Evidence status</dt><dd>{bcp?.chakra_swami_status||"Not verified"}</dd></div></dl></section>
        </div>
        <section className="method-warning"><strong>Important methodology limits</strong>{(result.warnings||[]).map((warning:string,i:number)=><p key={i}>— {warning}</p>)}</section>
      </div>}
    </section>
    <footer className="method-footer"><Link href="/desk">← Back to Astrologer's Desk</Link><span>BCP calculation foundation · interpretation remains source-gated</span></footer>
  </main>;
}
