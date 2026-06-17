---
name: fc-chunked-posting
description: Protocol for posting large agent reports to issue trackers or documentation systems that enforce per-comment or per-mess
license: MIT
---

# Skill: Chunked Report Posting

When instructed to post a large report to an issue tracker or communication channel,
apply this protocol to stay within per-entry character limits.

## Step 0 — Detect Existing Report (Revision Guard)

Before posting anything, check whether this agent has already posted a report to this issue.

1. Retrieve the existing comments or entries on the target issue.
2. Scan for any entry whose body starts with `**[{CHUNK_LABEL}` for this agent/report type.
3. Also look for a summary entry containing `— Posted by {AGENT_NAME}` for this agent.
4. Collect the IDs of all matching entries into `OLD_ENTRY_IDS`.

- If `OLD_ENTRY_IDS` is empty → first run, skip to Step 1.
- If non-empty → revision run: post new content first (Steps 1 & 2), then remove old entries (Step 3).

## Step 1 — Summary Entry (Always First)

Post a concise summary as the first entry. Always include:
- A navigation hint when more chunks follow: `Full report recorded below in {N} comment(s) [{CHUNK_LABEL} 1/N … {CHUNK_LABEL} N/N]`
- Footer: `— Posted by {AGENT_NAME}`

## Step 2 — Full Report (Chunked)

1. Determine the character limit per entry for your target system (e.g., 30,000 chars as a safe default below most limits).
2. Split the complete report at `## ` section boundaries where possible. If a single section exceeds the limit, split at the nearest paragraph break before the limit.
3. Prepend each chunk: `**[{CHUNK_LABEL} {i}/{N} — {ISSUE-ID}]**`
4. Append each chunk: `*(continued in next comment…)*` — on the final chunk use `*(end of report)*` instead.
5. Post chunks sequentially. Never batch or skip.

If the full report fits within the limit, still post one labeled chunk (`**[{CHUNK_LABEL} 1/1 — {ISSUE-ID}]**`).

## Step 3 — Remove Superseded Entries (Revision Run Only)

Only execute this step if `OLD_ENTRY_IDS` was non-empty.

After all new entries are successfully posted, delete each old entry sequentially.
Do not abort if a single deletion fails — log the failure and continue.

This ensures the new report is always visible before the old one disappears.

## Chunk Label Convention

Choose a label that identifies the report type clearly. Keep it short (2-4 words):

| Report Type | Suggested {CHUNK_LABEL} |
|---|---|
| RCA report | `RCA Part` |
| Patch report | `Patch Part` |
| Design packet | `Design Packet Part` |
| Incident review | `Incident Review Part` |
| Customer briefing | `Customer Briefing Part` |
| Code review | `Code Review Part` |
| Test design | `Test Design Part` |

## Formatting Rules

Use only formatting your target system renders correctly. When in doubt, prefer plain Markdown:

### Safe Markdown (works most places)
- **Bold**: `**text**`
- *Italic*: `*text*`
- Bullet lists: `- item` (blank line before and after)
- Ordered lists: `1. item`
- Headings: `## Section` / `### Subsection`
- Inline code: `` `code` ``
- Code fences: triple backtick on its own line
- Horizontal rule: `---`

### Converting Tables to Safe Format

If your target system does not render Markdown pipe tables, convert them to one of:

**Option 1 — Subsection + bullet list (≤6 rows):**
```
**Section heading**
- **Row label A:** value A
- **Row label B:** value B
```

**Option 2 — Numbered list with bold labels (ordered/ranked tables):**
```
1. **Label:** description
2. **Label:** description
```

**Option 3 — Sub-heading per row (tables with long cell content):**
```
#### Row Label A
Description text for row A.

#### Row Label B
Description text for row B.
```

Apply Option 1 for most tables. Use Option 3 for matrices or comparison tables where each row has several long fields.
