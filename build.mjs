// Builds index.html and record.xml (Atom feed of the track record) from profile.json.
//   node build.mjs          write the files
//   node build.mjs --check  exit 1 if the committed files are out of date (used by the GitHub check)
import fs from "node:fs";
import { render } from "./template.mjs";

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

const html = render({ p, esc, link, fmtDate, TYPES, record, updated, usedTypes, SITE });

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
