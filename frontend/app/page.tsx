"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type PlaceResult = { place_id: number; display_name: string; latitude: number; longitude: number; timezone: string | null; timezone_candidates: string[] };
type Position = { sign?: string; longitude?: number };
type RecordValue = Record<string, any>;
type SectionKey = "chart" | "grahas" | "bhava" | "panchanga" | "yoga" | "strength" | "ashtakavarga" | "dasha" | "special";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const SIGN_ORDER = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const GRAHAS = ["Ascendant","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu","Uranus","Neptune","Pluto"];
const SECTIONS: { key: SectionKey; label: string }[] = [
  {key:"chart",label:"Varga charts"},{key:"grahas",label:"Graha positions"},{key:"bhava",label:"Bhava"},{key:"panchanga",label:"Panchanga"},
  {key:"yoga",label:"Yoga & Dosha"},{key:"strength",label:"Bala"},{key:"ashtakavarga",label:"Ashtakavarga"},{key:"dasha",label:"Dasha"},{key:"special",label:"Other calculations"}
];

function pretty(value: string) { return value.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase()); }
function degree(value: unknown) { const n=Number(value); return Number.isFinite(n) ? n.toFixed(4)+"°" : "—"; }
function signIndex(sign?: string) { return sign ? SIGN_ORDER.indexOf(sign) : -1; }
function houseFromSign(sign?: string, asc?: string) { const a=signIndex(asc), s=signIndex(sign); return a<0||s<0 ? "—" : ((s-a+12)%12)+1; }

function DataView({value,depth=0}:{value:any;depth?:number}) : ReactNode {
  if (value === null || value === undefined || value === "") return <span className="muted">—</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value === "number") return <span className="numeric">{Number.isInteger(value) ? value : value.toFixed(4)}</span>;
  if (typeof value === "string") return <span>{value}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return <span className="muted">—</span>;
    if (value.every(row => Array.isArray(row) && row.every((item:any) => item === null || ["string","number","boolean"].includes(typeof item)))) {
      const width=Math.max(...value.map((row:any[])=>row.length));
      return <div className="table-scroll"><table className="calc-table matrix-table"><thead><tr><th>#</th>{Array.from({length:width},(_,i)=><th key={i}>{i+1}</th>)}</tr></thead><tbody>{value.map((row:any[],i)=><tr key={i}><th>{i+1}</th>{Array.from({length:width},(_,j)=><td key={j}><DataView value={row[j]}/></td>)}</tr>)}</tbody></table></div>;
    }
    if (value.every(item => item === null || ["string","number","boolean"].includes(typeof item))) {
      return <div className="value-list">{value.map((item,i)=><span key={i}><DataView value={item} depth={depth+1}/></span>)}</div>;
    }
    return <div className="nested-list">{value.map((item,i)=><details key={i} className="data-detail"><summary>{Array.isArray(item) ? `Entry ${i+1}` : item && typeof item==="object" ? Object.values(item).slice(0,2).join(" · ") || `Entry ${i+1}` : `Entry ${i+1}`}</summary><DataView value={item} depth={depth+1}/></details>)}</div>;
  }
  if (typeof value === "object") {
    const entries=Object.entries(value);
    if (!entries.length) return <span className="muted">—</span>;
    if (depth >= 3) return <pre className="compact-json">{JSON.stringify(value,null,2)}</pre>;
    return <div className="data-grid">{entries.map(([key,item])=><div className="data-cell" key={key}><span className="data-label">{pretty(key)}</span><div className="data-value"><DataView value={item} depth={depth+1}/></div></div>)}</div>;
  }
  return <span>{String(value)}</span>;
}

function Table({rows,columns}:{rows:RecordValue[];columns:{key:string;label:string;render?:(v:any,row:RecordValue)=>ReactNode}[]}) {
  return <div className="table-scroll"><table className="calc-table"><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{columns.map(c=><td key={c.key}>{c.render ? c.render(row[c.key],row) : <DataView value={row[c.key]}/>}</td>)}</tr>)}</tbody></table></div>;
}

