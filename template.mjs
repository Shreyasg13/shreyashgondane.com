// HTML template for the research profile. Design B, "editorial light": warm paper background, Newsreader serif headings,
// IBM Plex Sans body, IBM Plex Mono labels, a sticky profile column beside the content. Rendered by build.mjs.
export function render({ p, esc, link, fmtDate, TYPES, record, updated, usedTypes, SITE }) {
  const papers = p.writing.filter((w) => ["published", "accepted", "preprint"].includes(w.status)).length;
  const inPrep = p.writing.filter((w) => ["in preparation", "submitted", "under review"].includes(w.status)).length;
  const oss = p.projects.filter((x) => /github\.com/.test(x.url || "")).length;
  const stats = [
    papers ? [String(papers), papers === 1 ? "Publication" : "Publications"] : null,
    inPrep ? [String(inPrep), inPrep === 1 ? "Paper in preparation" : "Papers in preparation"] : null,
    [String(oss), "Open-source projects"],
    [p.years_experience || "", "Years building AI systems"],
  ].filter((s) => s && s[0]);
  const initials = p.name.split(" ").map((s) => s[0]).join("").slice(0, 2);
  const nav = [["statement", "Research"], ["writing", "Writing"], ["projects", "Projects"], ["record", "Track record"], ["service", "Service"]];

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
<meta name="theme-color" content="#F7F7F4">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: p.name, url: SITE + "/",
    description: p.tagline, sameAs: p.links.filter((l) => /^https?:/.test(l.url)).map((l) => l.url) })}</script>
<style>
:root{
  --bg:#F7F7F4; --ink:#1B1D22; --text:#2C3038; --muted:#5B6270; --label:#6A7080; --faint:#8A909B;
  --line:#DEDBD3; --line2:#D6D3CB; --chip:#E9E7E1;
  --accent:#B8431F; --accent-hover:#8F3215; --ok:#2F6B3A; --wait:#8A5A0E;
  --serif:"Newsreader",Georgia,"Times New Roman",serif; --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  color-scheme:light;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 var(--sans)}
a{color:var(--accent);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{color:var(--accent-hover)}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
h1,h2,h3{font-family:var(--serif);font-weight:600;color:var(--ink);margin:0;text-wrap:balance}
p{margin:0}
.label{font:500 12px/1.3 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--label)}
.page{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:clamp(40px,5vw,72px);
  padding:clamp(28px,5vw,72px) clamp(16px,6vw,96px)}
@media (max-width:980px){.page{grid-template-columns:1fr}}
/* profile column */
aside{display:flex;flex-direction:column;gap:22px;align-self:start;position:sticky;top:40px}
@media (max-width:980px){aside{position:static}}
.avatar{width:96px;height:96px;border-radius:50%;background:var(--chip);border:1px solid var(--line2);display:grid;place-items:center;
  font:500 34px/1 var(--serif);color:var(--muted)}
