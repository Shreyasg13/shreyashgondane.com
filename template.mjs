// HTML template for the research profile (design follows shreyashportfolio.netlify.app: dark space background, orange accent,
// Sora + Inter + JetBrains Mono, stat strip, card grids, activity-style track record). Rendered by build.mjs.
const ICON = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  focus: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  hand: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

export function render({ p, esc, link, fmtDate, TYPES, record, updated, usedTypes, SITE }) {
  const papers = p.writing.filter((w) => ["published", "accepted", "preprint"].includes(w.status)).length;
  const inPrep = p.writing.filter((w) => ["in preparation", "submitted", "under review"].includes(w.status)).length;
  const oss = p.projects.filter((x) => /github\.com/.test(x.url || "")).length;
  const stats = [
    papers ? [String(papers), papers === 1 ? "Publication" : "Publications"] : [String(inPrep), "Paper in preparation"],
    [String(oss), "Open-source research projects"],
    [String(record.length), "Track-record entries"],
    [p.years_experience || "", "Years building AI systems"],
  ].filter(([v]) => v);
  const [first, ...rest] = p.name.split(" ");
  const nav = [["top", "home", "Home"], ["statement", "focus", "Research"], ["writing", "doc", "Writing"], ["projects", "folder", "Projects"], ["record", "list", "Track record"], ["service", "hand", "Service"]];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.name)}</title>
<meta name="description" content="${esc(p.tagline)}">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" type="application/atom+xml" title="${esc(p.name)}: track record" href="${SITE}/record.xml">
<meta property="og:title" content="${esc(p.name)} · Research">
<meta property="og:description" content="${esc(p.tagline)}">
<meta property="og:url" content="${SITE}/">
<meta property="og:type" content="profile">
<meta name="theme-color" content="#050A11">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: p.name, url: SITE + "/",
    description: p.tagline, sameAs: p.links.filter((l) => /^https?:/.test(l.url)).map((l) => l.url) })}</script>
<style>
:root{
  --bg:#050A11; --bg2:#0A111C; --card:#0E1624; --card2:#111B2B; --line:#1C2738; --line2:#26344A;
  --ink:#EEF2F8; --text:#C4CCDA; --muted:#8793A7; --faint:#5D697C;
  --accent:#E4572E; --accent2:#FF7A4D; --accent-soft:rgba(228,87,46,.12);
  --ok:#3DDC84; --ok-soft:rgba(61,220,132,.12); --wait:#F2B544; --wait-soft:rgba(242,181,68,.12); --blue:#6EA8FE;
  --display:"Sora",system-ui,sans-serif; --body:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color-scheme:dark;
}

*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font:15.5px/1.65 var(--body);
  background-image:radial-gradient(1px 1px at 12% 18%,rgba(255,255,255,.35) 50%,transparent 51%),radial-gradient(1px 1px at 72% 8%,rgba(255,255,255,.25) 50%,transparent 51%),
  radial-gradient(1px 1px at 38% 62%,rgba(255,255,255,.22) 50%,transparent 51%),radial-gradient(1px 1px at 88% 44%,rgba(255,255,255,.3) 50%,transparent 51%),
  radial-gradient(1px 1px at 56% 88%,rgba(255,255,255,.2) 50%,transparent 51%),radial-gradient(900px 500px at 85% -10%,rgba(228,87,46,.10),transparent 60%);
  background-attachment:fixed}
a{color:var(--accent2);text-underline-offset:3px}
a:hover{color:var(--accent)}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
h1,h2,h3{font-family:var(--display);color:var(--ink);margin:0;line-height:1.15;text-wrap:balance}
p{margin:0}
.rail{position:fixed;inset:0 auto 0 0;width:68px;border-right:1px solid var(--line);background:color-mix(in srgb,var(--bg) 88%,transparent);
  display:flex;flex-direction:column;align-items:center;gap:6px;padding-block:calc(18px + env(safe-area-inset-top,0px)) 18px;z-index:5}