function ChartGrid({chart,asc,title}:{chart:RecordValue;asc?:string;title:string}) {
  const positions:Record<string,{row:number;col:number}> = {
    Aries:{row:1,col:1},Taurus:{row:1,col:2},Gemini:{row:1,col:3},Cancer:{row:1,col:4},
    Leo:{row:2,col:4},Virgo:{row:3,col:4},Libra:{row:4,col:4},Scorpio:{row:4,col:3},
    Sagittarius:{row:4,col:2},Capricorn:{row:4,col:1},Aquarius:{row:3,col:1},Pisces:{row:2,col:1}
  };
  const signs=useMemo(()=>SIGN_ORDER.map(sign=>({sign,house:houseFromSign(sign,asc),planets:Object.entries(chart||{}).filter(([name,p]:[string,any])=>name!=="Ascendant"&&p?.sign===sign)})),[chart,asc]);
  return <div className="rashi-grid">{signs.map(item=><article className="rashi-cell" style={{gridRow:positions[item.sign].row,gridColumn:positions[item.sign].col}} key={item.sign}><span className="rashi-house">House {item.house}</span><strong>{item.sign}</strong><div>{item.planets.length ? item.planets.map(([name,p]:[string,any])=><span className="graha-chip" key={name}>{name} <small>{degree(p.longitude)}</small></span>) : <span className="muted">—</span>}</div></article>)}<div className="chart-center"><span className="overline">{title}</span><strong>{asc||"—"}</strong><small>Lagna</small></div></div>;
}

