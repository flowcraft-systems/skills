# GitHub Pages + SkillKit Marketplace Setup Checklist

Follow these steps to enable automated publishing of your skills.

## Phase 1: Initial Setup (One Time)

### ✅ GitHub Repository

- [ ] Repository is public
- [ ] Branch protection rules allow GitHub Actions (Settings → Branches)
- [ ] No `.gitignore` entries blocking `.github/workflows/`

### ✅ GitHub Pages Configuration

1. [ ] Go to **Settings → Pages**
2. [ ] Under "Source", select **GitHub Actions** (not "Deploy from a branch")
3. [ ] Under "Custom domain", enter: `skills.flowcraft.systems`
4. [ ] Click Save and wait for DNS check to pass
5. [ ] Enable **Enforce HTTPS** once DNS is verified
6. [ ] Verify your site is live at: `https://skills.flowcraft.systems`

### ✅ DNS Configuration (at your DNS provider)

Add a CNAME record pointing to GitHub Pages:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `skills` | `flowcraft-systems.github.io` |

DNS propagation can take up to 24 hours.

### ✅ Workflow Files

- [ ] `.github/workflows/publish-skills.yml` is committed and pushed
- [ ] `.skillkit/config.json` exists with correct paths
- [ ] `package.json` has scripts: `validate`, `publish`, `publish:check`

### ✅ Run First Workflow

1. [ ] Make a small commit to `main` (or create a no-op commit):
   ```bash
   git commit --allow-empty -m "chore: trigger workflow"
   git push origin main
   ```

2. [ ] Go to **Actions** tab
3. [ ] Look for "Publish Skills to GitHub Pages & SkillKit Marketplace"
4. [ ] Wait for it to complete (should be green ✅)
5. [ ] Check GitHub Pages deployment succeeded

---

## Phase 2: Verify Hosting (Test)

### ✅ Test GitHub Pages

```bash
# Replace with your actual URLs
GITHUB_PAGES_URL="https://skills.flowcraft.systems"

# Check index.json exists
curl "$GITHUB_PAGES_URL/.well-known/skills/index.json"

# You should see:
# {
#   "skills": [
#     "fc-adversarial-review",
#     "fc-blast-radius-analysis",
#     ...
#   ]
# }
```

### ✅ Test Local Installation

```bash
# Users should be able to install from your hosted location
skillkit add https://skills.flowcraft.systems

# Verify installation
skillkit list | grep fc-
```

### ✅ Confirm Skills are Discoverable

```bash
# Test individual skill
skillkit read fc-calculate-roi
```

---

## Phase 3: Marketplace Publishing (No Setup Required!)

### ✅ Submit to Marketplace

```bash
# When ready, submit for review (no auth needed!)
npm run publish:submit
```

This opens a GitHub issue for SkillKit maintainers to review. No configuration required.

### ✅ After Submission

1. [ ] GitHub issue is created automatically
2. [ ] Maintainers review your skills (usually within 24-48 hours)
3. [ ] Once approved, your skills appear in `skillkit marketplace`

### ✅ Verify Marketplace Listing

1. [ ] Visit https://skillkit.dev/marketplace
2. [ ] Search for "flowcraft"
3. [ ] Your skills should appear after approval
4. [ ] Test installation:
   ```bash
   skillkit add flowcraft-systems/skills
   ```

---

## Phase 4: Ongoing Operations

### ✅ Development Workflow

For each update:

```bash
# 1. Make changes
git add .
git commit -m "feat: description"

# 2. Validate locally (optional but recommended)
npm run validate

# 3. Push to trigger automated workflow
git push origin main

# 4. GitHub Actions handles everything:
#    - Validates skills
#    - Generates .well-known/
#    - Deploys to Pages
#    - Updates marketplace
```

### ✅ Version Updates

For releases, update `package.json`:

```bash
npm version minor  # or major/patch

# This automatically:
# - Updates package.json version
# - Creates git tag
# - Pushes to origin

# Marketplace auto-detects version bump within 5 minutes
```

---

## Phase 5: Monitoring

### ✅ Check Deployment Status

**GitHub Actions Dashboard:**
- https://github.com/`<you>`/`<repo>`/actions

**GitHub Pages Status:**
- https://github.com/`<you>`/`<repo>`/deployments
- Live site: https://skills.flowcraft.systems

**SkillKit Marketplace:**
- https://skillkit.dev/marketplace?search=flowcraft

---

## Troubleshooting

### Pages deployment failed
- [ ] Check Actions logs for error details
- [ ] Verify Settings → Pages is configured correctly
- [ ] Ensure `.github/workflows/publish-skills.yml` is committed

### Skills not discovered
- [ ] Verify `.skillkit/config.json` exists
- [ ] Check that `skills/` directory path is correct
- [ ] Run locally: `npx skillkit@latest publish .`

### Marketplace not updating
- [ ] Verify `SKILLKIT_API_KEY` secret is set
- [ ] Check Actions logs for API errors
- [ ] Confirm marketplace submission was actually triggered

### Version not auto-detecting
- [ ] Wait 5+ minutes (marketplace needs time to sync)
- [ ] Verify you used `npm version` to bump version
- [ ] Check that commit was pushed to main

---

## Quick Reference URLs

| Resource | URL |
|----------|-----|
| This Repo | https://github.com/flowcraft-systems/skills |
| GitHub Pages | https://skills.flowcraft.systems |
| Skills Registry | https://skills.flowcraft.systems/.well-known/skills/index.json |
| SkillKit Marketplace | https://skillkit.dev/marketplace?search=flowcraft |
| SkillKit Docs | https://github.com/rohitg00/skillkit |

---

## Done? 

Once all checkboxes are complete:

1. ✅ Push this checklist to the repo
2. ✅ Create a release or tag
3. ✅ Announce your skills on social media / community channels
4. ✅ Monitor Actions dashboard for any issues

**Users can now install your skills with:**
```bash
skillkit add https://skills.flowcraft.systems
# OR
skillkit add flowcraft-systems/skills
```

