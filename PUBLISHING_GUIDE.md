# Publishing Guide — Quick Reference

## For Developers

### Validate Skills Locally
```bash
npm run validate
```

### Generate .well-known Structure
```bash
npm run publish
```
Output: `.well-known/` directory (ready for hosting)


---

## For Maintainers

### Full Publishing Workflow

#### 1. Make your changes
```bash
# Edit skills in skills/fc-*/SKILL.md
# Or update package.json version
git add .
git commit -m "feat: update skills"
```

#### 2. Validate & Test Locally
```bash
npm run validate      # Validate all skills
npm run publish       # Generate .well-known
npm run publish:check # Test marketplace submission
```

#### 3. Push to GitHub
```bash
git push origin main
```

GitHub Actions automatically:
- ✅ Validates all skills
- ✅ Generates `.well-known/` 
- ✅ Deploys to GitHub Pages
- ⚠️ Prepares marketplace submission (manual confirmation needed)

#### 4. Verify Deployment
- **GitHub Pages**: https://skills.flowcraft.systems
- **Actions**: https://github.com/<username>/<repo-name>/actions

#### 5. Submit to Marketplace (No Auth Required)
```bash
npm run publish:submit
```

This opens a GitHub issue for SkillKit maintainers to review. Once approved, your skills appear in the marketplace automatically.

---

## Distribution Channels

| Channel | URL | Command |
|---------|-----|---------|
| **GitHub Pages** | `https://skills.flowcraft.systems` | `skillkit add https://skills.flowcraft.systems` |
| **SkillKit Marketplace** | `skillkit.dev/marketplace` | `skillkit add flowcraft-systems/skills` |
| **Local Directory** | `.well-known/` | Manual hosting |

---

## Version Bumping

Marketplace auto-detects updates based on version in `package.json`:

```bash
# Update version
npm version minor  # or major/patch

# Publish
git push origin main
```

Marketplace will auto-discover the new version within ~5 minutes.

---

## Troubleshooting

### Skills not validating?
```bash
npm run validate -- --verbose
```

### .well-known not generating?
```bash
# Check config
cat .skillkit/config.json

# Check skills exist
ls -la skills/*/SKILL.md
```

### Pages deployment stuck?
- Check Actions tab for errors
- Verify gh-pages branch exists
- Go to Settings → Pages, re-confirm settings

### Marketplace submission failing?
```bash
npm run publish:check -- --verbose
```

---

## Files to Know

| File | Purpose |
|------|---------|
| `package.json` | Version source of truth |
| `.skillkit/config.json` | SkillKit discovery config |
| `.github/workflows/publish-skills.yml` | CI/CD automation |
| `skills/*/SKILL.md` | Individual skill definitions |
| `.well-known/skills/index.json` | Generated registry (do not edit) |

---

## Support

- 📚 [SkillKit Docs](https://github.com/rohitg00/skillkit)
- 📖 [Full Hosting Guide](./SKILLKIT_HOSTING.md)
- 🔗 [FlowCraft Website](https://flowcraft.systems)
