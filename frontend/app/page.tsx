"use client";

import { FormEvent, useState } from "react";

type PlaceResult = { place_id: number; display_name: string; latitude: number; longitude: number; timezone: string | null; timezone_candidates: string[] };

type ChartPosition = {
  longitude: number;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  nakshatra: string;
  pada: number;
  whole_sign_house: number;
  motion: string;
  daily_motion_deg?: number;
  navamsa: { sign: string; sign_index: number; degree_in_sign: number; segment: number };
};

type Chart = {
  status: string;
  birth_datetime_local: string;
  birth_datetime_utc: string;
  julian_day_ut: number;
  ayanamsha: { name: string; value_degrees: number; model: string };
  ephemeris: { provider: string; accuracy_claim: string; coordinate_frame: string; node: string };
  house_system: string;
  lagna: ChartPosition;
  planets: Record<string, ChartPosition>;
  houses: { house: number; sign: string; planets: string[] }[];
  divisional_charts: {
    D9: {
      lagna: { sign: string; sign_index: number; degree_in_sign: number; segment: number };
      planets: Record<string, { sign: string; sign_index: number; degree_in_sign: number; whole_sign_house: number }>;
    };
  };
  warnings: string[];
};

type Analysis = {
  status: string;
  analysis_date: string;
  running_year: number;
  birth_details: { birth_datetime_local: string; birth_datetime_utc: string; utc_offset: string; timezone: string; latitude: number; longitude: number; place_name: string | null };
  bcp: {
    status: string;
    activated_house: number;
    cycle: number;
    chakra_swami: string | null;
    chakra_swami_status: string;
    interpretation_status: string;
    reference_basis: string;
    cycle_ruler_reference_status: string;
    cycle_ruler_reference_note: string;
    message: string;
  };
  bsp: { status: string; triggered_rules: unknown[]; enabled_rule_count: number; research_candidate_count: number; research_candidates: { id: string; statement: string; source_title: string; source_url: string; confidence: string; status: string }[]; message: string };
  chart: Chart;
  warnings: string[];
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export default function Home() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false);
  const [placeSearchError, setPlaceSearchError] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [tz, setTz] = useState("Asia/Kolkata");
  const [timezoneOptions, setTimezoneOptions] = useState<string[]>([]);
  const [timeFold, setTimeFold] = useState("");
  const [asOf, setAsOf] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jhoraAyanamsha, setJhoraAyanamsha] = useState("LAHIRI");
  const [jhoraAyanamshaValue, setJhoraAyanamshaValue] = useState("");
  const [jhoraNode, setJhoraNode] = useState("mean");
  const [jhoraCalculation, setJhoraCalculation] = useState("drik");
  const [jhoraBhava, setJhoraBhava] = useState("5");
  const [jhoraTimezoneMode, setJhoraTimezoneMode] = useState("file");
  const [jhoraLanguage, setJhoraLanguage] = useState("en");
  const [jhoraResult, setJhoraResult] = useState<any>(null);
  const [jhoraLoading, setJhoraLoading] = useState(false);
  const [jhoraError, setJhoraError] = useState("");

  async function searchPlace() {
    if (place.trim().length < 3) {
      setPlaceSearchError("Enter at least 3 characters.");
      return;
    }
    setPlaceSearchLoading(true);
    setPlaceSearchError("");
    setPlaceResults([]);
    setSelectedPlaceId("");
    try {
      const response = await fetch(`${API_BASE}/api/places/search?q=${encodeURIComponent(place.trim())}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || "Birthplace search is temporarily unavailable.");
      setPlaceResults(payload.results as PlaceResult[]);
      if (!payload.results?.length) setPlaceSearchError("No matching places found. Try adding the district, state or country.");
    } catch (err) {
      setPlaceSearchError(err instanceof Error ? err.message : "Unable to search for this birthplace.");
    } finally {
      setPlaceSearchLoading(false);
    }
  }

  function choosePlace(placeId: string) {
    setSelectedPlaceId(placeId);
    const selected = placeResults.find(item => String(item.place_id) === placeId);
    if (!selected) return;
    setPlace(selected.display_name);
    setLat(String(selected.latitude));
    setLon(String(selected.longitude));
    setTimezoneOptions(selected.timezone_candidates || []);
    setTz(selected.timezone || "");
  }

  async function submitJhora(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJhoraLoading(true);
    setJhoraError("");
    setJhoraResult(null);
    try {
      const response = await fetch(`${API_BASE}/api/chart/jhora`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_of_birth: dob,
          time_of_birth: tob.length === 5 ? `${tob}:00` : tob,
          time_fold: timeFold === "" ? null : Number(timeFold),
          place_name: place || null,
          latitude: Number(lat),
          longitude: Number(lon),
          timezone: tz,
          ayanamsa_mode: jhoraAyanamsha,
          ayanamsa_value: jhoraAyanamsha === "SIDM_USER" ? Number(jhoraAyanamshaValue) : null,
          node_type: jhoraNode,
          calculation_type: jhoraCalculation,
          bhava_madhya_method: Number(jhoraBhava),
          timezone_mode: jhoraTimezoneMode,
          language: jhoraLanguage,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const detail = typeof payload.detail === "string" ? payload.detail : payload.detail?.message || JSON.stringify(payload.detail);
        throw new Error(detail || "Jagannatha Hora provider returned an error.");
      }
      setJhoraResult(payload);
    } catch (err) {
      setJhoraError(err instanceof Error ? err.message : "Unable to reach the Jagannatha Hora public API.");
    } finally {
      setJhoraLoading(false);
    }
  }

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
          time_fold: timeFold === "" ? null : Number(timeFold),
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
          <label className="full">Birthplace name *<div className="place-search"><input type="text" value={place} onChange={e => { setPlace(e.target.value); setPlaceResults([]); setSelectedPlaceId(""); setLat(""); setLon(""); setTz(""); setTimezoneOptions([]); setPlaceSearchError(""); }} placeholder="e.g. Maheshwar, Madhya Pradesh" required /><button type="button" className="search-button" onClick={searchPlace} disabled={placeSearchLoading}>{placeSearchLoading ? "Searching…" : "Find birthplace"}</button></div></label>
          {placeResults.length > 0 && <label className="full">Select matching location<select value={selectedPlaceId} onChange={e => choosePlace(e.target.value)}><option value="">Choose a result</option>{placeResults.map(item => <option key={item.place_id} value={String(item.place_id)}>{item.display_name} — {item.timezone || "Timezone not found"}</option>)}</select></label>}
          {placeSearchError && <p className="form-hint full" role="status">{placeSearchError}</p>}
          <p className="attribution full">Your place query is sent to OpenStreetMap Nominatim. Results © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>. One-shot search only; no autocomplete.</p>
          <label>Latitude *<input type="number" step="any" min="-90" max="90" value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 22.17" required /></label>
          <label>Longitude *<input type="number" step="any" min="-180" max="180" value={lon} onChange={e => setLon(e.target.value)} placeholder="e.g. 75.58" required /></label>
          {timezoneOptions.length > 1 ? <label>Choose timezone at this border *<select value={tz} onChange={e => setTz(e.target.value)} required><option value="">Select timezone</option>{timezoneOptions.map(zone => <option key={zone} value={zone}>{zone}</option>)}</select></label> : <label>Timezone (IANA) *<input value={tz} onChange={e => setTz(e.target.value)} placeholder="Asia/Kolkata" required /></label>}
          <label>Repeated local time (DST only)<select value={timeFold} onChange={e => setTimeFold(e.target.value)}><option value="">Not applicable / unknown</option><option value="0">Earlier occurrence (fold 0)</option><option value="1">Later occurrence (fold 1)</option></select></label>
          <label>Analyse for date<input type="date" value={asOf} onChange={e => setAsOf(e.target.value)} /></label>
          <p className="form-hint full">Leave “Analyse for date” empty to use today in the selected timezone. Coordinates are required; birthplace text alone is not used for astronomical calculations. If a timezone repeats a clock time during a DST change, select the earlier or later occurrence. The detected timezone can be edited if needed.</p>
          <button className="submit full" disabled={loading}>{loading ? "Calculating…" : "Calculate natal chart + BCP activation + BSP status"} <span>→</span></button>
        </form>
        {error && <div className="error" role="alert">{error}</div>}
        <div className="chart-section">
          <div className="section-heading"><div><p className="eyebrow">JAGANNATHA HORA PUBLIC API</p><h2>Reference chart provider</h2></div><span className="status-pill">Separate provider</span></div>
          <p className="form-hint">Uses the independent public REST API, not the desktop JHora application. Birth details above are reused. Unsupported settings are rejected; no approximate-engine fallback is applied.</p>
          <form onSubmit={submitJhora}>
            <label className="full">Ayanamsha<select value={jhoraAyanamsha} onChange={e => setJhoraAyanamsha(e.target.value)}>
              {["LAHIRI","TRUE_CITRA","TRUE_LAHIRI","KP","FAGAN","RAMAN","USHASHASHI","YUKTESHWAR","SURYASIDDHANTA","SURYASIDDHANTA_MSUN","ARYABHATA","ARYABHATA_MSUN","SS_CITRA","TRUE_REVATI","SS_REVATI","TRUE_PUSHYA","TRUE_MULA","KP-SENTHIL","SENTHIL","SIDM_USER"].map(mode => <option key={mode} value={mode}>{mode}</option>)}
            </select></label>
            {jhoraAyanamsha === "SIDM_USER" && <label>Custom ayanamsha (degrees) *<input type="number" min="-30" max="30" step="any" value={jhoraAyanamshaValue} onChange={e => setJhoraAyanamshaValue(e.target.value)} required /></label>}
            <label>Lunar node<select value={jhoraNode} onChange={e => setJhoraNode(e.target.value)}><option value="mean">Mean Node</option><option value="true">True Node</option></select></label>
            <label>Calculation method<select value={jhoraCalculation} onChange={e => setJhoraCalculation(e.target.value)}><option value="drik">Drik</option><option value="ss">Surya Siddhanta</option></select></label>
            <label>Bhava Madhya method<select value={jhoraBhava} onChange={e => setJhoraBhava(e.target.value)}><option value="1">Equal — Lagna at middle</option><option value="2">Equal — Lagna at start</option><option value="3">Sripati</option><option value="4">KP / Placidus</option><option value="5">Whole Sign</option></select></label>
            <label>Timezone handling<select value={jhoraTimezoneMode} onChange={e => setJhoraTimezoneMode(e.target.value)}><option value="file">Use resolved IANA offset</option><option value="auto">Provider historical lookup</option></select></label>
            <label>Response language<select value={jhoraLanguage} onChange={e => setJhoraLanguage(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="ka">Kannada</option><option value="ta">Tamil</option><option value="te">Telugu</option></select></label>
            <p className="form-hint full">The selected settings are sent explicitly. The provider's engine revision and any applied-setting notes are retained in the response.</p>
            <button className="submit full" disabled={jhoraLoading || !dob || !tob || !lat || !lon || !tz}>{jhoraLoading ? "Requesting JHora chart…" : "Calculate with JHora public API"} <span>→</span></button>
          </form>
          {jhoraError && <div className="error" role="alert">{jhoraError}</div>}
          {jhoraResult && <div className="notice chart-method">
            <strong>Provider response received</strong>
            <p>{jhoraResult.provider} · Engine revision: {jhoraResult.engine_revision ?? "not supplied"}</p>
            <p>Desktop-JHora parity: not established. This is public API output only.</p>
            <p>Provider: independent Jagannatha Hora REST API. The returned D1/D9 positions below are provider output, not desktop-JHora validation.</p>
            {([
              { key: "D-1_rasi", label: "D1 · Rashi" },
              { key: "D-9_navamsa", label: "D9 · Navamsa" },
            ] as const).map(({ key, label }) => {
              const chart = jhoraResult.result?.horoscope?.divisional_charts?.[key];
              if (!chart) return null;
              const grahas = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              const available = grahas.filter(name => chart[name]);
              return <div className="chart-table-wrap" key={key}>
                <h3>{label} · provider positions</h3>
                <table className="chart-table">
                  <thead><tr><th>Graha</th><th>Rashi</th><th>Longitude within sign</th></tr></thead>
                  <tbody>{available.map(name => {
                    const position = chart[name];
                    const longitude = Number(position.longitude);
                    return <tr key={name}>
                      <td>{name === "Ascendant" ? "Lagna" : name}</td>
                      <td>{position.sign || "—"}</td>
                      <td>{Number.isFinite(longitude) ? `${longitude.toFixed(4)}°` : "—"}</td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>;
            })}
            {jhoraResult.request_notes && <p>Provider notes: {JSON.stringify(jhoraResult.request_notes)}</p>}
            <details><summary>Calculation receipt</summary><pre>{JSON.stringify({requested_settings:jhoraResult.requested_settings,applied_settings:jhoraResult.applied_settings,timezone_used:jhoraResult.timezone_used,timezone_source:jhoraResult.timezone_source,ayanamsa_value:jhoraResult.ayanamsa_value}, null, 2)}</pre></details>
          </div>}
        </div>
      </section>

      {result && <section className="results" aria-live="polite">
        <div className="section-heading"><div><p className="eyebrow">02 / ENGINE OUTPUT</p><h2>Calculation report</h2></div><span className="status-pill">Partial calculation</span></div>
        <div className="notice"><strong>Resolved birth instant</strong><p>Local: {result.birth_details.birth_datetime_local} ({result.birth_details.timezone})</p><p>UTC: {result.birth_details.birth_datetime_utc}</p><p>Coordinates: {result.birth_details.latitude}, {result.birth_details.longitude}</p></div>
        <div className="metric-grid">
          <article className="metric"><span>Running year</span><strong>{result.running_year}</strong><small>As of {result.analysis_date}</small></article>
          <article className="metric"><span>BCP activated house</span><strong>{result.bcp.activated_house}</strong><small>House activation only</small></article>
          <article className="metric"><span>BCP cycle</span><strong>{result.bcp.cycle}</strong><small>{result.bcp.chakra_swami ? `Provisional swami: ${result.bcp.chakra_swami}` : "Swami not defined"}</small></article>
        </div>
        <div className="report-row"><div><p className="eyebrow">BCP</p><h3>House activation calculated</h3><p>{result.bcp.message}</p><small>Chakra-swami status: {result.bcp.chakra_swami_status.replaceAll("_", " ")}</small><small>Reference basis: {result.bcp.reference_basis.replaceAll("_", " ")}.</small><small>Cycle-ruler reference: {result.bcp.cycle_ruler_reference_status.replaceAll("_", " ")}. {result.bcp.cycle_ruler_reference_note}</small></div><span className="status-pill">Provisional</span></div>
        <div className="report-row"><div><p className="eyebrow">BSP</p><h3>Rule evaluation not enabled</h3><p>{result.bsp.message}</p><small>Enabled rules: {result.bsp.enabled_rule_count} · Research candidates: {result.bsp.research_candidate_count}</small>{result.bsp.research_candidates.map(rule => <div className="candidate" key={rule.id}><strong>{rule.id}</strong><p>{rule.statement}</p><small>{rule.confidence}</small><p><a href={rule.source_url} target="_blank" rel="noreferrer">{rule.source_title}</a></p><small>Disabled pending verification</small></div>)}</div><span className="status-pill muted">Research pending</span></div>
        <div className="chart-section">
          <div className="section-heading"><div><p className="eyebrow">NATAL CHART</p><h2>D1 · Rashi</h2></div><span className="status-pill">Calculated · approximate model</span></div>
          <div className="chart-overview">
            <article><span>Ascendant</span><strong>{result.chart.lagna.sign}</strong><small>{result.chart.lagna.degree_in_sign.toFixed(2)}° · {result.chart.lagna.nakshatra} Pada {result.chart.lagna.pada}</small></article>
            <article><span>D9 Ascendant</span><strong>{result.chart.divisional_charts.D9.lagna.sign}</strong><small>{result.chart.divisional_charts.D9.lagna.degree_in_sign.toFixed(2)}°</small></article>
            <article><span>Lahiri ayanamsha</span><strong>{result.chart.ayanamsha.value_degrees.toFixed(5)}°</strong><small>{result.chart.ayanamsha.name} · approximate</small></article>
          </div>
          <div className="chart-table-wrap">
            <h3>Planetary positions · D1</h3>
            <table className="chart-table">
              <thead><tr><th>Graha</th><th>Rashi</th><th>Degree</th><th>Nakshatra</th><th>House</th><th>Motion</th></tr></thead>
              <tbody>{Object.entries(result.chart.planets).map(([name, planet]) => <tr key={name}><td>{name}</td><td>{planet.sign}</td><td>{planet.degree_in_sign.toFixed(2)}°</td><td>{planet.nakshatra} · {planet.pada}</td><td>{planet.whole_sign_house}</td><td>{planet.motion === "mean_node" ? "Mean node" : planet.motion}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="chart-table-wrap">
            <h3>D9 · Navamsa</h3>
            <table className="chart-table">
              <thead><tr><th>Graha</th><th>Navamsa rashi</th><th>Degree</th><th>House</th></tr></thead>
              <tbody><tr><td>Lagna</td><td>{result.chart.divisional_charts.D9.lagna.sign}</td><td>{result.chart.divisional_charts.D9.lagna.degree_in_sign.toFixed(2)}°</td><td>1</td></tr>{Object.entries(result.chart.divisional_charts.D9.planets).map(([name, planet]) => <tr key={name}><td>{name}</td><td>{planet.sign}</td><td>{planet.degree_in_sign.toFixed(2)}°</td><td>{planet.whole_sign_house}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="house-grid">
            {result.chart.houses.map(house => <article key={house.house}><span>House {house.house}</span><strong>{house.sign}</strong><small>{house.planets.length ? house.planets.join(" · ") : "—"}</small></article>)}
          </div>
          <div className="notice chart-method"><strong>Calculation method</strong><p>{result.chart.ephemeris.provider} · {result.chart.house_system} houses · {result.chart.ephemeris.node}.</p><p>{result.chart.ephemeris.accuracy_claim}. Birth UTC: {result.chart.birth_datetime_utc} · JD(UT): {result.chart.julian_day_ut}</p></div>
          <div className="warnings"><strong>Chart-specific accuracy notes</strong><ul>{result.chart.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div>
        </div>
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