.rail .mono-mark{font:800 22px/1 var(--display);color:var(--accent);margin-bottom:14px;text-decoration:none}
.rail a.nav{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;color:var(--muted)}
.rail a.nav:hover{background:var(--card);color:var(--ink)}
.page{margin-left:68px;padding-inline:clamp(16px,4vw,56px);padding-block:40px 64px}
.wrap{max-width:1080px;margin:0 auto;display:grid;gap:64px}
@media (max-width:760px){.rail{display:none}.page{margin-left:0}}
/* hero */
.hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:28px;align-items:start;padding-top:12px}
@media (max-width:900px){.hero{grid-template-columns:1fr}}
.pill-open{display:inline-flex;align-items:center;gap:8px;font:500 13px/1 var(--body);color:var(--text);border:1px solid var(--line2);background:var(--card);padding:8px 12px;border-radius:999px}
.dot{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 3px var(--ok-soft)}
.name{font-size:clamp(44px,7vw,72px);font-weight:800;letter-spacing:-.02em;line-height:1.02;margin-top:18px}
.name span{display:block;color:var(--accent)}
.role{font:600 16px/1.5 var(--display);color:var(--accent2);margin-top:14px}
.lede{font-size:17px;color:var(--text);max-width:60ch;margin-top:12px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{font:500 12.5px/1 var(--body);color:var(--text);border:1px solid var(--line2);background:var(--card);padding:8px 11px;border-radius:8px}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:8px;font:600 14px/1 var(--body);padding:13px 18px;border-radius:12px;text-decoration:none;border:1px solid var(--line2);color:var(--ink);background:var(--card)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.btn.primary:hover{background:var(--accent2);color:#fff}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px}
.stat{padding:10px 12px;border-radius:12px;background:var(--card2)}
.stat b{display:block;font:700 26px/1.1 var(--display);color:var(--accent2);font-variant-numeric:tabular-nums}
.stat span{font-size:12.5px;color:var(--muted)}
.links{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px;margin-top:14px;padding-inline:4px}
/* sections */
section{display:grid;gap:20px;scroll-margin-top:24px}
.kicker{font:500 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.h2row{display:grid;gap:8px}
h2{font-size:clamp(24px,3.2vw,30px);font-weight:700}
.statement{display:grid;gap:12px;max-width:72ch;font-size:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;display:grid;gap:8px;align-content:start}
.card:hover{border-color:var(--line2)}
.card h3{font-size:16px;font-weight:600}
.card p{color:var(--muted);font-size:14.5px}
.num{font:500 12px/1 var(--mono);color:var(--accent2)}
.meta{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font:12.5px/1.4 var(--mono);color:var(--muted)}
.tag{font:500 11.5px/1 var(--mono);color:var(--blue);background:color-mix(in srgb,var(--blue) 12%,transparent);padding:5px 8px;border-radius:6px}
.status{display:inline-flex;align-items:center;gap:6px;font:500 11.5px/1 var(--mono);padding:5px 8px;border-radius:6px}
.status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.s-active,.s-published,.s-accepted{color:var(--ok);background:var(--ok-soft)}
.s-in-preparation,.s-submitted,.s-under-review,.s-preprint,.s-earlier{color:var(--wait);background:var(--wait-soft)}
.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}
.projects .card h3 a{color:var(--ink);text-decoration:none}
.projects .card h3 a:hover{color:var(--accent2)}
.evidence{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:13.5px}
/* track record as activity feed */
.feed{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.feed-head{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line)}
.feed-head h3{font-size:15px}
.live{display:inline-flex;align-items:center;gap:7px;font:500 12px/1 var(--mono);color:var(--ok)}
.filters{display:flex;flex-wrap:wrap;gap:6px}
.filters button{font:500 12.5px/1 var(--body);color:var(--muted);background:transparent;border:1px solid var(--line2);border-radius:999px;padding:7px 11px;cursor:pointer}
.filters button[aria-pressed="true"]{color:var(--ink);border-color:var(--accent);background:var(--accent-soft)}
.feed ol{list-style:none;margin:0;padding:0}
.feed li{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:14px;align-items:start;padding:16px 18px;border-top:1px solid var(--line)}
.feed li:first-child{border-top:0}
.ficon{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent2);font:600 11px/1 var(--mono)}
.feed h4{margin:0;font:600 15px/1.35 var(--body);color:var(--ink)}
.feed h4 a{color:var(--ink);text-decoration:none}
.feed h4 a:hover{color:var(--accent2);text-decoration:underline}
.feed .detail{color:var(--muted);font-size:14px;margin-top:3px}
.feed time{font:12.5px/1.4 var(--mono);color:var(--faint);white-space:nowrap}
@media (max-width:560px){.feed li{grid-template-columns:30px minmax(0,1fr)}.feed time{grid-column:2}.ficon{width:30px;height:30px}}
.empty{color:var(--faint)}
footer{border-top:1px solid var(--line);padding-top:18px;display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:space-between;font-size:13px;color:var(--muted)}
</style>
</head>
<body>
<nav class="rail" aria-label="Sections">
  <a class="mono-mark" href="#top" aria-label="Top">SG</a>
  ${nav.map(([id, ic, label]) => `<a class="nav" href="#${id}" title="${label}" aria-label="${label}">${svg(ic)}</a>`).join("\n  ")}
</nav>
<div class="page">
<main class="wrap" id="top">

<header class="hero">
  <div>
    <span class="pill-open"><span class="dot"></span>Independent research · open to collaboration</span>
    <h1 class="name">${esc(first)}<span>${esc(rest.join(" "))}</span></h1>
    <p class="role">${esc(p.role)}</p>
    <p class="lede">${esc(p.tagline)}</p>
    <div class="chips">${p.focus.map((f) => `<span class="chip">${esc(f.title)}</span>`).join("")}</div>
    <div class="cta">
      <a class="btn primary" href="#record">See the track record →</a>
      <a class="btn" href="#writing">Writing</a>
    </div>
  </div>
  <div>
    <div class="stats" aria-label="At a glance">
      ${stats.map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("\n      ")}
    </div>
    <nav class="links" aria-label="Profiles">${p.links.map((l) => link(l.label, l.url)).join("\n      ")}</nav>
  </div>
</header>

<section id="statement" aria-labelledby="h-statement">
  <div class="h2row"><div class="kicker">Research</div><h2 id="h-statement">What I work on</h2></div>
  <div class="statement">${p.statement.map((s) => `<p>${esc(s)}</p>`).join("\n    ")}</div>
  <div class="grid">
    ${p.focus.map((f, i) => `<div class="card"><span class="num">0${i + 1}</span><h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></div>`).join("\n    ")}
  </div>
</section>

<section id="writing" aria-labelledby="h-writing">
  <div class="h2row"><div class="kicker">Publications &amp; writing</div><h2 id="h-writing">Writing</h2></div>
  <div class="grid">
    ${p.writing.length ? p.writing.map((w) => `<div class="card">
      <div class="meta"><span class="status s-${esc(w.status.replace(/ /g, "-"))}">${esc(w.status)}</span>${w.venue ? `<span>${esc(w.venue)}</span>` : ""}${w.year ? `<span>${esc(w.year)}</span>` : ""}</div>
      <h3>${link(w.title, w.url)}</h3>
      ${w.note ? `<p>${esc(w.note)}</p>` : ""}
    </div>`).join("\n    ") : `<p class="empty">Nothing yet.</p>`}
  </div>
</section>

<section id="projects" aria-labelledby="h-projects">
  <div class="h2row"><div class="kicker">Open source</div><h2 id="h-projects">Projects</h2></div>
  <div class="projects">
    ${p.projects.map((pr) => `<div class="card">
      <div class="meta"><span class="status s-${esc(pr.status)}">${esc(pr.status)}</span><span>${esc(pr.period)}</span></div>
      <h3>${link(pr.title, pr.url)}</h3>
      <p>${esc(pr.summary)}</p>
      <div class="meta">${pr.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${pr.evidence.length ? `<div class="evidence">${pr.evidence.map((e) => link(e.label, e.url)).join("")}</div>` : ""}
    </div>`).join("\n    ")}
  </div>
</section>

<section id="record" aria-labelledby="h-record">
  <div class="h2row"><div class="kicker">Evidence</div><h2 id="h-record">Track record</h2>
    <p class="muted" style="color:var(--muted)">Dated releases, results and service, each linked to evidence where it exists. Newest first. Entries are never edited after the fact; corrections are new entries. <a href="/record.xml">Follow via feed</a>.</p></div>
  <div class="feed">
    <div class="feed-head"><h3>Activity</h3>
      <div class="filters" role="group" aria-label="Filter the track record" hidden>
        <button type="button" data-type="all" aria-pressed="true">All</button>
        ${usedTypes.map((t) => `<button type="button" data-type="${t}" aria-pressed="false">${TYPES[t]}</button>`).join("\n        ")}
      </div>
      <span class="live"><span class="dot"></span>Updated ${fmtDate(updated)}</span>
    </div>
    <ol>
      ${record.map((r) => `<li data-type="${r.type}">
        <span class="ficon" aria-hidden="true">${esc(TYPES[r.type].slice(0, 2).toUpperCase())}</span>
        <div><h4>${link(r.title, r.url)}</h4>${r.detail ? `<p class="detail">${esc(r.detail)}</p>` : ""}</div>
        <time datetime="${r.date}">${fmtDate(r.date)}</time>
      </li>`).join("\n      ")}
    </ol>
  </div>
</section>

<section id="service" aria-labelledby="h-service">
  <div class="h2row"><div class="kicker">Community</div><h2 id="h-service">Service</h2></div>
  ${p.service.length ? `<div class="grid">${p.service.map((s) => `<div class="card"><h3>${link(s.title, s.url)}</h3><p>${esc(s.period || "")}</p></div>`).join("")}</div>` : `<p class="empty">Reviewing and talks will appear here.</p>`}
</section>

<footer>
  <span>© ${updated.slice(0, 4)} ${esc(p.name)} · Research only; nothing here is investment advice.</span>
  <span><a href="https://github.com/Shreyasg13/shreyashgondane.com">Source of this page</a></span>
</footer>

</main>
</div>
<script>
(function () {
  var bar = document.querySelector(".filters"); if (!bar) return;
  bar.hidden = false;
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var t = b.getAttribute("data-type");
    bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    document.querySelectorAll(".feed li").forEach(function (li) { li.hidden = t !== "all" && li.getAttribute("data-type") !== t; });
  });
})();
</script>
</body>
</html>
`;
}
