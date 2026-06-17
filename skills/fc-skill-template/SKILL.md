---
name: fc-skill-template
description: "Template for creating new FlowCraft skills. Use as a starting point for workflows, checklists, and methodologies."
license: MIT
---

# Creating FlowCraft Skills

A complete template and guide for building new agent skills that capture workflows, methodologies, and checklists.

## Purpose

This skill serves as a template for creating new FlowCraft agent skills. It provides a complete structure for documenting workflows, checklists, or methodologies that can be invoked via slash command in Claude Code, Cursor, Windsurf, or other IDEs.

## When to Load

Use this skill as a starting point whenever you want to:
- Capture a repeatable process or checklist
- Guide users through a multi-step workflow or decision tree
- Standardize how a team approaches a particular engineering task
- Create a new skill for your project or organization

## Boundaries & Constraints

This template applies to:
- **Procedural skills**: Linear workflows with clear steps and decision points
- **Methodologies**: Established practices or frameworks (TDD, risk analysis, etc.)
- **Checklists**: Quality criteria and completion gates

This template does NOT apply to:
- Interactive tools that require back-and-forth conversation
- Skills that are primarily code generation or transformation
- Real-time data lookups or API integrations

## Step-by-Step Process

1. **Copy this directory**: `cp -r fc-skill-template fc-your-skill-name`
2. **Update the frontmatter**:
   - Change `name:` to match your directory (lowercase, hyphenated)
   - Write a clear, concise description
   - Keep `license: MIT`
3. **Replace the template sections**:
   - Purpose: What problem does this skill solve?
   - When to Load: When should a user invoke this skill?
   - Boundaries & Constraints: What's in scope? What's out?
   - Process Steps: Clear, numbered steps with decision points
   - Quality Criteria: How do you know the workflow is complete?
4. **Add code examples** for technical workflows (bash, Python, etc.)
5. **Test locally** with `/your-skill-name` in your IDE
6. **Validate** with `npx skillkit@latest validate --strict`

## Quality Criteria

Before publishing, verify:

- [ ] All placeholder text has been replaced
- [ ] Steps are clear and actionable (no vague language)
- [ ] Decision points are unambiguous
- [ ] Code examples are syntactically correct
- [ ] Frontmatter name matches directory
- [ ] No empty sections remain
- [ ] Runs `npx skillkit validate --strict` with score 80+

## Example Prompts

For a hypothetical "fc-code-review" skill:

- "Use the /fc-code-review skill to review this PR"
- "Run /fc-code-review on our new authentication logic"
- "Guide me through /fc-code-review for performance changes"

## Related Skills

- fc-case-file-conventions — Structure for investigation artifacts
- fc-blast-radius-analysis — Assess impact of code changes
- fc-git-forensics — Historical analysis of code changes

## Code Examples

### Creating a skill for a bash-based workflow:

```bash
# After copying the template directory
cp -r skills/fc-skill-template skills/fc-my-new-skill
cd skills/fc-my-new-skill

# Edit SKILL.md with your workflow
nano SKILL.md

# Test invocation locally
/fc-my-new-skill

# Validate format and quality
npx skillkit@latest validate fc-my-new-skill --strict
```

### Minimal SKILL.md frontmatter:

```yaml
---
name: fc-your-skill-name
description: "One-line description of what this skill does"
license: MIT
---
```

## How to Use This Template

1. Copy the directory: `cp -r skills/fc-skill-template skills/fc-your-skill`
2. Edit `SKILL.md` in your new directory
3. Replace "Creating FlowCraft Skills" heading with your skill name
4. Update the Purpose, When to Load, Boundaries & Constraints, Process, and Quality Criteria sections
5. Add code examples specific to your workflow
6. Remove example prompts and add your own for your skill's use case
7. Test with your skill's slash command: `/your-skill-name`
8. Run validation: `npx skillkit@latest validate fc-your-skill --strict`
9. Aim for a quality score of 80+ before publishing
