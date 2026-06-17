# SkillKit Hosting & Marketplace Setup

This guide covers hosting your skills on GitHub Pages and publishing to the SkillKit marketplace.

## 1. GitHub Pages Setup

### Enable GitHub Pages

1. Go to **Settings → Pages** (in your GitHub repo)
2. Under "Source", select **GitHub Actions**
3. Under "Custom domain", enter `skills.flowcraft.systems`
4. Save and wait for DNS check to pass
5. Enable **Enforce HTTPS**

Also add a DNS CNAME record at your DNS provider:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `skills` | `flowcraft-systems.github.io` |

> Your skills will be available at: `https://skills.flowcraft.systems`

### Verify Hosting

The GitHub Actions workflow automatically:
- Validates all skills
- Generates `.well-known/skills/` structure
- Deploys via GitHub Actions Pages
- Publishes at: `https://skills.flowcraft.systems/.well-known/skills/index.json`

## 2. Install Skills from Your Hosting

Once GitHub Pages is live, users can install your skills with:

```bash
# Auto-discovers from /.well-known/skills/index.json
skillkit add https://skills.flowcraft.systems
```

## 3. SkillKit Marketplace Publishing

Publishing to the marketplace is simple — no auth required. It opens a GitHub issue for maintainers to review.

### Submit to Marketplace

```bash
# Make sure your local repo is up-to-date
git pull origin main

# Submit for review (opens a GitHub issue automatically)
npx skillkit@latest publish submit
```

This will:
1. Open your default browser to create a GitHub issue in the SkillKit repo
2. Include your skill manifest for review
3. Queue your skills for inclusion in the marketplace

### That's it!

Once approved by maintainers:
- Your skills appear in `skillkit marketplace`
- Users can install with: `skillkit install flowcraft-systems/skills`
- Auto-discovered from your GitHub Pages `.well-known/` URL

## 4. Marketplace Publishing Workflow

### First-Time Submission

```bash
npx skillkit@latest publish submit . \
  --name "flowcraft-systems/skills" \
  --dry-run
```

Review the submission details, then remove `--dry-run` to publish.

### Updates & Revisions

The marketplace automatically detects version bumps in `package.json`:

```json
{
  "version": "2.0.1"  // Increment this for updates
}
```

When you push a version bump:
1. GitHub Actions validates and generates `.well-known/`
2. Deploys to GitHub Pages
3. Marketplace auto-discovers the update

### Marketplace URL

Once published, users can discover your skills at:
- `https://skillkit.dev/marketplace?search=flowcraft`
- Direct: `skillkit add flowcraft-systems/skills`

## 5. Workflow Structure

```
Push to main
    ↓
GitHub Actions triggered
    ├─ Validate all skills (--strict)
    ├─ Generate .well-known/
    ├─ Deploy to GitHub Pages
    └─ Submit to marketplace (if API key set)
    ↓
Users install:
  skillkit add https://skills.flowcraft.systems
  OR
  skillkit add flowcraft-systems/skills
```

## 6. Monitoring & Troubleshooting

### Check Deployment Status

Go to **Actions** tab in your repo to see:
- Validation results
- Build logs
- Pages deployment status

### Common Issues

| Issue | Solution |
|-------|----------|
| Pages not deploying | Check Settings → Pages, ensure `gh-pages` branch exists |
| Skills not discovered | Verify `.skillkit/config.json` exists with correct `skills_dir` |
| Validation fails | Run `npx skillkit@latest validate --all --strict --verbose` locally |
| Marketplace not updating | Confirm `SKILLKIT_API_KEY` is set in repo secrets |

## 7. File Structure

```
.github/workflows/publish-skills.yml   ← Automation
.skillkit/config.json                   ← SkillKit config
skills/                                 ← Your skills
  fc-calculate-roi/
    SKILL.md
  fc-blast-radius-analysis/
    SKILL.md
  ...
package.json                            ← Version source of truth
```

## 8. Next Steps

1. **Push this workflow** to your repo
2. **Enable GitHub Pages** (Settings → Pages)
3. **Add SKILLKIT_API_KEY** secret (for automated marketplace publishing)
4. **Push a commit** to trigger the workflow
5. **Verify**: Check Actions tab → Deployments tab → GitHub Pages URL

## Resources

- [SkillKit Docs](https://github.com/rohitg00/skillkit)
- [GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- `.well-known` standard: [RFC 8615](https://tools.ietf.org/html/rfc8615)
