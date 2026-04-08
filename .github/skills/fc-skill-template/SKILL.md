---
name: fc-skill-template
description: >
  Template for creating new Copilot agent skills. Use this as a starting point for any workflow, checklist, or methodology you want to turn into a reusable skill. Supports slash command invocation for testing and iteration.
license: MIT
---

# Skill Template

## Purpose

This skill serves as a template for creating new Copilot agent skills. It provides a structure for documenting workflows, checklists, or methodologies that can be invoked via slash command.

## When to Load

Use this skill as a starting point whenever you want to:
- Capture a repeatable process or checklist
- Guide Copilot or teammates through a multi-step workflow
- Test skill invocation via `/skill-template` slash command

## Step-by-Step Process

1. **Define the workflow:** Clearly describe each step in the process.
2. **Identify decision points:** Note any branching logic or choices.
3. **List quality criteria:** Specify what makes the process complete or successful.
4. **Iterate:** Test the skill, refine steps, and clarify as needed.

## Quality Criteria / Completion Checks

- All steps are clearly described and actionable
- Decision points are unambiguous
- Completion criteria are explicit

## Example Prompts

- "/skill-template"
- "Use the /skill-template skill to guide me through a new workflow."

## Related Skills

- agent-customization
- (Add related or derivative skills here)

---

**How to use:**
- Copy this directory and rename it for your new skill.
- Edit SKILL.md, replacing all template text with your workflow.
- Use hyphens for the directory and skill name, and ensure the `name` in the frontmatter matches the directory.
- Test with `/skill-name` in Copilot CLI or chat.
