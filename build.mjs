// Builds index.html and record.xml (Atom feed of the track record) from profile.json.
//   node build.mjs          write the files
//   node build.mjs --check  exit 1 if the committed files are out of date (used by the GitHub check)
import fs from "node:fs";

const SITE = "https://shreyashgondane.com";
const p = JSON.parse(fs.readFileSync(new URL("./profile.json", import.meta.url), "utf8"));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = (label, url) => (url ? `<a href="${esc(url)}">${esc(label)}</a>` : esc(label));
const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
const TYPES = { release: "Release", milestone: "Milestone", paper: "Paper", preprint: "Preprint", review: "Reviewing", talk: "Talk",
                dataset: "Dataset", benchmark: "Benchmark", "open-source": "Open source", award: "Award", press: "Press" };

// validate the data so a typo can't publish a broken or misleading page
const errs = [];
for (const [i, r] of p.record.entries()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) errs.push(`record[${i}] bad date ${r.date}`);
  if (!TYPES[r.type]) errs.push(`record[${i}] unknown type ${r.type} (use one of ${Object.keys(TYPES).join(", ")})`);
  if (!r.title) errs.push(`record[${i}] has no title`);
}
for (const w of p.writing) if (!["in preparation", "submitted", "under review", "accepted", "published", "preprint"].includes(w.status)) errs.push(`writing "${w.title}" bad status ${w.status}`);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }

const record = [...p.record].sort((a, b) => b.date.localeCompare(a.date));
const updated = record[0]?.date || new Date().toISOString().slice(0, 10);
const usedTypes = [...new Set(record.map((r) => r.type))];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.name)}</title>
<meta name="description" content="${esc(p.tagline)}">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" type="application/atom+xml" title="${esc(p.name)}: track record" href="${SITE}/record.xml">
<meta property="og:title" content="${esc(p.name)}">
<meta property="og:description" content="${esc(p.tagline)}">
<meta property="og:url" content="${SITE}/">
<meta property="og:type" content="profile">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: p.name, url: SITE + "/",
  description: p.tagline, sameAs: p.links.filter((l) => /^https?:/.test(l.url)).map((l) => l.url) })}</script>
