"use client";

import Link from "next/link";
import { useState } from "react";

const collections = [
  { id:"vedic", number:"01", title:"Vedic & Jyotish", intro:"Classical Indian astrology, chart mathematics and predictive traditions.", items:["Parashari Jyotish","Jaimini astrology","Bhrigu Nandi Nadi","Nadi astrology","KP / Krishnamurti Paddhati","Tajika / Varshaphala","Bhrigu Chakra Paddhati","Bhrigu Saral Paddhati","Prashna / Horary Jyotish","Muhurta / Electional","Ashtakavarga & Shadbala","Varga & divisional charts"] },
  { id:"western", number:"02", title:"Western astrology", intro:"Traditional and modern approaches to natal, predictive and relationship astrology.", items:["Natal astrology","Hellenistic astrology","Traditional / Medieval","Modern psychological","Horary astrology","Electional astrology","Mundane astrology","Synastry & composite","Secondary progressions","Solar & lunar returns","Transits & profections","Asteroids & fixed stars"] },
  { id:"world", number:"03", title:"World astrology", intro:"Explore distinct astronomical and astrological traditions across cultures.", items:["Chinese BaZi / Four Pillars","Chinese Zi Wei Dou Shu","Tibetan astrology","Mayan calendar systems","Persian & Arabic astrology","Uranian / Hamburg School","Vedic-compatible regional systems"] },
  { id:"tarot", number:"04", title:"Tarot & card systems", intro:"Symbolic card traditions for reflection, spreads and interpretive readings.", items:["Rider–Waite–Smith Tarot","Thoth Tarot","Marseille Tarot","Major & Minor Arcana","Lenormand","Oracle card systems","Tarot spreads & journaling"] },
  { id:"numbers", number:"05", title:"Numerology", intro:"Number-based systems, name analysis and date-derived cycles.", items:["Pythagorean numerology","Chaldean numerology","Vedic / Indian numerology","Lo Shu grid","Life path & destiny numbers","Name & business numerology","Personal year & cycles"] },
  { id:"wisdom", number:"06", title:"Other divination & wisdom arts", intro:"A wider library of symbolic, traditional and contemplative disciplines.", items:["Palmistry / Hasta Samudrika","Face reading / Samudrika","Vastu Shastra","I Ching","Runes","Geomancy","Dream symbolism","Swar Shastra","Anga Lakshana","Traditional omens (Shakuna)"] },
];

const pillars = [
  {n:"01",title:"Calculate",body:"Precise chart construction, astronomical positions, divisional charts, strengths, periods and derived calculations."},
  {n:"02",title:"Interpret",body:"Traditional rules, schools of thought, structured readings and clearly separated interpretive frameworks."},
  {n:"03",title:"Research",body:"Classical source references, shlokas, calculation notes, comparative methods and evidence-aware study."},
  {n:"04",title:"Explore",body:"A growing library of astrology, numerology, Tarot and other traditional knowledge systems."},
];

