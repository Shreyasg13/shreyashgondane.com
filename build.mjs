// Builds index.html (design.html with the track record filled in from profile.json) and record.xml (Atom feed).
// Edit the page itself in design.html; add track-record entries only in profile.json.
//   node build.mjs          write the files
//   node build.mjs --check  exit 1 if the committed files are out of date (used by the GitHub check)
import fs from "node:fs";

const SITE = "https://shreyashgondane.com";
const p = JSON.parse(fs.readFileSync(new URL("./profile.json", import.meta.url), "utf8"));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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

const li = (r) => {
  const cell = (w, size, color, text) => `<span style="flex: 0 0 ${w}; font-family: 'IBM Plex Mono', monospace; font-size: ${size}; color: ${color}">${text}</span>`;
  const title = r.url
    ? `<a href="${esc(r.url)}" style="flex: 1 1 420px; min-width: 0; color: #16181D; font-size: 15px">${esc(r.title)}</a>`
    : `<span style="flex: 1 1 420px; min-width: 0; font-size: 15px">${esc(r.title)}</span>`;
  return `<li style="display: flex; flex-wrap: wrap; gap: 8px 28px; padding: 18px 0; border-bottom: 1px solid #DCDAD2">${cell("110px", "13px", "#5A5F6B", r.date)}${cell("110px", "12px", "var(--accent)", esc(TYPES[r.type]).toUpperCase())}${title}</li>`;
};
const design = fs.readFileSync(new URL("./design.html", import.meta.url), "utf8");
const marker = /<!--RECORD-->[\s\S]*?<!--\/RECORD-->/;
if (!marker.test(design)) { console.error("design.html lacks the <!--RECORD--> ... <!--/RECORD--> block"); process.exit(1); }
const html = design.replace(marker, () => `<!--RECORD-->\n${record.map(li).join("\n")}\n<!--/RECORD-->`);

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
