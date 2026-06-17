---
name: fc-jira-chunked-posting
description: >
  Protocol for posting large agent reports as chunked Jira comments, respecting the 32,767-character limit with revision-guard deduplication. Use when posting any RCA, patch report, design packet, or large analysis to Jira via the fc-bug-byomkesh, fc-bug-sushruta, fc-design-vishwakarma, fc-code-review-dronacharya, incident-rca-reviewer, or fc-customer-briefing-narada agents.
---

# Skill: Jira Chunked Comment Posting

When instructed to post a report as Jira comments, apply this protocol.
Jira enforces a **32,767-character limit per comment**.

## Step 0 — Detect existing report comments (revision guard)

Before posting anything, check whether this agent has already posted a report to this issue.

1. Call `getJiraIssue` for the target Jira issue.
2. Scan the `comments` array for any comment whose body starts with `**[{CHUNK_LABEL}` (using the `{CHUNK_LABEL}` for this agent — see Label reference below).
3. Also look for the summary comment: any comment whose body contains `— Posted by {AGENT_NAME}` for this agent.
4. Collect the `id` of **every** matching comment into an ordered list: `OLD_COMMENT_IDS`.

If `OLD_COMMENT_IDS` is empty → first run, skip to Step 1.
If OLD_COMMENT_IDS is non-empty → this is a **revision run**. Proceed with Steps 1 and 2 as normal (post the new summary + new chunks), then execute Step 3 to remove the old comments.

## Step 1 — Summary comment (always first)

Using `addCommentToJiraIssue`, post a concise summary as comment #1.
Required fields are defined per-agent (see agent instructions). Always include:
- A navigation hint when more chunks follow: `Full report recorded below in {N} comment(s) [{CHUNK_LABEL} 1/N … {CHUNK_LABEL} N/N]`
- Footer: `— Posted by {AGENT_NAME}`

## Step 2 — Full report (chunked)

Take the complete report markdown text. Split into chunks each ≤ **30,000 characters**:
1. Split preferably at `## ` section boundaries. If a single section > 30,000 chars, split at the nearest paragraph break before the limit.
2. Prepend each chunk: `**[{CHUNK_LABEL} {i}/{N} — {JIRA-ID}]**`
3. Append each chunk: `*(continued in next comment…)*` — on the final chunk use `*(end of report)*` instead.
4. Call `addCommentToJiraIssue` once per chunk, **sequentially**. Never batch or skip chunks.

If the full report fits within 30,000 chars, still post one labeled comment (`**[{CHUNK_LABEL} 1/1 — {JIRA-ID}]**`).

## Step 3 — Delete superseded comments (revision run only)

Only execute this step if `OLD_COMMENT_IDS` was non-empty (collected in Step 0).

After **all** new comments have been successfully posted (Step 1 + Step 2 complete), delete each old comment sequentially:

For each `comment_id` in `OLD_COMMENT_IDS`:
- Call `fetchAtlassian` with:
  - `url`: `/rest/api/3/issue/{JIRA-ID}/comment/{comment_id}`
  - `method`: `DELETE`
- Do **not** abort if a single delete fails (log the failure and continue with remaining IDs).

This ensures the new report is always visible before the old one disappears. If the agent run is interrupted between posting and deleting, stale chunks will remain but will not interfere with the new ones (they will just be old, superseded comments).

## Label reference

| Agent | {CHUNK_LABEL} |
|---|---|
| fc-bug-byomkesh | `RCA Part` |
| fc-bug-sushruta | `Patch Part` |
| fc-design-vishwakarma | `Design Packet Part` |
| incident-rca-reviewer | `Incident Review Part` |
| fc-customer-briefing-narada | `Customer Briefing Part` |
| fc-customer-briefing-narada-reviewer | `Customer Briefing Part` |

---

## Markdown Formatting Rules (CRITICAL)

The `commentBody` field is interpreted as **Markdown** by the MCP server. Follow these rules exactly.

### ✅ Supported — use these
- **Bold**: `**text**`
- *Italic*: `*text*`
- Bullet lists: `- item` (blank line before list, blank line after)
- Ordered lists: `1. item`
- Headings: `## Section` / `### Subsection`
- Inline code: `` `code` ``
- Code fences: triple backtick ` ``` ` on its own line (language tag optional)
- Horizontal rule: `---`

### ❌ Forbidden — never use these
- **Jira wiki markup** — `h2.`, `h3.`, `{code}`, `{panel}`, `||header||`, `||` pipe headers. These render as literal text, not formatting.
- **Markdown pipe tables** (`| col | col |` / `|---|---|`) — the MCP converter does **not** produce ADF table nodes; pipe characters appear as raw text.

### Converting tables to Markdown-safe format

Every table in the report **must** be converted to one of the following formats before posting:

**Option 1 — subsection + bullet list (preferred for ≤6 rows):**
```
**Section heading**
- **Row label A:** value A
- **Row label B:** value B
```

**Option 2 — numbered list with bold labels (for ordered/ranked tables):**
```
1. **Label:** description
2. **Label:** description
```

**Option 3 — sub-heading per row (for tables with long cell content):**
```
#### Row Label A
Description text for row A.

#### Row Label B
Description text for row B.
```

Apply Option 1 for most tables. Use Option 3 for matrices or comparison tables where each row has several long fields.

---

## Note

The Atlassian MCP server does not support file attachments on Jira issues. Chunked comments are the report's permanent record on the issue.

On revision runs, new chunks are posted first, then old chunks are deleted via `fetchAtlassian` DELETE. Jira records comment edits in its audit history; deleted comments are not recoverable, but the sequence (post-then-delete) guarantees the new report is always visible before the old one disappears.
