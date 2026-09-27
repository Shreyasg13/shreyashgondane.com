# shreyashgondane.com

Research profile of Shreyash Gondane. Static HTML built from one data file and served by GitHub Pages.

## Update it (about 2 minutes)

1. Edit `profile.json`.
2. Run `node build.mjs` (rebuilds `index.html` and the `record.xml` feed; it refuses bad dates, unknown types or statuses).
3. Commit and push. The site updates within a minute.

A GitHub check (`.github/workflows/check.yml`) fails if you forget step 2.

## What goes where

| You did... | Add to | Example `type` / `status` |
|---|---|---|
| Shipped a release, a benchmark, a dataset | `record` (top) | `release`, `benchmark`, `dataset`, `open-source` |
| Posted a preprint / submitted / got accepted | `writing` (update `status`) **and** a `record` entry | `in preparation` → `submitted` → `under review` → `accepted` / `published`; record type `preprint` or `paper` |
| Reviewed for a conference or workshop | `service` **and** a `record` entry | record type `review` |
| Gave a talk | `record` | `talk` |
| Got cited, featured or an award | `record` | `press`, `award` |
| Created ORCID / Scholar / OpenReview / Hugging Face | `links` | |

## Rules that keep it credible

- **Only real things, with dates.** Every record entry needs a date and, whenever it exists, an evidence link (release, paper, PR, dataset, review acknowledgement).
- **Never delete or back-date entries.** Fix mistakes with a new entry. The record is only convincing because it is honest.
- **Keep it non-commercial.** No services, prices, consulting offers or client lists.
- **Numbers need sources.** Any result you state must link to where it can be checked.

## Monthly habit (15 minutes)

- Add everything you shipped, submitted, reviewed or presented this month.
- Move writing statuses forward.
- Add new profile links as they come.
- Save evidence you may need later (acceptance emails, reviewer invitations, citation screenshots) in a private folder.
