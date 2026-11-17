"use client";

import Link from "next/link";
import { useState } from "react";

const collections = [
  { id:"vedic", no:"०१", title:"वैदिक ज्योतिष", en:"Vedic Jyotisha", intro:"भारतीय ज्योतिष परम्परा — गणित, सिद्धान्त, फलित और काल-विचार।", items:["पराशरी ज्योतिष","जैमिनि ज्योतिष","षोडशवर्ग — D1 से D60","नक्षत्र और पाद","पञ्चाङ्ग एवं कालगणना","दशा और गोचर","अष्टकवर्ग एवं षड्बल","प्रश्न और मुहूर्त","ताजिक / वर्षफल","नाड़ी परम्पराएँ","भृगु नन्दी नाड़ी","BCP एवं BSP — स्वतंत्र अध्ययन"] },
  { id:"western", no:"०२", title:"पाश्चात्य ज्योतिष", en:"Western Astrology", intro:"Natal, traditional, modern and predictive schools in their own methodological context.", items:["Natal & Hellenistic","Traditional / Medieval","Modern psychological","Horary & Electional","Mundane astrology","Synastry & Composite","Progressions & Returns","Transits & Profections","Fixed stars & Asteroids"] },
  { id:"world", no:"०३", title:"विश्व ज्योतिष", en:"World Astrology", intro:"Distinct cultural systems, studied without blending their foundations.", items:["Chinese BaZi / Four Pillars","Zi Wei Dou Shu","Tibetan astrology","Persian & Arabic traditions","Uranian / Hamburg School","Mayan calendrical systems"] },
  { id:"numbers", no:"०४", title:"अंक विद्या", en:"Numerology", intro:"Number symbolism and calculation systems with clearly stated alphabets and reduction rules.", items:["Pythagorean","Chaldean","Vedic / Indian","Lo Shu Grid","Life Path & Destiny","Name & Business numbers","Personal cycles & compatibility"] },
  { id:"tarot", no:"०५", title:"टैरो एवं कार्ड पद्धतियाँ", en:"Tarot & Card Systems", intro:"Deck-specific symbolism, spreads, reading structures and reflective practice.", items:["Rider–Waite–Smith","Thoth Tarot","Marseille Tarot","Major & Minor Arcana","Lenormand","Oracle decks","Spreads & journaling"] },
  { id:"wisdom", no:"०६", title:"अन्य ज्ञान एवं प्रश्न पद्धतियाँ", en:"Other Wisdom Arts", intro:"A wider catalogue of traditional symbolic and contemplative disciplines.", items:["हस्त सामुद्रिक / Palmistry","सामुद्रिक शास्त्र","वास्तु शास्त्र","I Ching","Runes & Geomancy","स्वर शास्त्र","स्वप्न संकेत","शकुन एवं निमित्त"] },
];

const pathways = [
  { no:"01", title:"गणना", sub:"Calculate", text:"Chart mathematics, astronomical data, calendars and reproducible results.", href:"/calculator", action:"Open Jyotisha workspace" },
  { no:"02", title:"अध्ययन", sub:"Study", text:"Books, classical sources, articles, glossaries and guided learning paths.", href:"#library", action:"Explore the library" },
  { no:"03", title:"अनुसन्धान", sub:"Research", text:"Methods, source comparisons, citations, evidence and open questions.", href:"#research", action:"Research approach" },
  { no:"04", title:"संवाद", sub:"Understand", text:"Tradition-specific explanations and specialist AI assistants, introduced as each module is verified.", href:"#approach", action:"How it works" },
];

