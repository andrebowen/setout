const STAR = '<svg class="star" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2l2.9 7.1h7.4l-6 4.6 2.3 7.3L12 16.8 5.4 21.2l2.3-7.3-6-4.6h7.4z"/></svg>';
const STAR_OFF = '<svg class="star off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3.4l2.4 5.15 5.65.68-4.16 3.96 1.12 5.58L12 16.4l-5.01 2.77 1.12-5.58L3.95 9.23l5.65-.68L12 3.4z"/></svg>';
const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L19 7"/></svg>';

const SLUG = {
  square: "check-square",
  stairs: "stairs",
  decking: "decking",
  framing: "wall-framing",
  balustrade: "balustrade",
  corrugated: "corrugated",
  pitch: "pitch",
  concrete: "concrete",
  brickwork: "brickwork",
  fencing: "fencing",
  volume: "site-volume",
  flooring: "flooring",
  tiling: "tiling",
  paint: "paint",
  plasterboard: "plasterboard",
  spacing: "equal-spacing",
  slope: "slope",
  arc: "arc-setout",
  levelling: "levelling",
  triangle: "triangle",
  mitre: "mitre-angle",
  cutlist: "cut-list"
};

const WASTE_NOTES = {
  0: "None",
  5: "Smooth site and formwork",
  10: "Standard site",
  15: "Rough ground"
};

const UNIT_LABEL = {
  m: "m",
  mm: "mm",
  "%": "%",
  deg: "°",
  count: "qty",
  m2: "m²",
  m3: "m³",
  L: "L",
  kg: "kg"
};

const DEFAULT_PINS = ["square", "stairs", "decking", "spacing"];

function loadPins(){
  try {
    const raw = JSON.parse(localStorage.getItem("setout-v2-pins") || "null");
    if (Array.isArray(raw)) return new Set(raw.filter(id => SLUG[id]));
  } catch (err) { /* keep defaults */ }
  return new Set(DEFAULT_PINS);
}

function savePins(){
  try {
    localStorage.setItem("setout-v2-pins", JSON.stringify(Object.keys(CALCS).filter(id => CALCS[id].kit)));
  } catch (err) { /* private mode */ }
}

const PINNED = loadPins();
const CALCS = {};
const CATS = (typeof SetoutCalc !== "undefined" && SetoutCalc.categories)
  ? SetoutCalc.categories.slice()
  : ["Carpentry", "Roofing", "Wet trades", "Site", "Fit-out", "Setout & Measuring"];

for (const [id, slug] of Object.entries(SLUG)){
  const live = typeof SetoutCalc !== "undefined" ? SetoutCalc.getCalculator(slug) : null;
  CALCS[id] = {
    name: live ? live.name : id,
    cat: live ? live.category : "Setout & Measuring",
    short: live ? live.short : "",
    kit: PINNED.has(id),
    slug
  };
}

const jobs = [
  { id: "north-stairs", name: "72 North Creek Road", calc: "stairs", when: "Today", vals: { totalRise: 3.15, totalGoing: 0, width: 1, targetRiser: 175 } },
  { id: "north-concrete", name: "72 North Creek Road", calc: "concrete", when: "Today", vals: { shape: "slab", length: 6.4, width: 4, thickness: 125, waste: 10 } },
  { id: "rail-square", name: "14 Railway St", calc: "square", when: "Wed", vals: { sideA: 12000, sideB: 8000, diagonal1: 14422, diagonal2: 14430 } },
  { id: "rail-spacing", name: "14 Railway St", calc: "spacing", when: "Tue", title: "Stud marks · wall A", vals: { mode: "n-spaces", totalLength: 9.45, nSpaces: 7 } },
  { id: "rail-deck", name: "14 Railway St", calc: "decking", when: "Sun" },
  { id: "ocean-deck", name: "8 Ocean Pde", calc: "decking", when: "Sun" }
];

const S = {
  jobId: null, calc: "square", pending: false, fromSave: false, forJob: false,
  qCalcs: "", qJobs: "", vals: {}, dispUnits: {}, out: null,
  bagKg: 20, theme: "light", paper: "warm", bold: false,
  dec: "point", restored: false
};

function engineOf(id){
  if (typeof SetoutCalc === "undefined") return null;
  return SetoutCalc.getCalculator(SLUG[id] || id) || null;
}

