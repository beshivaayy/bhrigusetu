"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {libraryItems,type LibraryItem} from "../../lib/granthalaya";

const kinds=["All","Classical text","Research note","Study path"] as const;
const traditions=["All traditions","Vedic Jyotisha","Jaimini Jyotisha","BCP (independent module)","BSP (independent module)"];

export default function GranthalayaPage(){
  const [q,setQ]=useState("");
  const [kind,setKind]=useState<(typeof kinds)[number]>("All");
  const [trad,setTrad]=useState("All traditions");
  const [selected,setSelected]=useState("bphs");
  const [language,setLanguage]=useState<"en"|"hi">("en");
  const en=language==="en";
  const results=useMemo(()=>{
    const term=q.trim().toLowerCase();
    return libraryItems.filter(x=>(kind==="All"||x.kind===kind)&&(trad==="All traditions"||x.tradition===trad)&&(!term||[x.title,x.latin,x.author,x.summary,x.tradition,...x.topics].join(" ").toLowerCase().includes(term)));
  },[q,kind,trad]);
  const item:LibraryItem|undefined=results.find(x=>x.id===selected)||results[0];
  const kindLabel=(k:string)=>en?({All:"All", "Classical text":"Classical texts","Research note":"Research notes","Study path":"Study paths"} as Record<string,string>)[k]:({All:"सभी","Classical text":"मूल ग्रन्थ","Research note":"अनुसन्धान","Study path":"अध्ययन-पथ"} as Record<string,string>)[k];
  const recordKind=(k:string)=>en?({ "Classical text":"Classical text","Research note":"Research note","Study path":"Study path"} as Record<string,string>)[k]:({ "Classical text":"शास्त्रीय ग्रन्थ","Research note":"अनुसन्धान","Study path":"अध्ययन-पथ"} as Record<string,string>)[k];
  return <main className="granthalaya-page" lang={language}>
    <header className="grantha-top">
      <Link href="/" className="grantha-brand"><span>भृ</span><strong>BhriguSetu</strong></Link>
      <nav><Link href="/">{en?"Home":"मुखपृष्ठ"}</Link><Link href="/calculator">{en?"Jyotisha calculator":"ज्योतिष गणना"}</Link><b>{en?"Granthalaya":"ग्रन्थालय"}</b><button type="button" className="grantha-language" onClick={()=>setLanguage(en?"hi":"en")}>{en?"हिन्दी":"English"}</button></nav>
    </header>
    <section className="grantha-hero"><img className="grantha-hero-art" src="/artwork/granthalaya-manuscript.svg" alt="Illustrated manuscript folios and classical study text" />
      <p>॥ {en?"SVADHYAYA · SHASTRA · PRAMANA":"स्वाध्याय · शास्त्र · प्रमाण"} ॥</p>
      <span>A PLACE FOR READING</span>
      <h1>{en?"Granthalaya":"ग्रन्थालय"}</h1>
      <h2>{en?"From classical texts to research.":"मूल ग्रन्थों से अनुसन्धान तक।"}</h2>
      <p className="grantha-intro">{en?"Look up a text, browse by tradition or follow a subject that interests you. Each entry includes the source details we have, along with notes where something still needs checking.":"ग्रन्थ, संस्करण, अनुवाद और शोध-सामग्री खोजें। Catalogue link को verified full text न समझें; हर record की source स्थिति स्पष्ट है।"}</p>
      
    </section>
    <section className="grantha-workspace">
      <div className="grantha-controls">
        <label className="grantha-search">{en?"Search":"खोजें"}<input value={q} onChange={e=>setQ(e.target.value)} placeholder={en?"Text, author, topic or tradition…":"ग्रन्थ, लेखक, विषय या परम्परा…"}/></label>
        <div className="grantha-filters">{kinds.map(k=><button key={k} className={kind===k?"active":""} onClick={()=>setKind(k)}>{kindLabel(k)}</button>)}</div>
        <label className="grantha-tradition">{en?"Tradition":"परम्परा"}<select value={trad} onChange={e=>setTrad(e.target.value)}>{traditions.map(t=><option key={t}>{t}</option>)}</select></label>
      </div>
      <div className="grantha-layout">
        <aside className="grantha-results">
          <div className="grantha-results-head"><span>THE COLLECTION</span><b>{results.length} {en?"results":"परिणाम"}</b></div>
          {results.map(x=><button key={x.id} className={item?.id===x.id?"selected":""} onClick={()=>setSelected(x.id)}><small>{recordKind(x.kind)}</small><strong>{x.title}</strong><span>{x.latin}</span><em>{x.author}</em></button>)}
          {!results.length&&<p className="grantha-empty">{en?"No records found. Try another search term.":"कोई अभिलेख नहीं मिला। खोज-शब्द बदलें।"}</p>}
        </aside>
        {item?<article className="grantha-detail">
          <div className="grantha-detail-top"><span>{item.tradition}</span><span>{recordKind(item.kind)}</span></div>
          <p className="grantha-detail-kicker">{en?"RECORD":"अभिलेख"} · {item.id.toUpperCase()}</p>
          <h2>{item.title}</h2><p className="grantha-translit">{item.latin}</p><p className="grantha-summary">{item.summary}</p>
          <div className="grantha-meta"><div><small>{en?"Author / attribution":"लेखक / attribution"}</small><b>{item.author}</b></div><div><small>{en?"Language":"भाषा"}</small><b>{item.language}</b></div><div><small>{en?"Period / edition":"काल / संस्करण"}</small><b>{item.era}</b></div></div>
          <div className="grantha-topics">{item.topics.map(t=><span key={t}>{t}</span>)}</div>
          <div className="grantha-source"><div><small>{en?"ABOUT THIS SOURCE":"स्रोत / अगला कदम"}</small><strong>{item.source}</strong><p>{item.note}</p></div><a href={item.url} target={item.url.startsWith("/")?"_self":"_blank"} rel="noreferrer">{en?(item.kind==="Research note"?"Open record":item.kind==="Study path"?"Open study workspace":"View catalogue"):(item.kind==="Research note"?"अभिलेख खोलें":item.kind==="Study path"?"कार्यस्थल खोलें":"Catalogue देखें")} ↗</a></div>
          <p className="grantha-caution">{en?"We include the source and edition details where they are known. If an author, date or reading is uncertain, the note will say so.":"संपादकीय नियम: किसी श्लोक या नियम को तभी उद्धृत करें जब exact edition, chapter/verse और translation दर्ज हो। जहाँ attribution या dating अनिश्चित हो, उसे अनिश्चित ही कहें।"}</p>
        </article>:<article className="grantha-detail grantha-empty-detail" role="status" aria-live="polite"><span className="grantha-empty-symbol" aria-hidden="true">✧</span><h2>{results.length===0?(en?"No matching records":"कोई मेल खाता अभिलेख नहीं"):(en?"Choose a catalogue record":"एक अभिलेख चुनें")}</h2><p>{results.length===0?(en?"Try another title, author, topic or tradition.":"दूसरा शीर्षक, लेखक, विषय या परम्परा खोजें। स्रोत-समीक्षा के साथ catalogue का विस्तार होगा।"):(en?"Select an entry from the catalogue to inspect its source and editorial notes.":"स्रोत और संपादकीय टिप्पणियाँ देखने के लिए catalogue से अभिलेख चुनें।")}</p><button type="button" onClick={()=>{setQ("");setKind("All");setTrad("All traditions");}}>{en?"Clear filters":"फ़िल्टर हटाएँ"}</button></article>}
      </div>
    </section>
    <section className="grantha-next"><div><span>{en?"WHAT COMES NEXT":"आगे की दिशा"}</span><h2>{en?<>Read. Compare.<br/><em>Trace the source.</em></>:<>पढ़ना। तुलना करना।<br/><em>स्रोत तक पहुँचना।</em></>}</h2></div><p>{en?"A good reading often leads to another. Follow the references, compare editions and let one text lead you to the next.":"यह प्रथम catalogue release है। अगली परत में edition-level metadata, chapter references, reading progress, bookmarks और reviewed articles जोड़े जाएँगे।"}</p><Link href="/calculator">{en?"Jyotisha workspace":"ज्योतिष कार्यक्षेत्र"} ↗</Link></section>
    <footer className="grantha-footer"><span>BhriguSetu · Granthalaya</span><span>{en?"Read closely. Follow the source.":"स्रोत स्पष्ट। मतभेद सुरक्षित।"}</span></footer>
  </main>;
}
