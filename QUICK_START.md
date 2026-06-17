# Quick Start — GitHub Pages + SkillKit Marketplace

## TL;DR

```bash
# 1. Enable GitHub Pages (Settings → Pages, choose gh-pages branch)
# 2. Push the workflow (already committed in .github/workflows/)
# 3. Done! Your skills are now:
#    - Hosted at: https://skills.flowcraft.systems
#    - Ready to submit to marketplace

# To submit to marketplace:
npm run publish:submit
```

## 3-Minute Setup

### 1. Enable GitHub Pages ⚙️
- Go to **Settings → Pages**
- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/` (root)
- Save

### 2. Push to Main 🚀
```bash
git push origin main
```

GitHub Actions automatically:
- Validates all your skills
- Generates `.well-known/skills/`
- Deploys to GitHub Pages

### 3. Verify It Works ✅
```bash
# Wait ~1 minute, then test:
curl https://skills.flowcraft.systems/.well-known/skills/index.json

# Or install locally:
skillkit add https://skills.flowcraft.systems
```

## Submit to Marketplace 📦

When ready, submit for review (no auth needed):

```bash
npm run publish:submit
```

This opens a GitHub issue in the SkillKit repo. Maintainers review and approve, then your skills appear in `skillkit marketplace`.

## Distribution Channels

After setup, users can install your skills via:

| Method | Command |
|--------|---------|
| **GitHub Pages** | `skillkit add https://skills.flowcraft.systems` |
| **SkillKit Marketplace** | `skillkit add flowcraft-systems/skills` (after approval) |

## File Structure

```
.github/workflows/publish-skills.yml  ← Handles everything
.skillkit/config.json                   ← Tells skillkit where to find skills
skills/                                 ← Your skills here
  fc-calculate-roi/SKILL.md
  fc-blast-radius-analysis/SKILL.md
  ... (18 skills total)
```

## Commands for Developers

```bash
npm run validate      # Check all skills are valid
npm run publish       # Generate .well-known/ locally
npm run publish:submit # Submit to SkillKit marketplace
```

## What Gets Generated?

After workflow runs, `.well-known/` contains:

```
.well-known/
  skills/
    index.json                          # Manifest (RFC 8615)
    fc-calculate-roi/SKILL.md
    fc-blast-radius-analysis/SKILL.md
    ... (all 18 skills)
```

This is deployed to GitHub Pages automatically. Users discover and install from there.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pages not showing up | Wait 2+ minutes, refresh. Check Actions tab for errors. |
| Skills not discovered | Run `npm run validate` locally. Check `.skillkit/config.json`. |
| Can't find .well-known | Check: `https://skills.flowcraft.systems/.well-known/skills/index.json` |

## Resources

- [Full Setup Guide](./SKILLKIT_HOSTING.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)
- [Publishing Guide](./PUBLISHING_GUIDE.md)
- [SkillKit Docs](https://github.com/rohitg00/skillkit)

---

**That's it!** Your skills are now discoverable and installable. 🎉
