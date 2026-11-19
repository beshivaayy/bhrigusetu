"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import "../methods.css";

type Result=Record<string,any>;
const API="/backend-api";

export default function BspWorkspace() {
  const [catalog,setCatalog]=useState<Result|null>(null);
  const [loadError,setLoadError]=useState("");
  const [degree,setDegree]=useState("27.25");
  const [kakshya,setKakshya]=useState<Result|null>(null);
  const [first,setFirst]=useState("27.2333");
  const [second,setSecond]=useState("27.8333");
  const [same,setSame]=useState<Result|null>(null);
  const [utilityError,setUtilityError]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{let live=true;(async()=>{try{const response=await fetch(`${API}/api/bsp/catalog`);const payload=await response.json();if(!response.ok)throw new Error(payload?.detail||"BSP register is unavailable.");if(live)setCatalog(payload);}catch(e){if(live)setLoadError(e instanceof Error?e.message:"BSP register is unavailable.");}})();return()=>{live=false;};},[]);

  async function lookupKakshya(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setUtilityError("");setKakshya(null);
    try{const response=await fetch(`${API}/api/bsp/kakshya?degree_in_sign=${encodeURIComponent(degree)}`);const payload=await response.json();if(!response.ok)throw new Error(payload?.detail||"Kakshya lookup failed.");setKakshya(payload);}
    catch(e){setUtilityError(e instanceof Error?e.message:"Kakshya lookup failed.");}finally{setBusy(false);}
  }

  async function compareDegrees(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setUtilityError("");setSame(null);
    try{const params=new URLSearchParams({first_degree:first,second_degree:second});const response=await fetch(`${API}/api/bsp/same-degree?${params}`);const payload=await response.json();if(!response.ok)throw new Error(payload?.detail||"Degree comparison failed.");setSame(payload);}
    catch(e){setUtilityError(e instanceof Error?e.message:"Degree comparison failed.");}finally{setBusy(false);}
  }

  const rules=catalog?.rules||[];
  const slots=catalog?.kakshya?.slots||[];

  return <main className="method-page">
    <div className="method-topline"><span>॥ श्री गणेशाय नमः ॥</span><span>BHRIGUSETU / BHRIGU SARAL PADDHATI</span><span>स्रोत · नियम · परीक्षण</span></div>
    <header className="method-header"><Link href="/" className="method-brand"><span className="method-seal">भृ</span><span><strong>BhriguSetu</strong><small>THE ASTROLOGER'S WORKSPACE</small></span></Link><nav><Link href="/desk">Astrologer's desk</Link><Link href="/bcp">BCP workspace</Link><Link href="/calculator">Chart calculator</Link><Link href="/granthalaya">Granthalaya</Link></nav></header>
    <section className="method-hero"><div><p className="method-eyebrow">02 / BHRIGU TRADITIONS · RESEARCH MODULE</p><p className="method-sanskrit">भृगु सरल पद्धति</p><h1>Bhrigu Saral<br/><em>Paddhati.</em></h1><p>Explore the source-controlled BSP rule register and use the currently implemented deterministic utilities. Each rule retains its source, preconditions, worked examples, confidence and validation limitations.</p><div className="method-hero-tags"><span>Source-linked rules</span><span>Kakshya lookup</span><span>Evidence register</span></div></div><div className="method-hero-mark"><div className="method-orbit"></div><strong>८</strong><span>KAKSHYA SLOTS</span><small>३°४५′ EACH</small></div></section>
    <section className="method-body">
      <div className="method-heading"><div><p className="method-eyebrow">01 / DETERMINISTIC UTILITIES</p><h2>Use the <em>Kakshya tools.</em></h2></div><p>These utilities implement source-transcribed degree conventions only. They do not activate a prediction, interpret a planet's significations or establish a BSP rule as validated.</p></div>
      <div className="method-tool-grid">
        <form className="method-tool" onSubmit={lookupKakshya}><p className="method-eyebrow">KAKSHYA SLOT LOOKUP</p><h3>Degree within a sign</h3><label>Degree · 0° to below 30°<input type="number" min="0" max="29.999999" step="any" value={degree} onChange={e=>setDegree(e.target.value)} required/></label><button className="method-submit" disabled={busy}>Find Kakshya lord →</button>{kakshya&&<div className="method-tool-result"><small>SLOT {kakshya.index}</small><strong>{kakshya.lord}</strong><span>{kakshya.start_degree}° — {kakshya.end_degree}°</span><p>{kakshya.boundary_policy}</p></div>}</form>
        <form className="method-tool" onSubmit={compareDegrees}><p className="method-eyebrow">BSP-7 DEGREE CONVENTION</p><h3>Compare whole degrees</h3><label>First planet degree<input type="number" min="0" max="29.999999" step="any" value={first} onChange={e=>setFirst(e.target.value)} required/></label><label>Second planet degree<input type="number" min="0" max="29.999999" step="any" value={second} onChange={e=>setSecond(e.target.value)} required/></label><button className="method-submit" disabled={busy}>Compare degree numbers →</button>{same&&<div className="method-tool-result"><small>COMPARISON RESULT</small><strong>{same.same_degree_number?"Same whole degree":"Different whole degrees"}</strong><span>{same.first_degree}° · {same.second_degree}°</span><p>Integer-degree comparison, not exact longitude equality.</p></div>}</form>
      </div>
      {utilityError&&<p className="method-error" role="alert">{utilityError}</p>}
      <section className="method-register"><div className="method-subhead"><div><p className="method-eyebrow">02 / SOURCE-CONTROLLED REGISTER</p><h2>Research rules <em>and evidence.</em></h2></div><span className="method-status">{catalog?.status||"Loading register"}</span></div>
        {loadError&&<p className="method-error">{loadError}</p>}
        {catalog&&<div className="method-register-summary"><strong>{catalog.total_rules} candidate rules</strong><span>{catalog.enabled_rules} enabled for production matching</span><p>{catalog.policy}</p></div>}
        <div className="method-rule-list">{rules.map((rule:Result)=><article className="method-rule" key={rule.id}><div className="method-rule-head"><span>{rule.id}</span><i>{rule.verified&&rule.enabled?"Verified · enabled":"Research candidate · disabled"}</i></div><h3>{rule.statement}</h3><p className="method-rule-source">{rule.source_author} · <em>{rule.source_title}</em></p><p>{rule.source_location}</p><p className="method-rule-confidence">{rule.confidence}</p><details><summary>Preconditions, calculation & validation notes</summary><div className="method-rule-detail"><div><strong>Preconditions</strong><pre>{JSON.stringify(rule.preconditions,null,2)}</pre></div><div><strong>Trigger</strong><pre>{JSON.stringify(rule.trigger,null,2)}</pre></div><div><strong>Calculation</strong><pre>{JSON.stringify(rule.calculation,null,2)}</pre></div><div><strong>Worked examples & limitations</strong><pre>{JSON.stringify(rule.validation_case,null,2)}</pre></div></div></details><a href={rule.source_url} target="_blank" rel="noreferrer">Open cited source ↗</a></article>)}</div>
      </section>
      <section className="method-kakshya"><div className="method-subhead"><h3>Eight Kakshya divisions</h3><span>3°45′ · start inclusive, end exclusive</span></div><div className="method-kakshya-grid">{slots.map((slot:Result)=><article key={slot.index}><small>{slot.start_degree}° — {slot.end_degree}°</small><strong>{slot.lord}</strong><span>Slot {slot.index}</span></article>)}</div></section>
    </section>
    <footer className="method-footer"><Link href="/desk">← Back to Astrologer's Desk</Link><span>BSP research foundation · no production predictions enabled</span></footer>
  </main>;
}