h1{font-size:clamp(44px,5vw,60px);line-height:1.02;letter-spacing:-.01em}
.role{font-size:16px;color:var(--muted)}
.tagline{font:22px/1.45 var(--serif);color:var(--ink)}
.rule{border-top:1px solid var(--line);padding-top:18px}
.links{display:flex;flex-direction:column;gap:8px;font-size:15px}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px}
.stats b{display:block;font:500 36px/1.1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}
.stats span{font-size:13px;color:var(--label)}
.toc{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:14px}
.toc a{color:var(--muted);text-decoration:none}
.toc a:hover{color:var(--accent)}
/* content */
main{display:flex;flex-direction:column;gap:56px;min-width:0}
section{display:flex;flex-direction:column;gap:14px;scroll-margin-top:28px}
h2{font-size:30px;line-height:1.2}
.prose{display:flex;flex-direction:column;gap:14px;max-width:72ch;font-size:17px;line-height:1.7}
.focus{list-style:none;margin:8px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:20px 28px}
.focus li{border-top:2px solid var(--ink);padding-top:12px;display:flex;flex-direction:column;gap:4px}
.focus .n{font:500 12px/1 var(--mono);color:var(--accent)}
.focus h3{font:600 17px/1.35 var(--sans)}
.focus p{font-size:15px;color:var(--muted);line-height:1.6}
/* writing */
.entries{display:flex;flex-direction:column}
.entry{border-top:1px solid var(--line);padding:18px 0;display:flex;flex-direction:column;gap:6px}
.entry:last-child{border-bottom:1px solid var(--line)}
.meta{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;font:500 12px/1.4 var(--mono);letter-spacing:.06em;color:var(--label)}
.status{text-transform:uppercase}
.s-published,.s-accepted,.s-active{color:var(--ok)}
.s-in-preparation,.s-submitted,.s-under-review,.s-preprint,.s-earlier{color:var(--wait)}
.entry h3{font-size:22px;line-height:1.3;font-weight:500}
.entry h3 a{color:var(--ink);text-decoration:none}
.entry h3 a:hover{color:var(--accent);text-decoration:underline}
.entry p{font-size:15px;color:var(--muted);max-width:75ch}
.more{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:14px}
.more a::after{content:" →"}
/* projects */
.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:28px}
.project{border-top:2px solid var(--ink);padding-top:12px;display:flex;flex-direction:column;gap:8px}
.project h3{font:600 18px/1.35 var(--sans)}
.project h3 a{color:var(--ink);text-decoration:none}
.project h3 a:hover{color:var(--accent);text-decoration:underline}
.project p{font-size:15px;line-height:1.6;color:var(--muted)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{font:500 11.5px/1 var(--mono);color:var(--muted);background:var(--chip);padding:5px 8px;border-radius:4px}
/* track record */
.intro{font-size:15px;color:var(--muted);max-width:75ch}
.filters{display:flex;flex-wrap:wrap;gap:6px}
.filters button{font:500 13px/1 var(--sans);color:var(--muted);background:transparent;border:1px solid var(--line2);border-radius:999px;padding:7px 12px;cursor:pointer}
.filters button[aria-pressed="true"]{color:var(--bg);background:var(--ink);border-color:var(--ink)}
.record{list-style:none;margin:0;padding:0}
.record li{display:grid;grid-template-columns:130px minmax(0,1fr);gap:18px;padding:14px 0;border-top:1px solid var(--line)}
.record li:last-child{border-bottom:1px solid var(--line)}
.record time{font:13px/1.6 var(--mono);color:var(--label);white-space:nowrap}
.record .type{display:block;font:500 11px/1.6 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
.record h4{margin:0;font:500 15.5px/1.45 var(--sans);color:var(--ink)}
.record h4 a{color:var(--ink)}
.record h4 a:hover{color:var(--accent)}
.record .detail{font-size:14.5px;color:var(--muted);margin-top:2px}
@media (max-width:560px){.record li{grid-template-columns:1fr;gap:4px}}
.empty{color:var(--faint);font-size:15px}
footer{border-top:1px solid var(--line);padding-top:18px;display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:space-between;font-size:13px;color:var(--label)}
</style>
</head>
<body>
<div class="page" id="top">

<aside aria-label="Profile">
  <div class="avatar" aria-hidden="true">${esc(initials)}</div>
  <div class="label">Research profile</div>
  <h1>${esc(p.name)}</h1>
  <p class="role">${esc(p.role)}</p>
  <p class="tagline">${esc(p.tagline)}</p>
  <nav class="links rule" aria-label="Profiles">${p.links.map((l) => link(l.label, l.url)).join("\n    ")}</nav>
  <div class="stats rule" aria-label="At a glance">
    ${stats.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("\n    ")}
  </div>
  <nav class="toc rule" aria-label="Sections">${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
</aside>

<main>

<section id="statement" aria-labelledby="h-statement">
  <h2 id="h-statement">Research statement</h2>
  <div class="prose">${p.statement.map((s) => `<p>${esc(s)}</p>`).join("\n    ")}</div>
  <ol class="focus">
    ${p.focus.map((f, i) => `<li><span class="n">0${i + 1}</span><h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></li>`).join("\n    ")}
  </ol>
</section>

<section id="writing" aria-labelledby="h-writing">
  <h2 id="h-writing">Writing</h2>
  <div class="entries">
    ${p.writing.length ? p.writing.map((w) => `<article class="entry">
      <div class="meta"><span class="status s-${esc(w.status.replace(/ /g, "-"))}">${esc(w.status)}</span>${w.venue ? `<span>${esc(w.venue)}</span>` : ""}${w.year ? `<span>${esc(w.year)}</span>` : ""}</div>
      <h3>${link(w.title, w.url)}</h3>
      ${w.note ? `<p>${esc(w.note)}</p>` : ""}
      ${w.links && w.links.length ? `<div class="more">${w.links.map((e) => link(e.label, e.url)).join("")}</div>` : ""}
    </article>`).join("\n    ") : `<p class="empty">Nothing yet.</p>`}
  </div>
</section>

<section id="projects" aria-labelledby="h-projects">
  <h2 id="h-projects">Projects</h2>
  <div class="projects">
    ${p.projects.map((pr) => `<article class="project">
      <div class="meta"><span class="status s-${esc(pr.status)}">${esc(pr.status)}</span><span>${esc(pr.period)}</span></div>
      <h3>${link(pr.title, pr.url)}</h3>
      <p>${esc(pr.summary)}</p>
      <div class="tags">${pr.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${pr.evidence.length ? `<div class="more">${pr.evidence.map((e) => link(e.label, e.url)).join("")}</div>` : ""}
    </article>`).join("\n    ")}
  </div>
</section>

<section id="record" aria-labelledby="h-record">
  <h2 id="h-record">Track record</h2>
  <p class="intro">Dated releases, results and service, each linked to evidence where it exists. Newest first; updated ${fmtDate(updated)}. Entries are never edited after the fact; corrections are new entries. <a href="/record.xml">Follow via feed</a>.</p>
  <div class="filters" role="group" aria-label="Filter the track record" hidden>
    <button type="button" data-type="all" aria-pressed="true">All</button>
    ${usedTypes.map((t) => `<button type="button" data-type="${t}" aria-pressed="false">${TYPES[t]}</button>`).join("\n    ")}
  </div>
  <ol class="record">
    ${record.map((r) => `<li data-type="${r.type}">
      <time datetime="${r.date}">${r.date}</time>
      <div><span class="type">${esc(TYPES[r.type])}</span><h4>${link(r.title, r.url)}</h4>${r.detail ? `<p class="detail">${esc(r.detail)}</p>` : ""}</div>
    </li>`).join("\n    ")}
  </ol>
</section>

<section id="service" aria-labelledby="h-service">
  <h2 id="h-service">Service</h2>
  ${p.service.length ? `<div class="entries">${p.service.map((s) => `<article class="entry"><h3>${link(s.title, s.url)}</h3>${s.period ? `<p>${esc(s.period)}</p>` : ""}</article>`).join("")}</div>` : `<p class="empty">Reviewing and talks will appear here.</p>`}
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
    document.querySelectorAll(".record li").forEach(function (li) { li.hidden = t !== "all" && li.getAttribute("data-type") !== t; });
  });
})();
</script>
</body>
</html>
`;
}