<style>
:root{
  --bg:#F8F8F6; --surface:#FFFFFF; --ink:#16181D; --muted:#5B6270; --faint:#8A909B; --line:#E3E4E8;
  --accent:#1F5AA6; --accent-soft:#E7EEF8; --ok:#1D7A4B; --ok-soft:#E4F3EA; --wait:#8A5A0E; --wait-soft:#FAF0DC;
  --serif:"Newsreader",Georgia,"Times New Roman",serif;
  --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color-scheme:light;
}
@media (prefers-color-scheme: dark){
  :root{--bg:#0F1217; --surface:#151920; --ink:#E6E8EC; --muted:#9AA2B1; --faint:#6E7684; --line:#252B35;
        --accent:#8AB4F8; --accent-soft:#1A2537; --ok:#6CCB97; --ok-soft:#14291E; --wait:#E3B460; --wait-soft:#2E2412; color-scheme:dark}
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 var(--sans);padding-inline:20px;padding-block:56px 72px}
main{max-width:760px;margin:0 auto;display:grid;gap:56px}
h1,h2{font-family:var(--serif);font-weight:600;line-height:1.15;margin:0;text-wrap:balance}
h1{font-size:clamp(36px,6vw,50px)}
h2{font-size:25px}
h3{font-size:16.5px;font-weight:600;margin:0;line-height:1.35}
p{margin:0}
a{color:var(--accent);text-underline-offset:3px}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:3px}
.eyebrow{font:500 12px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.muted{color:var(--muted)}
header{display:grid;gap:14px}
.role{color:var(--muted);font-size:15px}
.lede{font-size:18.5px;max-width:62ch}
nav{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:14.5px;padding-top:4px}
section{display:grid;gap:18px}
.statement{display:grid;gap:12px;max-width:66ch}
.focus{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px;display:grid;gap:6px;align-content:start}
.list{display:grid}
.item{display:grid;gap:6px;padding-block:16px;border-top:1px solid var(--line)}
.item:first-child{border-top:0;padding-top:0}
.meta{font:13px/1.5 var(--mono);color:var(--muted);display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center}
.tag{font:500 11.5px/1 var(--mono);color:var(--accent);background:var(--accent-soft);padding:4px 7px;border-radius:4px}
.status{font:500 11.5px/1 var(--mono);padding:4px 7px;border-radius:4px}
.s-active,.s-published,.s-accepted{color:var(--ok);background:var(--ok-soft)}
.s-in-preparation,.s-submitted,.s-under-review,.s-earlier,.s-preprint{color:var(--wait);background:var(--wait-soft)}
.evidence{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14px}
.filters{display:flex;flex-wrap:wrap;gap:8px}
.filters button{font:500 13px/1 var(--sans);color:var(--muted);background:transparent;border:1px solid var(--line);border-radius:999px;padding:7px 12px;cursor:pointer}
.filters button[aria-pressed="true"]{color:var(--ink);border-color:var(--ink)}
.timeline{list-style:none;margin:0;padding:0;display:grid}
.timeline li{display:grid;grid-template-columns:112px 1fr;gap:14px;padding-block:14px;border-top:1px solid var(--line)}
.timeline li:first-child{border-top:0;padding-top:0}
.timeline time{font:13px/1.6 var(--mono);color:var(--muted);font-variant-numeric:tabular-nums}
.timeline .type{font:500 11.5px/1 var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.timeline .body{display:grid;gap:4px}
.empty{color:var(--faint);font-size:15px}
footer{font-size:13px;color:var(--muted);border-top:1px solid var(--line);padding-top:16px;display:grid;gap:4px}
@media (max-width:540px){.timeline li{grid-template-columns:1fr;gap:4px}}
</style>
</head>
<body>
<main>

<header>
  <div class="eyebrow">Research profile</div>
  <h1>${esc(p.name)}</h1>
  <div class="role">${esc(p.role)}</div>
  <p class="lede">${esc(p.tagline)}</p>
  <nav aria-label="Profiles">${p.links.map((l) => link(l.label, l.url)).join("\n    ")}</nav>
</header>

<section aria-labelledby="statement">
  <h2 id="statement">Research statement</h2>
  <div class="statement">${p.statement.map((s) => `<p>${esc(s)}</p>`).join("\n    ")}</div>
  <div class="focus">
    ${p.focus.map((f) => `<div class="card"><h3>${esc(f.title)}</h3><p class="muted">${esc(f.body)}</p></div>`).join("\n    ")}
  </div>
</section>

<section aria-labelledby="writing">
  <h2 id="writing">Writing</h2>
  <div class="list">
    ${p.writing.length ? p.writing.map((w) => `<div class="item">
      <h3>${link(w.title, w.url)}</h3>
      <div class="meta"><span class="status s-${esc(w.status.replace(/ /g, "-"))}">${esc(w.status)}</span>${w.venue ? `<span>${esc(w.venue)}</span>` : ""}</div>
      ${w.note ? `<p class="muted">${esc(w.note)}</p>` : ""}
    </div>`).join("\n    ") : `<p class="empty">Nothing yet.</p>`}
  </div>
</section>

<section aria-labelledby="projects">
  <h2 id="projects">Projects</h2>
  <div class="list">
    ${p.projects.map((pr) => `<div class="item">
      <h3>${link(pr.title, pr.url)}</h3>
      <div class="meta"><span>${esc(pr.period)}</span><span class="status s-${esc(pr.status)}">${esc(pr.status)}</span>${pr.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <p>${esc(pr.summary)}</p>
      ${pr.evidence.length ? `<div class="evidence">${pr.evidence.map((e) => link(e.label, e.url)).join("")}</div>` : ""}
    </div>`).join("\n    ")}
  </div>
</section>

<section aria-labelledby="record">
  <h2 id="record">Track record</h2>
  <p class="muted">A dated log of releases, results and service, each linked to evidence where it exists. Newest first. <a href="/record.xml">Follow via feed</a>.</p>
  <div class="filters" role="group" aria-label="Filter the track record" hidden>
    <button type="button" data-type="all" aria-pressed="true">All</button>
    ${usedTypes.map((t) => `<button type="button" data-type="${t}" aria-pressed="false">${TYPES[t]}</button>`).join("\n    ")}
  </div>
  <ol class="timeline">
    ${record.map((r) => `<li data-type="${r.type}">
      <time datetime="${r.date}">${fmtDate(r.date)}</time>
      <div class="body"><span class="type">${TYPES[r.type]}</span><h3>${link(r.title, r.url)}</h3>${r.detail ? `<p class="muted">${esc(r.detail)}</p>` : ""}</div>
    </li>`).join("\n    ")}
  </ol>
</section>

<section aria-labelledby="service">
  <h2 id="service">Service</h2>
  ${p.service.length ? `<ul>${p.service.map((s) => `<li>${link(s.title, s.url)} <span class="muted">(${esc(s.period || "")})</span></li>`).join("")}</ul>` : `<p class="empty">Reviewing and talks will appear here.</p>`}
</section>

<footer>
  <p>Updated ${fmtDate(updated)}. Research only; nothing here is investment advice.</p>
  <p><a href="https://github.com/Shreyasg13/shreyashgondane.com">Source of this page</a></p>
</footer>

</main>
<script>
(function () {
  var bar = document.querySelector(".filters"); if (!bar) return;
  bar.hidden = false;
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var t = b.getAttribute("data-type");
    bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    document.querySelectorAll(".timeline li").forEach(function (li) { li.hidden = t !== "all" && li.getAttribute("data-type") !== t; });
  });
})();
</script>
</body>
</html>
`;

const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(p.name)}: track record</title>
  <link href="${SITE}/record.xml" rel="self"/>
  <link href="${SITE}/#record"/>
  <id>${SITE}/record.xml</id>
  <updated>${updated}T00:00:00Z</updated>
  <author><name>${esc(p.name)}</name></author>
${record.map((r) => `  <entry>
    <title>${esc(TYPES[r.type] + ": " + r.title)}</title>
    <id>${SITE}/#${r.date}-${esc(r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60))}</id>
    <updated>${r.date}T00:00:00Z</updated>
    ${r.url ? `<link href="${esc(r.url)}"/>` : ""}
    <summary>${esc(r.detail || r.title)}</summary>
  </entry>`).join("\n")}
</feed>
`;

const out = { "index.html": html, "record.xml": atom };
if (process.argv.includes("--check")) {
  const stale = Object.entries(out).filter(([f, s]) => !fs.existsSync(new URL("./" + f, import.meta.url)) || fs.readFileSync(new URL("./" + f, import.meta.url), "utf8") !== s).map(([f]) => f);
  if (stale.length) { console.error(`out of date: ${stale.join(", ")}. Run: node build.mjs`); process.exit(1); }
  console.log("up to date");
} else {
  for (const [f, s] of Object.entries(out)) fs.writeFileSync(new URL("./" + f, import.meta.url), s);
  console.log(`built index.html and record.xml (${record.length} track-record entries, updated ${updated})`);
}