export default function Home() {
  const [active,setActive]=useState("vedic");
  const selected=collections.find(x=>x.id===active) || collections[0];
  return <main className="sanatan-home">
    <div className="heritage-strip"><span>॥ श्री गणेशाय नमः ॥</span><span>KNOWLEDGE · METHOD · PARAMPARĀ</span><span>EST. IN THE SPIRIT OF INQUIRY</span></div>
    <header className="sanatan-header">
      <Link href="/" className="sanatan-brand"><span className="brand-seal" aria-hidden="true"><span>भृ</span></span><span><strong>BhriguSetu</strong><small>ज्योतिष · ज्ञान · अनुसन्धान</small></span></Link>
      <nav className="sanatan-nav"><a href="#traditions">Traditions</a><a href="#library">Library</a><a href="#research">Research</a><Link href="/calculator" className="nav-cta">Jyotisha workspace <span>↗</span></Link></nav>
    </header>

    <section className="sanatan-hero">
      <div className="sanatan-hero-copy">
        <div className="sanskrit-kicker">विद्या · विचार · विवेक</div>
        <p className="eyebrow-line">A KNOWLEDGE PLATFORM ROOTED IN TRADITION</p>
        <h1>Explore the wisdom.<br/><em>Understand the method.</em></h1>
        <p className="hero-description">A growing home for Jyotisha, astrology, numerology, Tarot and the world's knowledge traditions — with their calculations, texts, histories and distinct ways of understanding.</p>
        <div className="hero-buttons"><Link href="/calculator" className="heritage-button">Enter Jyotisha <span>→</span></Link><a href="#traditions" className="text-link">Explore traditions <span>↓</span></a></div>
        <div className="hero-note"><span>स्वाध्याय</span><i/> <span>शास्त्र</span><i/> <span>अनुभव</span><i/> <span>प्रमाण</span></div>
      </div>
      <div className="yantra-panel" aria-label="Abstract geometric illustration inspired by traditional Indian diagrammatic design">
        <div className="yantra-frame frame-outer"/><div className="yantra-frame frame-middle"/><div className="yantra-frame frame-inner"/>
        <div className="yantra-square"><div className="yantra-diamond"><div className="yantra-circle"><span>श्री</span></div></div></div>
        <div className="yantra-card-caption"><span>परम्परा</span><i/> <span>पद्धति</span><i/> <span>अर्थ</span></div>
      </div>
    </section>

    <section className="heritage-band"><span>शास्त्राध्ययन</span><b>✦</b><span>गणित एवं काल</span><b>✦</b><span>परम्परा एवं पद्धति</span><b>✦</b><span>ज्ञान एवं अनुसन्धान</span></section>

    <section className="traditions-section" id="traditions">
      <div className="section-heading"><div><p className="eyebrow-line">THE KNOWLEDGE TRADITIONS</p><h2>Many paths of inquiry.<br/><em>Each in its own tradition.</em></h2></div><p>Every system deserves its own language, calculations, sources and interpretive framework. We do not collapse distinct traditions into one generic reading.</p></div>
      <div className="tradition-browser">
        <div className="tradition-tabs" role="tablist" aria-label="Knowledge traditions">{collections.map(c=><button key={c.id} role="tab" aria-selected={active===c.id} className={active===c.id?"active":""} onClick={()=>setActive(c.id)}><span>{c.no}</span><b>{c.title}</b><small>{c.en}</small></button>)}</div>
        <article className="tradition-content" role="tabpanel" key={selected.id}>
          <div className="tradition-content-head"><span>{selected.no} / COLLECTION</span><span>METHODS & DISCIPLINES</span></div>
          <h3>{selected.title}</h3><p className="tradition-english">{selected.en}</p><p className="tradition-intro">{selected.intro}</p>
          <div className="tradition-items">{selected.items.map((item,i)=><div key={item}><small>{String(i+1).padStart(2,"0")}</small>{item}</div>)}</div>
          <p className="catalogue-disclaimer">Catalogue and roadmap only where a module is not yet marked live. Each tradition will be released after method, source and calculation validation.</p>
        </article>
      </div>
    </section>

    <section className="pathways-section" id="approach"><div className="section-heading compact"><div><p className="eyebrow-line">A PLACE TO WORK AND LEARN</p><h2>From calculation<br/><em>to understanding.</em></h2></div><p>Tools, study and research belong together. Each has a clear place in the platform.</p></div>
      <div className="pathway-grid">{pathways.map(p=><article key={p.no}><span className="pathway-no">{p.no}</span><p>{p.sub}</p><h3>{p.title}</h3><div>{p.text}</div><a href={p.href}>{p.action} <span>↗</span></a></article>)}</div>
    </section>

    <section className="library-section" id="library"><div className="library-ornament">॥</div><div className="library-copy"><p className="eyebrow-line">ग्रन्थ · लेख · अध्ययन</p><h2>A library for<br/><em>lifelong learning.</em></h2><p>Read original BhriguSetu articles, explore classical texts and modern books, follow structured learning paths, and trace ideas back to their sources.</p><div className="library-tags"><span>Classical texts</span><span>Books & editions</span><span>Research papers</span><span>Blogs & explainers</span><span>Glossary</span><span>Learning paths</span></div></div><div className="library-side"><article><small>01 / READ</small><h3>Articles & blogs</h3><p>Concept guides, worked examples and critical explorations.</p></article><article><small>02 / DISCOVER</small><h3>Books & granthas</h3><p>Bibliographic records, editions, translations and authorised access.</p></article><article><small>03 / STUDY</small><h3>Learning paths</h3><p>Guided journeys from foundations to advanced study.</p></article></div></section>

    <section className="research-section" id="research"><div><p className="eyebrow-line">SOURCE BEFORE ASSERTION</p><h2>Respect the text.<br/><em>Show the reasoning.</em></h2></div><div className="research-principles"><p>Calculations, interpretations and AI explanations remain separate. We identify the source, edition, method and uncertainty behind a result — and preserve differences between schools instead of hiding them.</p><div><span>01</span> Traceable sources <span>02</span> Explicit methods <span>03</span> Honest limitations</div></div></section>

    <section className="sanatan-closing"><p>॥ शुभम् भवतु ॥</p><h2>Begin with a question.<br/><em>Continue with understanding.</em></h2><Link href="/calculator" className="heritage-button light">Open Jyotisha workspace <span>→</span></Link></section>
    <footer className="sanatan-footer"><Link href="/" className="sanatan-brand"><span className="brand-seal"><span>भृ</span></span><span><strong>BhriguSetu</strong><small>ज्योतिष · ज्ञान · अनुसन्धान</small></span></Link><p>Independent traditions. Transparent methods. A growing library.</p><span>© BhriguSetu</span></footer>
  </main>;
}