function job(){ return jobs.find(j => j.id === S.jobId) || null; }
function calc(){ return CALCS[S.calc]; }
function hash(){ return (location.hash.replace(/^#\/?/, "") || "calcs"); }
function go(route){
  const next = String(route).replace(/^#\/?/, "");
  if (hash() !== next) location.hash = next;
  render();
}

function n(v){
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v ?? "").trim().replace(",", ".");
  const x = parseFloat(s);
  return Number.isFinite(x) ? x : 0;
}

function loc(s){
  s = String(s ?? "").replace(/\u2014/g, "-").replace(/\u2013/g, "-");
  if (S.dec === "comma") s = s.replace(/(\d)\.(\d)/g, "$1,$2");
  return s;
}

function esc(s){
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function show(v){
  const s = String(v);
  return S.dec === "comma" ? s.replace(".", ",") : s;
}

function showNum(v, unit){
  if (v === "" || v == null) return "";
  const num = typeof v === "number" ? v : n(v);
  if (!Number.isFinite(num)) return "";
  const s = (unit === "mm" || unit === "count") ? String(Math.round(num)) : String(num);
  return show(s);
}

function convertUnit(v, from, to){
  if (from === to) return v;
  if (from === "m" && to === "mm") return v * 1000;
  if (from === "mm" && to === "m") return v / 1000;
  return v;
}

function bagYield(kg){ return kg * 0.0005; }
function bagCount(m3, kg){
  const y = bagYield(kg);
  return y > 0 ? Math.ceil(m3 / y - 1e-9) : 0;
}

function parseQty(s){
  const m = String(s).replace(/\u2014/g, "-").match(/-?\d[\d\s]*[.,]?\d*/);
  if (!m) return 0;
  return n(m[0].replace(/\s/g, ""));
}

function defaultsFor(id){
  const live = engineOf(id);
  const out = live ? Object.assign({}, SetoutCalc.defaultsFor(live.fields)) : {};
  if (id === "concrete") out.bagKg = S.bagKg;
  out._id = id;
  return out;
}

function valsFor(id, raw){
  const live = engineOf(id);
  const out = {};
  if (!live) return out;
  for (const f of live.fields){
    if (f.kind === "section") continue;
    if (f.kind === "select") out[f.key] = String(raw[f.key] ?? f.defaultValue);
    if (f.kind === "number") out[f.key] = n(raw[f.key] ?? f.defaultValue);
  }
  if (id === "concrete") out.bagKg = S.bagKg;
  return out;
}

function adapt(id, engine, inputs){
  const kpis = engine.kpis || [];
  const hero = kpis[0];
  const bad = (engine.flags || []).some(f => f.tone === "bad");
  let m3 = 0;
  let ver = loc(hero ? hero.value : engine.headline);
  let subv = loc(engine.headline);
  let short = ver;
  if (id === "concrete"){
    const order = kpis.find(x => x.label === "Order");
    m3 = order ? parseQty(order.value) : 0;
    ver = loc(order ? order.value : engine.headline);
    const hint = (engine.headline || "").includes(" · ")
      ? engine.headline.split(" · ").slice(1).join(" · ")
      : "";
    const waste = n((inputs && inputs.waste) ?? 10);
    const wasteBit = waste > 0 ? ` + ${waste === Math.round(waste) ? Math.round(waste) : waste}% waste` : "";
    subv = loc(hint ? hint + wasteBit : wasteBit.trim());
    short = ver;
  }
  return {
    engine,
    name: CALCS[id].name,
    ver,
    subv,
    out: bad,
    short,
    unit: "",
    m3
  };
}

function computeOut(id, raw){
  const live = engineOf(id);
  if (!live) return { engine: { headline: "Engine missing", kpis: [], sections: [], notes: [], flags: [] }, ver: "Engine missing", subv: "", out: false, short: "", m3: 0, name: CALCS[id] ? CALCS[id].name : id };
  const inputs = valsFor(id, raw || {});
  return adapt(id, live.compute(inputs), inputs);
}

function cardShort(id, o){
  const kpis = (o && o.engine && o.engine.kpis) || [];
  const pick = label => {
    const k = kpis.find(x => x.label === label);
    return k ? loc(k.value) : "";
  };
  if (id === "concrete") return pick("Order") || (o && o.ver) || "";
  if (id === "decking") return pick("Area") || (o && o.short) || "";
  if (id === "stairs") return pick("Risers") || (o && o.short) || "";
  if (id === "spacing") return pick("Spaces") || (o && o.short) || "";
  if (id === "square") return pick("Expected diagonal") || pick("Diagonal 1") || (o && o.short) || "";
  return (o && (o.short || o.ver)) || "";
}

function hydrateJobs(){
  for (const j of jobs){
    if (!j.calc) continue;
    const vals = Object.assign(defaultsFor(j.calc), j.vals || {});
    const o = computeOut(j.calc, vals);
    j.vals = vals;
    j.snap = o;
    j.short = cardShort(j.calc, o);
    j.out = o.out;
  }
}

function calcRows(scoped, q){
  const needle = (q || "").trim().toLowerCase();
  const match = ([, c]) => {
    if (!needle) return true;
    return c.name.toLowerCase().includes(needle)
      || (c.short || "").toLowerCase().includes(needle)
      || (c.cat || "").toLowerCase().includes(needle);
  };
  const row = ([id, c]) => {
    if (!match([id, c])) return "";
    const star = c.kit ? STAR : STAR_OFF;
    const label = c.kit ? `Unpin ${c.name}` : `Pin ${c.name}`;
    return `<div class="crow">
      <button class="row" type="button" data-calc="${id}" data-scoped="${scoped ? "1" : "0"}">
        <div class="tx"><div class="t">${esc(c.name)}</div></div>
      </button>
      <button class="starbtn" type="button" data-star="${id}" aria-pressed="${c.kit ? "true" : "false"}" aria-label="${esc(label)}">${star}</button>
    </div>`;
  };
  const block = (label, entries) => {
    const html = entries.map(row).join("");
    return html ? `<div class="sec">${esc(label)}</div><div class="group">${html}</div>` : "";
  };
  let html = "";
  if (!needle) html += block("Pinned", Object.entries(CALCS).filter(([, c]) => c.kit));
  for (const cat of CATS){
    html += block(cat, Object.entries(CALCS).filter(([, c]) => c.cat === cat && (needle || !c.kit)));
  }
  if (!html) html = `<div class="empty">No calculators match.</div>`;
  return html;
}

function pageHead(title, plus){
  const add = plus
    ? `<button class="icon" type="button" data-new-site aria-label="New"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg></button>`
    : "";
  if (!title) return add ? `<div class="page-head end">${add}</div>` : "";
  return `<div class="page-head"><div class="h">${esc(title)}</div>${add}</div>`;
}

function searchHtml(id, ph){
  return `<div class="sheet-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg><input id="${id}" type="search" placeholder="${ph}" autocomplete="off"/></div>`;
}

function renderCalcs(){
  const j = job();
  const scoped = S.forJob && !!j;
  const banner = scoped ? `<div class="banner">Saving to ${esc(j.name)}</div>` : "";
  const title = scoped ? "" : pageHead("Calculators");
  document.getElementById("calcs-main").innerHTML =
    banner + title + searchHtml("q-calcs", "Search") + calcRows(scoped, S.qCalcs);
  const inp = document.getElementById("q-calcs");
  inp.value = S.qCalcs;
  inp.oninput = () => { S.qCalcs = inp.value; renderCalcs(); };
}

function renderJobsList(){
  const q = S.qJobs.trim().toLowerCase();
  const list = jobs.filter(j => {
    if (!j.calc) return false;
    if (!q) return true;
    const c = CALCS[j.calc];
    const blob = [j.name, j.title, c && c.name, j.short].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).map(j => {
    const c = CALCS[j.calc];
    const sub = j.title || (c ? c.name : "");
    const line = [sub, j.short].filter(Boolean).join(" - ");
    const date = j.when ? `<span class="k">${esc(j.when)}</span>` : "";
    return `<div class="group calc-card"><button class="row" type="button" data-open-job="${j.id}">
      <div class="tx"><div class="t">${esc(j.name)}</div><div class="m">${esc(line)}</div></div>
      ${date}
    </button></div>`;
  }).join("") || `<div class="empty">${q ? "Nothing matches." : "Nothing saved yet."}</div>`;
  document.getElementById("jobs-main").innerHTML = pageHead("Saved", true) + searchHtml("q-jobs", "Search") + list;
  const inp = document.getElementById("q-jobs");
  inp.value = S.qJobs;
  inp.oninput = () => { S.qJobs = inp.value; renderJobsList(); };
}

function visibleFields(id, vals){
  const live = engineOf(id);
  if (!live) return [];
  return live.fields.filter(f => {
    if (f.kind !== "section" && f.key === "bagKg") return false;
    if (!f.showWhen) return true;
    return SetoutCalc.isFieldVisible(f, vals);
  });
}

function renderForm(){
  const id = S.calc;
  if (!S.vals || S.vals._id !== id) S.vals = defaultsFor(id);
  const rows = visibleFields(id, S.vals).map(f => {
    if (f.kind === "section") return `<div class="fsec">${esc(f.label)}</div>`;
    if (f.kind === "select"){
      const cur = String(S.vals[f.key] ?? f.defaultValue);
      const chips = f.options.map(opt =>
        `<button class="preset wrap${cur === opt.value ? " on" : ""}" type="button" data-select="${f.key}" data-val="${esc(opt.value)}">${esc(opt.label)}</button>`
      ).join("");
      const hint = f.hint ? `<div class="hint">${esc(f.hint)}</div>` : "";
      return `<div class="fblock">
        <div class="fline"><label>${esc(f.label)}</label></div>
        <div class="presets">${chips}</div>${hint}
      </div>`;
    }
    const stored = n(S.vals[f.key] ?? f.defaultValue);
    const disp = S.dispUnits[f.key] || f.unit;
    const shown = convertUnit(stored, f.unit, disp);
    const tap = f.altUnit ? " tap" : "";
    const alt = f.altUnit ? ` data-alt="${f.key}"` : "";
    let presets = f.presets || [];
    let notes = {};
    if (f.key === "waste"){
      presets = [0, 5, 10, 15].map(v => ({ label: String(v), value: v }));
      notes = WASTE_NOTES;
    }
    const chips = presets.map(p => {
      const val = typeof p === "object" ? p.value : p;
      const label = typeof p === "object" ? p.label : String(p);
      const on = Number(stored) === Number(val);
      return `<button class="preset${on ? " on" : ""}" type="button" data-preset="${f.key}:${val}">${esc(label)}</button>`;
    }).join("");
    const noteText = notes[Number(stored)] || f.hint || "";
    const note = noteText ? `<div class="hint">${esc(noteText)}</div>` : "";
    const mode = f.unit === "count" ? "numeric" : "decimal";
    return `<div class="fblock">
      <div class="fline"><label>${esc(f.label)}</label><span class="tail">
        <input inputmode="${mode}" data-key="${f.key}" value="${esc(showNum(shown, disp))}">
        <span class="un${tap}"${alt}>${esc(UNIT_LABEL[disp] || disp || "")}</span>
      </span></div>${chips ? `<div class="presets">${chips}</div>` : ""}${note}
    </div>`;
  }).join("");
  document.getElementById("form-main").innerHTML =
    `<div class="group">${rows}</div>
     <button class="btn p form-go" type="button" id="run-calc">Calculate</button>`;
  document.getElementById("form-main").querySelectorAll("input[data-key]").forEach(inp => {
    inp.oninput = () => writeField(inp);
    bindSelectOnTap(inp);
  });
  const run = document.getElementById("run-calc");
  if (run) run.onclick = runCalc;
}

function selectAll(el){
  el.select();
  try { el.setSelectionRange(0, el.value.length); } catch (err) { /* not a text input */ }
}

function bindSelectOnTap(inp){
  inp.addEventListener("focus", () => {
    inp.dataset.pick = "1";
    requestAnimationFrame(() => selectAll(inp));
  });
  inp.addEventListener("mouseup", e => {
    if (inp.dataset.pick !== "1") return;
    e.preventDefault();
    selectAll(inp);
    inp.dataset.pick = "0";
  });
  inp.addEventListener("touchend", () => {
    if (inp.dataset.pick !== "1") return;
    selectAll(inp);
  });
}

function writeField(inp){
  const key = inp.dataset.key;
  const live = engineOf(S.calc);
  const field = live && live.fields.find(f => f.key === key);
  const raw = inp.value.replace(",", ".");
  if (!field || field.kind !== "number"){
    S.vals[key] = raw;
    return;
  }
  if (raw.trim() === "" || raw === "-" || raw.endsWith(".")) return;
  const num = parseFloat(raw);
  if (!Number.isFinite(num)) return;
  const disp = S.dispUnits[key] || field.unit;
  S.vals[key] = convertUnit(num, disp, field.unit);
}

function readForm(){
  document.querySelectorAll("#form-main [data-key]").forEach(writeField);
}

function runCalc(){
  readForm();
  S.out = computeOut(S.calc, S.vals);
  const j = job();
  if (j && (S.forJob || !S.pending)){
    pinJob();
    S.forJob = false;
    go("square");
  } else {
    S.pending = true;
    S.forJob = false;
    go("result");
  }
}

function pinJob(){
  const j = job();
  if (!j) return;
  const o = S.out || computeOut(S.calc, S.vals);
  j.calc = S.calc;
  j.when = "Today";
  j.short = cardShort(S.calc, o);
  j.out = o.out;
  j.vals = Object.assign({}, S.vals);
  j.snap = o;
  S.pending = false;
}

function dropEmptyJob(){
  const j = job();
  if (!j || j.calc) return;
  const i = jobs.indexOf(j);
  if (i >= 0) jobs.splice(i, 1);
  S.jobId = null;
}

function orderHtml(o){
  if (S.calc === "concrete" && o.m3){
    const kg = S.bagKg;
    const chips = [20, 25, 30].map(s =>
      `<button class="preset${s === kg ? " on" : ""}" type="button" data-bag="${s}">${s} kg</button>`
    ).join("");
    const extraRows = ((o.engine && o.engine.order) || []).slice(2);
    const extra = extraRows.length
      ? `<div class="ord-split"></div>` + extraRows.map(r =>
          `<div class="ord-x"><div class="ord-xl">${esc(loc(r.item))}</div><div class="ord-xq">${esc(loc(r.qty))}</div></div>`
        ).join("")
      : "";
    const bagKpi = ((o.engine && o.engine.kpis) || []).find(k => k.label === "Bags");
    const nBags = bagKpi ? parseQty(bagKpi.value) : bagCount(o.m3, kg);
    const flags = ((o.engine && o.engine.flags) || []).map(f =>
      `<div class="flag ${f.tone}">${esc(loc(f.text))}</div>`
    ).join("");
    return `<div class="ord-h">Order</div>
      <div class="ord-l">${show(o.m3)} m³ ready-mix</div>
      <div class="ord-or">or</div>
      <div class="ord-l">${nBags} × ${kg} kg bags</div>
      <div class="ord-note">Bag size</div>
      <div class="presets">${chips}</div>
      ${flags}
      ${extra}`;
  }
  const rows = (o.engine && o.engine.order) || [];
  if (!rows.length) return "";
  return `<div class="ord-h">Order</div>` + rows.map(r =>
    `<div class="ord-l"><span>${esc(loc(r.item))}</span><span>${esc(loc(r.qty))}</span></div>`
  ).join("");
}

function resultBody(o){
  const engine = o.engine || { kpis: [], flags: [], sections: [], notes: [], order: [] };
  const takeoff = S.calc === "concrete" || S.calc === "decking";
  const kpis = takeoff ? [] : (engine.kpis || []).slice(1);
  const flags = S.calc === "concrete" ? [] : (engine.flags || []);
  const sections = takeoff ? [] : (engine.sections || []);
  const notes = engine.notes || [];
  let html = "";
  if (flags.length){
    html += flags.map(f => `<div class="flag ${f.tone}">${esc(loc(f.text))}</div>`).join("");
  }
  if (kpis.length){
    html += `<div class="kpis">${kpis.map(k =>
      `<div class="kpi"><div class="k">${esc(loc(k.label))}</div><div class="v">${esc(loc(k.value))}</div></div>`
    ).join("")}</div>`;
  }
  html += sections.map(sec => {
    const rows = (sec.rows || []).map(r => {
      const tone = r.tone && r.tone !== "default" ? ` ${r.tone}` : "";
      const hint = r.hint ? `<div class="h2">${esc(loc(r.hint))}</div>` : "";
      return `<div class="rrow${tone}"><div class="l">${esc(loc(r.label))}${hint}</div><div class="r">${esc(loc(r.value))}</div></div>`;
    }).join("");
    return `<div class="rsec"><div class="h">${esc(loc(sec.title))}</div>${rows}</div>`;
  }).join("");
  if (notes.length){
    html += `<ul class="rnotes">${notes.map(n => `<li>${esc(loc(n))}</li>`).join("")}</ul>`;
  }
  return html;
}

function fillResult(){
  const c = calc();
  const o = S.out || (S.vals && S.vals._id === S.calc ? computeOut(S.calc, S.vals) : computeOut(S.calc, defaultsFor(S.calc)));
  document.getElementById("r-name").textContent = c ? c.name : "";
  const ver = document.getElementById("r-ver");
  ver.textContent = o.ver || "";
  ver.classList.toggle("out", !!o.out);
  const sub = document.getElementById("r-sub");
  sub.textContent = o.subv && o.subv !== o.ver ? o.subv : "";
  sub.classList.toggle("hide", !sub.textContent);
  document.getElementById("r-body").innerHTML = resultBody(o);
  const ord = document.getElementById("r-ord");
  const html = orderHtml(o);
  ord.classList.toggle("hide", !html);
  ord.innerHTML = html;
}

function applyPrefs(){
  const r = document.documentElement;
  r.dataset.theme = S.theme;
  r.dataset.paper = S.paper;
  r.dataset.bold = S.bold ? "1" : "0";
}

function renderSettings(){
  const r = hash();
  const el = document.getElementById("settings-main");
  if (r === "feedback"){
    el.innerHTML = `
      <div class="note">Anything wrong or missing? Anything you would like added?</div>
      <div class="fb"><textarea id="fb-text" placeholder=""></textarea></div>
      <button class="btn p form-go" type="button" id="fb-send">Send</button>
      <div class="note">Goes to setout_calculator@icloud.com</div>`;
    const send = document.getElementById("fb-send");
    if (send) send.onclick = () => {
      const body = encodeURIComponent((document.getElementById("fb-text").value || "").trim());
      location.href = "mailto:setout_calculator@icloud.com?subject=Setout%20feedback" + (body ? "&body=" + body : "");
    };
    return;
  }
  if (r === "privacy"){
    el.innerHTML = `
      <div class="legal">
        <p>Setout keeps calculations on this phone. Places you save, pins, and numbers you type stay here unless you copy or share them.</p>
        <p>HERE uses the device location once, to name the street. It is not stored as a track. Turn location off in iOS if you do not want that.</p>
        <p>Feedback mail is ordinary email. We do not sell data. Full policy ships with the App Store build.</p>
      </div>`;
    return;
  }
  if (r === "terms"){
    el.innerHTML = `
      <div class="legal">
        <p>Setout is a calculator. You are responsible for what you order and what you build. Check the site, the drawing, and the yard.</p>
        <p>Bag yields and waste are rules of thumb. Not a quote, not a code check, not NCC or AS 1684.</p>
        <p>One-time unlock. No subscription. Full terms ship with the App Store build.</p>
      </div>`;
    return;
  }

  const paper = S.paper;
  const theme = S.theme;
  const skins = ["light", "dark"].map(id => {
    const on = theme === id;
    const kind = id === "light" ? "lt" : "dk";
    return `<button class="skin${on ? " on" : ""}" type="button" data-theme="${id}">
      <span class="skin-phone ${kind} ${paper}"><span class="b"></span><span class="c"></span><span class="c"></span></span>
      <span class="skin-dot">${TICK}</span>
      <span class="skin-cap">${id === "light" ? "Light" : "Dark"}</span>
    </button>`;
  }).join("");

  el.innerHTML = `
    ${pageHead("Settings")}
    <div class="sec">Units</div>
    <div class="group">
      <div class="row"><div class="tx"><div class="t">International metric</div></div></div>
    </div>
    <div class="sec">Decimal</div>
    <div class="group">
      <div class="presets">
        <button class="preset${S.dec === "point" ? " on" : ""}" type="button" data-dec="point">3.5</button>
        <button class="preset${S.dec === "comma" ? " on" : ""}" type="button" data-dec="comma">3,5</button>
      </div>
    </div>
    <div class="sec">Appearance</div>
    <div class="appear">${skins}</div>
    <div class="paper-row">
      <button class="paper-opt${S.paper === "warm" ? " on" : ""}" type="button" data-paper="warm"><span class="swatch warm"></span>Cream</button>
      <button class="paper-opt${S.paper === "cool" ? " on" : ""}" type="button" data-paper="cool"><span class="swatch cool"></span>White</button>
    </div>
    <div class="group">
      <div class="row" data-bold><div class="tx"><div class="t">Bold text</div></div><span class="tog${S.bold ? " on" : ""}"><i></i></span></div>
    </div>
    <div class="sec">Support</div>
    <div class="group">
      <button class="row" type="button" data-go="feedback"><div class="tx"><div class="t">Feedback</div></div>${CHEV}</button>
      <button class="row" type="button" data-go="privacy"><div class="tx"><div class="t">Privacy</div></div>${CHEV}</button>
      <button class="row" type="button" data-go="terms"><div class="tx"><div class="t">Terms of use</div></div>${CHEV}</button>
    </div>
    <div class="sec">Purchase</div>
    <div class="group">
      <div class="row"><div class="tx"><div class="t">Lifetime unlock</div><div class="m">$9.99. Launch $4.99. No subscription.</div></div></div>
      <button class="row" type="button" data-restore><div class="tx"><div class="t">Restore purchase</div>${S.restored ? '<div class="m">Restored on this phone.</div>' : ""}</div>${CHEV}</button>
    </div>
    <div class="sec">How to</div>
    <div class="about">Open a calculator. Type the size. Calculate.</div>
    <div class="about">Saved is where they live. Each card is a job: a street, a lot, the place you are standing.</div>
    <div class="about">Or start from Saved. New. Name it. Pick a calculator. It already belongs there.</div>
    <div class="about">Copy or share the slip when you need it off the phone.</div>
    <div class="about">Made in Australia. Version 0.3.0.</div>
  `;
}

function tabOf(r){
  if (r === "settings" || r === "feedback" || r === "privacy" || r === "terms") return "settings";
  if (r === "jobs" || r === "square") return "jobs";
  return "calcs";
}

function render(){
  applyPrefs();
  const r = hash();
  const j = job();
  const c = calc();
  const sheets = { save: "sheet-save", "new-job": "sheet-new" };
  const overlay = sheets[r];
  const settingsPush = r === "feedback" || r === "privacy" || r === "terms";
  const pushed = r === "form" || r === "result" || r === "square" || r === "save" || r === "new-job" || settingsPush;

  document.querySelectorAll(".view").forEach(v => v.classList.remove("on"));
  if (r === "form") document.getElementById("view-form").classList.add("on");
  else if (r === "result" || r === "save" || r === "square" || (r === "new-job" && S.fromSave)) document.getElementById("view-result").classList.add("on");
  else if (r === "jobs" || r === "diary" || (r === "new-job" && !S.fromSave)) document.getElementById("view-jobs").classList.add("on");
  else if (r === "settings" || settingsPush) document.getElementById("view-settings").classList.add("on");
  else document.getElementById("view-calcs").classList.add("on");

  document.querySelectorAll(".sheet").forEach(s => s.classList.toggle("open", s.id === (overlay || "")));
  document.getElementById("tabbar").classList.toggle("off", pushed);

  const back = r === "result" || r === "square" || r === "save" || r === "form" || (r === "calcs" && S.forJob) || settingsPush;
  document.getElementById("left-btn").classList.toggle("hide", !back);
  document.getElementById("left-ghost").classList.toggle("hide", back);
  document.getElementById("new-btn").classList.add("hide");
  document.getElementById("right-ghost").classList.remove("hide");

  if (r === "jobs") document.getElementById("pill").textContent = "Saved";
  else if (r === "settings") document.getElementById("pill").textContent = "Settings";
  else if (r === "feedback") document.getElementById("pill").textContent = "Feedback";
  else if (r === "privacy") document.getElementById("pill").textContent = "Privacy";
  else if (r === "terms") document.getElementById("pill").textContent = "Terms of use";
  else if (r === "square") document.getElementById("pill").textContent = j ? j.name : "Saved";
  else if (r === "form" || r === "result" || r === "save") document.getElementById("pill").textContent = c ? c.name : "";
  else document.getElementById("pill").textContent = "Calculators";

  const showBrand = (r === "calcs" && !S.forJob) || r === "jobs" || r === "settings";
  document.getElementById("brand").classList.toggle("hide", !showBrand);
  document.getElementById("pill").classList.toggle("hide", showBrand);
  document.getElementById("pill-box").classList.toggle("branded", showBrand);

  const tab = tabOf(r);
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.dataset.tab === tab));

  const unsaved = r === "result" || r === "save" || (r === "new-job" && S.fromSave);
  document.getElementById("unsaved").classList.toggle("on", unsaved);
  document.getElementById("save-btn").textContent = r === "square" ? "Done" : "Save";
  fillResult();

  renderCalcs();
  renderJobsList();
  renderSettings();
  if (r === "form") renderForm();
}

function closeSheet(){
  if (history.length > 1) history.back();
  else go(S.fromSave ? "result" : "jobs");
}

function openCalc(id){
  S.calc = id;
  S.dispUnits = {};
  S.vals = defaultsFor(id);
  S.out = null;
  if (!S.forJob) S.jobId = null;
  go("form");
}

function openJob(id){
  const j = jobs.find(x => x.id === id);
  if (!j || !j.calc) return;
  S.jobId = j.id;
  S.calc = j.calc;
  S.dispUnits = {};
  S.vals = j.vals ? Object.assign({ _id: j.calc }, j.vals) : defaultsFor(j.calc);
  S.out = j.snap || computeOut(j.calc, S.vals);
  S.pending = false;
  S.forJob = false;
  go("square");
}

document.getElementById("left-btn").onclick = () => {
  const r = hash();
  if (r === "square"){ S.jobId = null; go("jobs"); }
  else if (r === "form"){
    if (S.forJob) go("calcs");
    else if (job() && !S.pending) go("square");
    else go("calcs");
  }
  else if (r === "result") go("form");
  else if (r === "save") go("result");
  else if (r === "feedback" || r === "privacy" || r === "terms") go("settings");
  else if (r === "calcs" && S.forJob){ S.forJob = false; dropEmptyJob(); go("jobs"); }
  else history.back();
};

document.getElementById("new-btn").onclick = () => {
  S.fromSave = false;
  document.getElementById("job-name").value = "";
  go("new-job");
};

document.querySelectorAll(".tab").forEach(t => {
  t.onclick = () => {
    const name = t.dataset.tab;
    S.forJob = false;
    dropEmptyJob();
    S.jobId = null;
    if (name === "jobs") go("jobs");
    else if (name === "settings") go("settings");
    else go("calcs");
  };
});

function slipText(){
  const o = S.out || computeOut(S.calc, S.vals);
  const c = calc();
  const engine = o.engine || {};
  const lines = ["SETOUT - " + (c ? c.name : ""), engine.headline || o.ver, ""];
  if (S.calc === "concrete" && o.m3){
    const kg = S.bagKg;
    const bagKpi = (engine.kpis || []).find(k => k.label === "Bags");
    const nBags = bagKpi ? parseQty(bagKpi.value) : bagCount(o.m3, kg);
    lines.push("Order");
    lines.push(show(o.m3) + " m³ ready-mix");
    lines.push("or");
    lines.push(nBags + " × " + kg + " kg bags");
    const extraRows = (engine.order || []).slice(2);
    if (extraRows.length){
      lines.push("");
      for (const row of extraRows){
        lines.push(row.item);
        lines.push(row.qty);
      }
    }
    lines.push("");
  } else {
    for (const row of engine.order || []) lines.push(row.item + "\t" + row.qty);
    if (engine.order && engine.order.length) lines.push("");
  }
  for (const sec of engine.sections || []){
    lines.push(sec.title.toUpperCase());
    for (const row of sec.rows || []) lines.push(row.label + "\t" + row.value);
    lines.push("");
  }
  return lines.join("\n").replace(/\u2014/g, "-").replace(/\u2013/g, "-").trimEnd();
}

function copySlip(){
  const t = loc(slipText());
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t);
}

document.getElementById("save-btn").onclick = () => {
  if (hash() === "square"){ S.jobId = null; go("jobs"); }
  else {
    S.fromSave = true;
    document.getElementById("job-name").value = "";
    go("new-job");
  }
};
document.getElementById("recheck-btn").onclick = () => go("form");
document.getElementById("copy-btn").onclick = copySlip;
document.getElementById("share-btn").onclick = () => {
  const t = loc(slipText());
  if (navigator.share) navigator.share({ text: t }).catch(() => copySlip());
  else copySlip();
};
document.getElementById("save-new").onclick = () => {
  S.fromSave = true;
  document.getElementById("job-name").value = "";
  go("new-job");
};
document.getElementById("here-btn").onclick = () => {
  document.getElementById("job-name").value = "2 Tweed St";
  document.getElementById("job-name").focus();
};
document.getElementById("start-job").onclick = () => {
  const name = (document.getElementById("job-name").value || "").trim() || "2 Tweed St";
  const id = "job-" + Date.now();
  jobs.unshift({ id, name, when: "Today" });
  S.jobId = id;
  S.fromSave = false;
  if (S.pending){
    pinJob();
    go("square");
  } else {
    S.forJob = true;
    go("calcs");
  }
};

function hit(e, sel){
  const el = e.target.closest(sel);
  if (!el || el === document.documentElement || el === document.body) return null;
  return el;
}

document.getElementById("app").addEventListener("click", e => {
  const restore = hit(e, "[data-restore]");
  if (restore){ S.restored = true; render(); return; }
  const goSet = hit(e, "[data-go]");
  if (goSet){ go(goSet.dataset.go); return; }
  const theme = hit(e, "button[data-theme]");
  if (theme){ S.theme = theme.dataset.theme; render(); return; }
  const paper = hit(e, "button[data-paper]");
  if (paper){ S.paper = paper.dataset.paper; render(); return; }
  const dec = hit(e, "button[data-dec]");
  if (dec){ S.dec = dec.dataset.dec; render(); return; }
  const bold = hit(e, ".row[data-bold]");
  if (bold){ S.bold = !S.bold; render(); return; }
  const close = hit(e, "[data-close]");
  if (close){ closeSheet(); return; }
  const openSaved = hit(e, "[data-open-job]");
  if (openSaved){ openJob(openSaved.dataset.openJob); return; }
  const newSite = hit(e, "[data-new-site]");
  if (newSite){
    S.fromSave = false;
    document.getElementById("job-name").value = "";
    go("new-job");
    return;
  }
  const star = hit(e, "[data-star]");
  if (star){
    e.preventDefault();
    const id = star.dataset.star;
    if (CALCS[id]){
      CALCS[id].kit = !CALCS[id].kit;
      savePins();
      renderCalcs();
    }
    return;
  }
  const pick = hit(e, "[data-calc]");
  if (pick){ openCalc(pick.dataset.calc); return; }
  const bag = hit(e, "[data-bag]");
  if (bag){
    S.bagKg = Number(bag.dataset.bag);
    if (S.vals) S.vals.bagKg = S.bagKg;
    if (S.calc === "concrete") S.out = computeOut("concrete", S.vals._id === "concrete" ? S.vals : defaultsFor("concrete"));
    render();
    return;
  }
  const sel = hit(e, "[data-select]");
  if (sel){
    S.vals[sel.dataset.select] = sel.dataset.val;
    renderForm();
    return;
  }
  const alt = hit(e, "[data-alt]");
  if (alt){
    const key = alt.dataset.alt;
    const live = engineOf(S.calc);
    const field = live && live.fields.find(f => f.key === key);
    if (field && field.altUnit){
      readForm();
      const cur = S.dispUnits[key] || field.unit;
      S.dispUnits[key] = cur === field.unit ? field.altUnit : field.unit;
      renderForm();
    }
    return;
  }
  const preset = hit(e, "[data-preset]");
  if (preset){
    const raw = preset.dataset.preset;
    const i = raw.indexOf(":");
    const key = raw.slice(0, i);
    const val = raw.slice(i + 1);
    S.vals[key] = n(val);
    renderForm();
    return;
  }
});

window.addEventListener("hashchange", render);

function fitPhone(){
  if (innerWidth <= 720){
    document.documentElement.style.setProperty("--fit", "1");
    return;
  }
  const w = innerWidth;
  const h = innerHeight;
  const s = Math.min(1, (w - 16) / 393, (h - 16) / 852);
  document.documentElement.style.setProperty("--fit", String(s));
}
fitPhone();
window.addEventListener("resize", fitPhone);

hydrateJobs();
if (!location.hash){
  if (history.replaceState) history.replaceState(null, "", "#calcs");
  else location.hash = "calcs";
}
render();

(function splash(){
  const el = document.getElementById("splash");
  if (!el) return;
  setTimeout(function(){
    el.classList.add("off");
    setTimeout(function(){ el.remove(); }, 400);
  }, 1400);
})();