export default function Home() {
  const [dob,setDob]=useState(""); const [tob,setTob]=useState(""); const [place,setPlace]=useState("");
  const [placeResults,setPlaceResults]=useState<PlaceResult[]>([]); const [selectedPlaceId,setSelectedPlaceId]=useState("");
  const [lat,setLat]=useState(""); const [lon,setLon]=useState(""); const [tz,setTz]=useState("Asia/Kolkata");
  const [timezoneOptions,setTimezoneOptions]=useState<string[]>([]); const [timeFold,setTimeFold]=useState("");
  const [ayanamsha,setAyanamsha]=useState("LAHIRI"); const [customAyanamsha,setCustomAyanamsha]=useState("");
  const [node,setNode]=useState("mean"); const [calcMethod,setCalcMethod]=useState("drik"); const [bhava,setBhava]=useState("5");
  const [timezoneMode,setTimezoneMode]=useState("file"); const [language,setLanguage]=useState("en");
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [placeError,setPlaceError]=useState("");
  const [result,setResult]=useState<RecordValue|null>(null); const [activeSection,setActiveSection]=useState<SectionKey>("chart");
  const [selectedVarga,setSelectedVarga]=useState("D-1_rasi"); const [showSettings,setShowSettings]=useState(false);

  async function searchPlace() {
    if(place.trim().length<3){setPlaceError("Enter at least 3 characters.");return;}
    setPlaceError("");
    try {
      const response=await fetch(`${API_BASE}/api/places/search?q=${encodeURIComponent(place.trim())}`);
      const payload=await response.json();
      if(!response.ok) throw new Error(payload.detail||"Place search unavailable.");
      setPlaceResults(payload.results||[]);
      if(!payload.results?.length) setPlaceError("No matching places found.");
    } catch(e) { setPlaceError(e instanceof Error?e.message:"Unable to search place."); }
  }
  function choosePlace(id:string) {
    setSelectedPlaceId(id); const p=placeResults.find(x=>String(x.place_id)===id); if(!p)return;
    setPlace(p.display_name);setLat(String(p.latitude));setLon(String(p.longitude));setTz(p.timezone||"");
    setTimezoneOptions(p.timezone_candidates||[]);
  }
  async function calculate(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setLoading(true);setError("");setResult(null);
    try {
      const response=await fetch(`${API_BASE}/api/chart/jhora`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        date_of_birth:dob,time_of_birth:tob.length===5?`${tob}:00`:tob,time_fold:timeFold===""?null:Number(timeFold),
        place_name:place||null,latitude:Number(lat),longitude:Number(lon),timezone:tz,
        ayanamsa_mode:ayanamsha,ayanamsa_value:ayanamsha==="SIDM_USER"?Number(customAyanamsha):null,
        node_type:node,calculation_type:calcMethod,bhava_madhya_method:Number(bhava),timezone_mode:timezoneMode,language
      })});
      const payload=await response.json();
      if(!response.ok){const d=typeof payload.detail==="string"?payload.detail:payload.detail?.message||JSON.stringify(payload.detail);throw new Error(d||"Calculation failed.");}
      setResult(payload);setActiveSection("chart");setSelectedVarga("D-1_rasi");
    } catch(e) {setError(e instanceof Error?e.message:"Calculation failed.");}
    finally {setLoading(false);}
  }

  const horoscope=result?.result?.horoscope||{};
  const divisions=horoscope.divisional_charts||{};
  const divisionKeys=Object.keys(divisions);
  const selectedChart=divisions[selectedVarga]||{};
  const asc=selectedChart?.Ascendant?.sign||divisions["D-1_rasi"]?.Ascendant?.sign;
  const d1=divisions["D-1_rasi"]||{};
  const planetRows=GRAHAS.filter(name=>d1[name]).map(name=>({graha:name==="Ascendant"?"Lagna":name,...d1[name],house:houseFromSign(d1[name].sign,d1.Ascendant?.sign)}));
  const sectionData:Record<Exclude<SectionKey,"chart"|"grahas">,RecordValue> = {
    bhava:{ "Bhava chart":horoscope.bhava_chart,"House relationships":horoscope.house_relationships,"House relationships by Varga":horoscope.house_relationships_by_varga,"Bhava bala":horoscope.bhava_bala,"House varnadas":horoscope.house_varnadas },
    panchanga:{"Calendar":horoscope.calendar_info,"Nakshatra & Pada":horoscope.nakshatra_pada,"Amsa rulers":horoscope.amsa_rulers},
    yoga:{"Yogas":horoscope.yogas,"Doshas":horoscope.doshas},
    strength:{"Shad bala":horoscope.shad_bala,"Required Shad bala":horoscope.shad_bala_required,"Bhava bala":horoscope.bhava_bala,"Other bala":horoscope.other_bala,"Vimsopaka bala":horoscope.vimsopaka_bala,"Vaiseshikamsa bala":horoscope.vaiseshikamsa_bala,"Planetary states":horoscope.planetary_states},
    ashtakavarga:{"Ashtakavarga":horoscope.ashtakavarga},
    dasha:{"Graha dashas":horoscope.graha_dashas,"Rasi dashas":horoscope.rasi_dashas,"Saturn transits":horoscope.saturn_transits},
    special:{"Chara karakas":horoscope.chara_karakas,"Upagrahas":horoscope.upagrahas,"Special lagnas":horoscope.special_lagnas,"Graha arudhas":horoscope.graha_arudhas,"Surya arudhas":horoscope.surya_arudhas,"Chandra arudhas":horoscope.chandra_arudhas,"Arudha padas":horoscope.arudha_padhas,"Sphutas":horoscope.sphuta,"Sahams":horoscope.sahams,"Shashtiamsa rulers":horoscope.shashtiamsa_rulers,"Graha relationships":horoscope.house_relationships}
  };

  return <main className="app-shell">
    <header className="app-header">
      <a className="app-brand" href="/"><span className="brand-symbol">ॐ</span><span><strong>BhriguSetu</strong><small>JYOTISH SOFTWARE</small></span></a>
      <div className="header-right"><span className="header-label">HOROSCOPE WORKSPACE</span><span className="header-dot"/></div>
    </header>

    <section className="input-panel">
      <div className="panel-title"><div><span className="overline">NEW HOROSCOPE</span><h1>Birth details</h1></div><button type="button" className="settings-toggle" onClick={()=>setShowSettings(v=>!v)}>{showSettings?"Hide settings":"Calculation settings"} <span>{showSettings?"−":"＋"}</span></button></div>
      <form className="birth-form" onSubmit={calculate}>
        <label>Date of birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)} required/></label>
        <label>Time of birth<input type="time" step="1" value={tob} onChange={e=>setTob(e.target.value)} required/></label>
        <label className="place-field">Birth place<div className="place-row"><input value={place} onChange={e=>{setPlace(e.target.value);setPlaceResults([]);setSelectedPlaceId("");setLat("");setLon("");setTz("");}} placeholder="City, State, Country" required/><button type="button" onClick={searchPlace} className="outline-button">Search</button></div></label>
        {placeResults.length>0&&<label className="place-field">Select location<select value={selectedPlaceId} onChange={e=>choosePlace(e.target.value)}><option value="">Select a matching place</option>{placeResults.map(p=><option key={p.place_id} value={String(p.place_id)}>{p.display_name} · {p.timezone}</option>)}</select></label>}
        {placeError&&<p className="inline-error place-field">{placeError}</p>}
        <label>Latitude<input type="number" step="any" value={lat} onChange={e=>setLat(e.target.value)} required/></label>
        <label>Longitude<input type="number" step="any" value={lon} onChange={e=>setLon(e.target.value)} required/></label>
        <label>Timezone<select value={tz} onChange={e=>setTz(e.target.value)} required>{tz&&!timezoneOptions.includes(tz)&&<option value={tz}>{tz}</option>}{(timezoneOptions.length?timezoneOptions:["Asia/Kolkata","UTC","Europe/London","America/New_York"]).map(z=><option key={z} value={z}>{z}</option>)}</select></label>
        <label>Repeated local time<select value={timeFold} onChange={e=>setTimeFold(e.target.value)}><option value="">Not specified</option><option value="0">Earlier occurrence</option><option value="1">Later occurrence</option></select></label>
        {showSettings&&<div className="settings-grid place-field">
          <label>Ayanamsha<select value={ayanamsha} onChange={e=>setAyanamsha(e.target.value)}>{["LAHIRI","TRUE_CITRA","TRUE_LAHIRI","KP","FAGAN","RAMAN","USHASHASHI","YUKTESHWAR","SURYASIDDHANTA","SURYASIDDHANTA_MSUN","ARYABHATA","ARYABHATA_MSUN","SS_CITRA","TRUE_REVATI","SS_REVATI","TRUE_PUSHYA","TRUE_MULA","KP-SENTHIL","SENTHIL","SIDM_USER"].map(v=><option key={v} value={v}>{v.replaceAll("_"," ")}</option>)}</select></label>
          {ayanamsha==="SIDM_USER"&&<label>Custom ayanamsha °<input type="number" step="any" value={customAyanamsha} onChange={e=>setCustomAyanamsha(e.target.value)} required/></label>}
          <label>Nodes<select value={node} onChange={e=>setNode(e.target.value)}><option value="mean">Mean node</option><option value="true">True node</option></select></label>
          <label>Calculation method<select value={calcMethod} onChange={e=>setCalcMethod(e.target.value)}><option value="drik">Drik</option><option value="ss">Surya Siddhanta</option></select></label>
          <label>Bhava method<select value={bhava} onChange={e=>setBhava(e.target.value)}><option value="1">Equal · Lagna middle</option><option value="2">Equal · Lagna start</option><option value="3">Sripati</option><option value="4">KP / Placidus</option><option value="5">Whole Sign</option></select></label>
          <label>Timezone calculation<select value={timezoneMode} onChange={e=>setTimezoneMode(e.target.value)}><option value="file">Resolved timezone</option><option value="auto">Automatic historical lookup</option></select></label>
          <label>Language<select value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="ka">Kannada</option><option value="ta">Tamil</option><option value="te">Telugu</option></select></label>
        </div>}
        <button className="calculate-button" disabled={loading||!dob||!tob||!place||!lat||!lon||!tz}>{loading?"Calculating horoscope…":"Calculate horoscope"} <span>→</span></button>
      </form>
      {error&&<p className="inline-error">{error}</p>}
    </section>

    {result&&<section className="horoscope-workspace">
      <div className="chart-heading"><div><span className="overline">HOROSCOPE</span><h2>{place.split(",")[0]} <small>{dob} · {tob}</small></h2></div><div className="chart-summary"><span>Ayanamsha <b>{degree(horoscope.ayanamsa_value)}</b></span></div></div>
      <nav className="section-tabs" aria-label="Calculation sections">{SECTIONS.map(s=><button key={s.key} className={activeSection===s.key?"active":""} onClick={()=>setActiveSection(s.key)}>{s.label}</button>)}</nav>

      {activeSection==="chart"&&<div className="section-content">
        <div className="subheading"><div><span className="overline">DIVISIONAL CHARTS</span><h3>{pretty(selectedVarga)}</h3></div><select className="varga-select" value={selectedVarga} onChange={e=>setSelectedVarga(e.target.value)}>{divisionKeys.map(k=><option key={k} value={k}>{pretty(k)}</option>)}</select></div>
        <ChartGrid chart={selectedChart} asc={asc} title={selectedVarga.split("_")[0]}/>
        <Table rows={GRAHAS.filter(name=>selectedChart[name]).map(name=>({graha:name==="Ascendant"?"Lagna":name,sign:selectedChart[name].sign,longitude:selectedChart[name].longitude,house:houseFromSign(selectedChart[name].sign,asc)}))} columns={[
          {key:"graha",label:"Graha"},{key:"sign",label:"Rashi"},{key:"longitude",label:"Degree",render:v=>degree(v)},{key:"house",label:"House"}
        ]}/>
        <div className="varga-shortcuts">{divisionKeys.map(k=><button key={k} className={selectedVarga===k?"selected":""} onClick={()=>setSelectedVarga(k)}>{k.split("_")[0]}</button>)}</div>
      </div>}

      {activeSection==="grahas"&&<div className="section-content"><div className="subheading"><div><span className="overline">D1 · RASHI</span><h3>Planetary positions</h3></div></div>
        <Table rows={planetRows} columns={[
          {key:"graha",label:"Graha"},{key:"sign",label:"Rashi"},{key:"longitude",label:"Longitude",render:v=>degree(v)},{key:"house",label:"House"},
        ]}/>
        <div className="data-panels"><DataPanel title="Nakshatra & Pada" value={horoscope.nakshatra_pada}/><DataPanel title="Planetary states" value={horoscope.planetary_states}/><DataPanel title="Chara Karakas" value={horoscope.chara_karakas}/></div>
      </div>}

      {activeSection!=="chart"&&activeSection!=="grahas"&&<div className="section-content">
        {Object.entries(sectionData[activeSection]).filter(([,v])=>v!==undefined&&v!==null).map(([title,value])=><DataPanel key={title} title={title} value={value}/>)}
      </div>}
      <div className="birth-summary"><span>{result.result?.birth_details?.date||dob} · {result.result?.birth_details?.time||tob}</span><span>{lat}, {lon} · {tz}</span></div>
    </section>}
    <footer className="app-footer"><span>BhriguSetu</span><span>Jyotish calculation workspace</span><small>Place search © OpenStreetMap contributors</small></footer>
  </main>;
}

function DataPanel({title,value}:{title:string;value:any}) {
  return <section className="data-panel"><h3>{title}</h3><DataView value={value}/></section>;
}
