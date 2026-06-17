---
name: fc-calculate-roi
description: >
  Scan local case files (.flowcraft/case-files/) and ROI telemetry
  (.flowcraft/telemetry/sessions/) to produce a TUI-style ASCII ROI summary
  for a specified time window. Use when asked to summarise productivity, show
  what AI delivered this week or month, or calculate ROI for any period.
  Triggers: "calculate ROI", "roi for last week", "what did AI deliver",
  "productivity summary", "show my ROI", "/fc-calculate-roi",
  "how much did we save", "weekly ROI", "monthly ROI".
argument-hint: 'Time window — e.g. "last week", "last 30 days", "this month", "Apr 1–Apr 24"'
---

# Skill: FC Calculate ROI

Scan the local `.flowcraft/` directory and produce a structured, TUI-style ROI
summary for a given time window. No cloud account required — all data is read
from files the AI agents already wrote on your machine.

## When to load this skill

Load immediately when the user asks any of:

- `/fc-calculate-roi [window]`
- "Calculate ROI for last week"
- "What did AI deliver this month?"
- "Show my productivity summary"
- "How many hours did we save this week?"
- "ROI summary for [any time period]"

Do NOT trigger for questions about how to set up FlowCraft or how to install
the CLI.

---

## Step 1 — Resolve the time window

Parse the user's input into a concrete `[start_date, end_date]` range (both
inclusive, `YYYY-MM-DD` format). Use today's date as the anchor.

| User input | Resolved range |
|---|---|
| `"last week"` / `"last 7 days"` | today−7d → today |
| `"this week"` | Monday of current week → today |
| `"last month"` / `"last 30 days"` | today−30d → today |
| `"this month"` | first of current month → today |
| `"yesterday"` | yesterday → yesterday |
| `"today"` | today → today |
| ISO date range or natural range | parse directly |

If no window is given, default to **last 7 days** and note the assumption in
your output.

---

## Step 2 — Scan case files

Search for all markdown files matching:

```
.flowcraft/case-files/**/*.md
```

For each file:

1. **Extract the date** — find the header line `**Date:** YYYY-MM-DD`. Skip
   the file if this line is absent or the date falls outside the window.

2. **Extract metadata**:
   - `**Agent:**` — the agent slug (e.g. `design-sherpa`)
   - `**Complexity:**` — `HIGH`, `MEDIUM`, or `LOW`
   - `**Ticket:**` — ticket ID or `N/A`
   - Slug — derive from the directory name (e.g.
     `2026-04-17--PROJ-42--oauth-refresh` → `oauth-refresh`)

3. **Extract ROI** — find the ROI table. Accept either of these headings:
   - `## ROI Estimate`
   - `## ROI Summary`

   Parse the `| Total |` row:
   ```
   | Total  | ~X h | ~Y min |
   ```
   - `manual_hours` = X (float)
   - `agent_minutes` = Y (float)
   - `hours_saved` = max(0, manual_hours − agent_minutes / 60)

   If no ROI table is found, record the session with agent/date but mark
   `hours_saved` as `null` and `roi_data_missing: true`.

---

## Step 3 — Scan session JSON

Search for all JSON files matching:

```
.flowcraft/telemetry/sessions/*.json
```

For each file:

1. Parse the JSON. Skip silently if it is malformed; increment a
   `skipped_count`.

2. **Normalise the timestamp** — the `timestamp_utc` field may use dashes
   instead of colons in the time portion (e.g. `2026-04-04T14-30-00Z`).
   Normalise to `2026-04-04T14:30:00Z` before comparison.

3. **Filter by date** — derive `YYYY-MM-DD` from the normalised timestamp.
   Skip if outside the window.

4. **Extract fields**:
   - `agent_name` — may be a full tool name (`"GitHub Copilot"`); map to a
     readable display name
   - `task_type` — one of the 9 vocabulary values
   - `manual_hours_equivalent` → `manual_hours`
   - `agent_minutes`
   - `session_summary`
   - `hours_saved` = max(0, manual_hours_equivalent − agent_minutes / 60)

