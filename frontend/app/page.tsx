"use client";

import Link from "next/link";
import "./landing.css";

const available = [
  {
    number: "01",
    title: "Bhrigu Chakra Paddhati",
    description: "Birth-data validation, running-year arithmetic and house activation, with method steps kept visible.",
    status: "Available",
  },
  {
    number: "02",
    title: "Bhrigu Saral Paddhati",
    description: "A source-linked research catalogue and Kakshya utility. Unverified predictive rules remain disabled.",
    status: "Research stage",
  },
  {
    number: "03",
    title: "Jyotish calculation workspace",
    description: "Varga charts, graha positions, bhava, Panchanga, yoga, bala, Ashtakavarga, dasha and other provider outputs.",
    status: "Available",
  },
  {
    number: "04",
    title: "Chart import & MCP",
    description: "Map supplied sidereal longitudes and access supported calculations through the MCP interface.",
    status: "Available",
  },
];

const roadmap = ["Western astrology", "World astrology", "Numerology", "Tarot", "Other divination systems"];

export default function Home() {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <Link href="/" className="landing-brand" aria-label="BhriguSetu home">
          <span className="landing-mark">ॐ</span>
          <span><strong>BhriguSetu</strong><small>JYOTISH RESEARCH &amp; CALCULATION</small></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#method">Methodology</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <Link href="/jyotish" className="landing-nav-cta">Open workspace <span>↗</span></Link>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="landing-eyebrow"><span /> A RESEARCH-FIRST JYOTISH PLATFORM</div>
          <h1>Tradition deserves <em>precision.</em></h1>
          <p className="hero-lede">A disciplined workspace for classical Jyotish study, transparent calculations and source-led research.</p>
          <p className="hero-detail">BhriguSetu brings Bhrigu Chakra Paddhati, Bhrigu Saral Paddhati and chart calculations into one place—without confusing a calculation with an interpretation, or an interpretation with verified evidence.</p>
          <div className="hero-actions">
            <Link href="/jyotish" className="primary-action">Enter Jyotish workspace <span>→</span></Link>
            <a href="#platform" className="secondary-action">Explore the platform <span>↓</span></a>
          </div>
          <div className="hero-principles"><span>Transparent methods</span><i /> <span>Traceable sources</span><i /> <span>Explicit limitations</span></div>
        </div>
        <aside className="hero-aside">
          <div className="aside-topline"><span>CALCULATION INTEGRITY</span><span>01 / 03</span></div>
          <div className="mandala-mark" aria-hidden="true"><span>ॐ</span></div>
          <h2>Show the method.<br />Respect the source.</h2>
          <p>Every supported calculation should disclose its inputs, settings, provider and known limitations.</p>
          <div className="aside-rule" />
          <div className="provider-row"><span className="provider-dot" /><span>JHora public REST provider</span><b>Available</b></div>
          <div className="provider-row"><span className="provider-dot muted-dot" /><span>In-repository chart engine</span><b>Approximate</b></div>
          <small className="aside-note">Desktop JHora parity is not claimed.</small>
        </aside>
      </section>

      <section className="landing-statement">
        <span className="statement-index">THE PRINCIPLE</span>
        <p>A calculation is not an interpretation. An interpretation is not a source. A source is not automatically a verified rule.</p>
      </section>

      <section className="platform-section" id="platform">
        <div className="section-intro">
          <div><span className="landing-eyebrow">THE PLATFORM</span><h2>What is available today</h2></div>
          <p>Built in layers so each method can be inspected, tested and improved without overstating what the software knows.</p>
        </div>
        <div className="capability-grid">
          {available.map((item) => (
            <article className="capability-card" key={item.number}>
              <div className="capability-top"><span>{item.number}</span><b>{item.status}</b></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.number === "03" && <Link href="/jyotish" className="card-link">Open calculation workspace <span>↗</span></Link>}
            </article>
          ))}
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="method-heading"><span className="landing-eyebrow">RESEARCH STANDARD</span><h2>Evidence before prediction.</h2></div>
        <div className="method-columns">
          <article><span>01</span><h3>Classical sources</h3><p>Texts such as Brihat Parashara Hora Shastra, Phaladeepika, Laghu Parashari and Jaimini Sutras are recorded as a distinct evidence layer.</p></article>
          <article><span>02</span><h3>Modern teaching</h3><p>BCP and BSP teaching is attributed to its source. Different teachers’ methods are not silently merged into one generic rule.</p></article>
          <article><span>03</span><h3>Verification</h3><p>Rules need traceable references, preconditions, worked examples, conflict review and regression tests before predictive use.</p></article>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div><span className="landing-eyebrow">LONG-TERM SCOPE</span><h2>A wider field of study.</h2><p>These traditions are part of the planned platform scope. They are not presented as implemented features today.</p></div>
        <div className="roadmap-list">{roadmap.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><small>Planned</small></div>)}</div>
      </section>

      <footer className="landing-footer">
        <Link href="/" className="footer-brand"><span>ॐ</span><strong>BhriguSetu</strong></Link>
        <p>Traditional knowledge. Transparent implementation. Honest boundaries.</p>
        <Link href="/jyotish">Enter workspace ↗</Link>
      </footer>
    </main>
  );
}