export default function Home() {
  const [active,setActive]=useState("vedic");
  const selected=collections.find(x=>x.id===active) || collections[0];
  return <main className="landing-shell">
    <header className="landing-header">
      <Link className="landing-brand" href="/"><span className="landing-mark">ॐ</span><span><strong>BhriguSetu</strong><small>THE KNOWLEDGE OF COSMIC SYSTEMS</small></span></Link>
      <nav className="landing-nav"><a href="#universe">Explore</a><a href="#approach">Our approach</a><Link href="/calculator" className="nav-workspace">Open workspace <span>↗</span></Link></nav>
    </header>

    <section className="landing-hero">
      <div className="hero-copy">
        <span className="landing-eyebrow"><i/> A UNIFIED KNOWLEDGE PLATFORM</span>
        <h1>Many traditions.<br/><em>One place to explore.</em></h1>
        <p className="hero-lede">From Jyotish and Western astrology to Tarot, Numerology and the world’s divination traditions — discover the systems, study their foundations and work with their methods.</p>
        <div className="hero-actions"><Link href="/calculator" className="primary-cta">Enter Jyotish workspace <span>→</span></Link><a href="#universe" className="secondary-cta">Explore the knowledge library <span>↓</span></a></div>
        <div className="hero-footnote"><span>ASTROLOGY</span><b>·</b><span>DIVINATION</span><b>·</b><span>NUMEROLOGY</span><b>·</b><span>TRADITIONAL WISDOM</span></div>
      </div>
      <div className="hero-art" aria-label="Celestial astronomical illustration">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
        <div className="sun-disc"><span>ॐ</span></div><span className="orbit-point point-one">✦</span><span className="orbit-point point-two">✧</span><span className="orbit-point point-three">✦</span>
        <div className="art-caption"><span>THE CELESTIAL ATLAS</span><small>Tradition · Method · Meaning</small></div>
      </div>
    </section>

    <section className="landing-ribbon"><span>VEDIC & CLASSICAL ROOTS</span><i>✦</i><span>GLOBAL ASTROLOGICAL SYSTEMS</span><i>✦</i><span>SYMBOLIC ARTS</span><i>✦</i><span>RESEARCH & PRACTICE</span></section>

    <section className="universe-section" id="universe">
      <div className="section-intro"><div><span className="landing-eyebrow">THE KNOWLEDGE UNIVERSE</span><h2>Explore every tradition.<br/><em>Understand its own language.</em></h2></div><p>A growing, organised library — not one blended system. Each discipline keeps its own terminology, methods, calculations and interpretive context.</p></div>
      <div className="universe-layout">
        <div className="universe-menu">{collections.map(c=><button key={c.id} className={active===c.id?"chosen":""} onClick={()=>setActive(c.id)}><span>{c.number}</span><strong>{c.title}</strong><b>↗</b></button>)}</div>
        <article className="universe-detail" key={selected.id}>
          <div className="detail-top"><span>COLLECTION {selected.number}</span><span>KNOWLEDGE LIBRARY</span></div>
          <h3>{selected.title}</h3><p>{selected.intro}</p>
          <div className="discipline-list">{selected.items.map((item,i)=><div key={item}><span>{String(i+1).padStart(2,"0")}</span>{item}</div>)}</div>
          <div className="detail-note">Organised as independent systems — each with its own roadmap and standards.</div>
        </article>
      </div>
    </section>

    <section className="workspace-band">
      <div><span className="landing-eyebrow">BUILT FOR SERIOUS STUDY</span><h2>From birth chart<br/><em>to deeper understanding.</em></h2><p>Start with the Jyotish calculation workspace. Dedicated workspaces for the wider knowledge library will be developed as independent modules.</p><Link href="/calculator" className="primary-cta">Open Jyotish workspace <span>→</span></Link></div>
      <div className="workspace-stat"><strong>12+</strong><span>Varga families & calculation areas</span><i/><strong>6</strong><span>Major knowledge collections</span><i/><strong>∞</strong><span>Room to expand, without mixing traditions</span></div>
    </section>

    <section className="approach-section" id="approach"><div className="section-intro"><div><span className="landing-eyebrow">THE BHRIGUSETU APPROACH</span><h2>Respect the source.<br/><em>Make the method usable.</em></h2></div><p>Knowledge deserves structure. We keep calculation, interpretation and research distinct so that every result can be understood in its proper context.</p></div>
      <div className="pillar-grid">{pillars.map(p=><article key={p.n}><span>{p.n}</span><h3>{p.title}</h3><p>{p.body}</p></article>)}</div>
    </section>

    <section className="closing-cta"><span className="landing-eyebrow">BEGIN WITH THE CHART</span><h2>A clearer way to work<br/>with Jyotish.</h2><Link href="/calculator" className="primary-cta">Launch calculation workspace <span>→</span></Link></section>

    <footer className="landing-footer"><Link className="landing-brand" href="/"><span className="landing-mark">ॐ</span><span><strong>BhriguSetu</strong><small>THE KNOWLEDGE OF COSMIC SYSTEMS</small></span></Link><span>Independent traditions. Structured knowledge.</span><span>© BhriguSetu</span></footer>
  </main>;
}