---

## Step 4 — Deduplicate

If a case file and a session JSON appear to cover the same session (same
calendar date AND same agent), prefer the **case file** entry and discard the
JSON entry. Increment `dedup_count` for transparency.

---

## Step 5 — Aggregate

Compute across all qualifying entries (excluding those with `roi_data_missing`
for the numeric totals):

| Metric | Formula |
|---|---|
| `total_manual_hours` | sum of all `manual_hours` |
| `total_agent_minutes` | sum of all `agent_minutes` |
| `total_agent_hours` | `total_agent_minutes / 60` |
| `total_hours_saved` | sum of all `hours_saved` |
| `roi_ratio` | `total_manual_hours / total_agent_hours` (round to 1 dp) |
| `session_count` | total qualifying entries (including missing-ROI ones) |
| `case_file_count` | entries sourced from case files |
| `json_count` | entries sourced from session JSON |

Also compute a per-agent breakdown:

| Column | Value |
|---|---|
| `agent` | agent slug or name |
| `hours_saved` | sum for that agent |
| `session_count` | count for that agent |

Sort per-agent rows by `hours_saved` descending.

Identify the **top session** — the single entry with the highest
`hours_saved`.

---

## Step 6 — Render the TUI summary

Render the following ASCII box. Pad values so columns align. Use `h` for
hours, `min` for minutes.

```
┌──────────────────────────────────────────────────────────┐
│  ROI Summary — {window_label} · {start_date}–{end_date}  │
├──────────────────────────────────────────────────────────┤
│  Sessions:     {session_count}  ({case_file_count} case files · {json_count} session JSON)  │
│  Manual equiv: {total_manual_hours}h                     │
│  Agent time:   {total_agent_hours}h  ({total_agent_minutes} min)  │
│  Hours saved:  {total_hours_saved}h                      │
│  ROI ratio:    {roi_ratio}×                              │
├──────────────────────────────────────────────────────────┤
│  By agent                          hours    sessions     │
│  ────────────────────────────────────────────────────    │
│  {agent_1}                         {h_1}h   {n_1}       │
│  {agent_2}                         {h_2}h   {n_2}       │
│  ...                                                     │
├──────────────────────────────────────────────────────────┤
│  Top session                                             │
│  {agent} · {date} · {slug}                               │
│  {hours_saved}h saved in {agent_minutes} min  ({ratio}×) │
└──────────────────────────────────────────────────────────┘
(Scanned {case_file_count} case files + {json_count} session JSON · .flowcraft/)
```

Omit the "Top session" block if `session_count` is 0.

If `skipped_count > 0`, append a note below the box:
```
Note: {skipped_count} malformed session JSON file(s) skipped.
```

If any entries have `roi_data_missing: true`, append:
```
Note: {missing_count} session(s) had no ROI table — counted in sessions but
      excluded from hour totals.
```

---

## Edge cases

### No files found in window

```
No sessions found in {window_label} ({start_date}–{end_date}).

To start generating ROI data, run any agent task (code review, bug
investigation, architecture design, etc.) — the agent will write a case file
to .flowcraft/case-files/ automatically.

  Install the skills CLI:
    npx @flowcraft.systems/skills install
```

### `.flowcraft/` directory does not exist

```
No .flowcraft/ directory found in this workspace.

To start tracking ROI locally, run:
  npx @flowcraft.systems/skills install

Then ask any AI agent to complete a task — it will write structured case files
that this skill can summarise.
```

### Partial data (some agents missing ROI tables)

Render the box with available data. Note the missing entries at the bottom as
described above.

---

## Example invocations

```
/fc-calculate-roi for the last week
/fc-calculate-roi last 30 days
/fc-calculate-roi this month
/fc-calculate-roi Apr 1–Apr 24 2026
fc-calculate-roi  ← defaults to last 7 days
```
