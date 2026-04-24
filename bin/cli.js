#!/usr/bin/env node
'use strict';

const path     = require('path');
const fs       = require('fs');
const readline = require('readline');

// ─── constants ───────────────────────────────────────────────────────────────

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PKG          = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
const AGENTS_SRC   = path.join(PACKAGE_ROOT, '.github', 'agents');
const SKILLS_SRC   = path.join(PACKAGE_ROOT, '.github', 'skills');

const TARGETS = {
  copilot: { label: 'GitHub Copilot', dir: '.github' },
  claude:  { label: 'Claude Code',    dir: '.claude'  },
  both:    { label: 'Both',           dir: null        },
};

// ─── terminal colours (no deps) ──────────────────────────────────────────────

const isTTY = process.stdout.isTTY;
const c = {
  reset:  isTTY ? '\x1b[0m'  : '',
  bold:   isTTY ? '\x1b[1m'  : '',
  green:  isTTY ? '\x1b[32m' : '',
  yellow: isTTY ? '\x1b[33m' : '',
  cyan:   isTTY ? '\x1b[36m' : '',
  red:    isTTY ? '\x1b[31m' : '',
  dim:    isTTY ? '\x1b[2m'  : '',
  magenta: isTTY ? '\x1b[35m' : '',
  up:     isTTY ? '\x1b[A'   : '',
  clearLine: isTTY ? '\x1b[2K' : '',
  hide:   isTTY ? '\x1b[?25l' : '',
  show:   isTTY ? '\x1b[?25h' : '',
};

function ok(msg)   { process.stdout.write(`${c.green}✔${c.reset}  ${msg}\n`); }
function warn(msg) { process.stderr.write(`${c.yellow}⚠${c.reset}  ${msg}\n`); }
function info(msg) { process.stdout.write(`${c.cyan}ℹ${c.reset}  ${msg}\n`); }
function err(msg)  { process.stderr.write(`${c.red}✖${c.reset}  ${msg}\n`); }
function dim(msg)  { process.stdout.write(`${c.dim}${msg}${c.reset}\n`); }

// ─── TUI: interactive selector ───────────────────────────────────────────────

/**
 * Arrow-key / number-key menu.  Falls back to numbered prompt on non-TTY.
 * Returns a Promise<string> with the chosen key from `options`.
 */
function selectMenu(title, options) {
  // options = [{ key, label, hint }]
  if (!isTTY || !process.stdin.isTTY) {
    return selectMenuFallback(title, options);
  }
  return new Promise((resolve) => {
    let idx = 0;

    function render() {
      // Move cursor up to re-draw (except first draw)
      for (let i = 0; i < options.length; i++) {
        process.stdout.write(`${c.up}${c.clearLine}`);
      }
      for (let i = 0; i < options.length; i++) {
        const o = options[i];
        const arrow   = i === idx ? `${c.cyan}❯${c.reset}` : ' ';
        const label   = i === idx ? `${c.bold}${o.label}${c.reset}` : `${c.dim}${o.label}${c.reset}`;
        const hint    = o.hint ? `  ${c.dim}${o.hint}${c.reset}` : '';
        process.stdout.write(` ${arrow} ${label}${hint}\n`);
      }
    }

    process.stdout.write(`\n${c.bold}${title}${c.reset}\n${c.dim}  Use ↑↓ arrows, then Enter (or press 1-${options.length})${c.reset}\n`);
    // Initial draw placeholder lines
    for (const o of options) {
      process.stdout.write(`\n`);
    }
    render();
    process.stdout.write(c.hide);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onKey);
      process.stdout.write(c.show);
    }

    function onKey(key) {
      if (key === '\u001b[A') { idx = (idx - 1 + options.length) % options.length; render(); return; } // up
      if (key === '\u001b[B') { idx = (idx + 1) % options.length; render(); return; }                   // down
      if (key === '\r' || key === '\n') { cleanup(); resolve(options[idx].key); return; }                // enter
      if (key === '\u0003') { cleanup(); process.exit(130); return; }                                    // ctrl+c
      // Number keys 1-9
      const num = parseInt(key, 10);
      if (num >= 1 && num <= options.length) { idx = num - 1; render(); cleanup(); resolve(options[idx].key); return; }
    }

    process.stdin.on('data', onKey);
  });
}

/** Non-interactive fallback (piped stdin, CI, etc.) */
function selectMenuFallback(title, options) {
  return new Promise((resolve, reject) => {
    process.stdout.write(`\n${title}\n`);
    options.forEach((o, i) => {
      const hint = o.hint ? `  (${o.hint})` : '';
      process.stdout.write(`  ${i + 1}) ${o.label}${hint}\n`);
    });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`\nEnter choice [1-${options.length}]: `, (answer) => {
      rl.close();
      const num = parseInt(answer.trim(), 10);
      if (num >= 1 && num <= options.length) {
        resolve(options[num - 1].key);
      } else {
        reject(new Error('Invalid selection'));
      }
    });
  });
}

// ─── file utilities ──────────────────────────────────────────────────────────

/**
 * Recursively copy a directory tree.
 * Returns { copied, skipped } counts.
 *
 * @param {object} opts
 * @param {boolean} opts.force       - overwrite existing files
 * @param {boolean} opts.dryRun      - don't write anything
 * @param {function} opts.transform  - (content, srcPath) => newContent | null
 * @param {function} opts.renameFn   - (filename) => newFilename | null
 */
function copyDirSync(src, dest, { force = false, dryRun = false, transform = null, renameFn = null } = {}) {
  const results = { copied: 0, skipped: 0 };

  function walk(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath  = path.join(srcDir, entry.name);
      if (entry.isDirectory()) {
        const destSubDir = path.join(destDir, entry.name);
        if (!dryRun) fs.mkdirSync(destSubDir, { recursive: true });
        walk(srcPath, destSubDir);
      } else {
        const destName = renameFn ? renameFn(entry.name) : entry.name;
        if (!destName) continue; // skip file
        const destPath = path.join(destDir, destName);
        const rel    = path.relative(process.cwd(), destPath);
        const exists = fs.existsSync(destPath);
        if (exists && !force) {
          warn(`Skipping (exists): ${rel}  ${c.dim}(--force to overwrite)${c.reset}`);
          results.skipped++;
        } else {
          if (!dryRun) {
            fs.mkdirSync(destDir, { recursive: true });
            if (transform) {
              const content = fs.readFileSync(srcPath, 'utf8');
              fs.writeFileSync(destPath, transform(content, srcPath), 'utf8');
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
          ok(`${dryRun ? `${c.dim}[dry-run]${c.reset} ` : ''}${rel}`);
          results.copied++;
        }
      }
    }
  }

  walk(src, dest);
  return results;
}

/**
 * Copy skill directories, flattening SKILL.md → <name>.md for Claude Code .claude/rules/.
 */
function copySkillsFlat(src, dest, { force = false, dryRun = false, transform = null } = {}) {
  const results = { copied: 0, skipped: 0 };
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(src, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;
    const destPath = path.join(dest, `${entry.name}.md`);
    const rel      = path.relative(process.cwd(), destPath);
    const exists   = fs.existsSync(destPath);
    if (exists && !force) {
      warn(`Skipping (exists): ${rel}  ${c.dim}(--force to overwrite)${c.reset}`);
      results.skipped++;
    } else {
      if (!dryRun) {
        fs.mkdirSync(dest, { recursive: true });
        let content = fs.readFileSync(skillMd, 'utf8');
        if (transform) content = transform(content, skillMd);
        fs.writeFileSync(destPath, content, 'utf8');
      }
      ok(`${dryRun ? `${c.dim}[dry-run]${c.reset} ` : ''}${rel}`);
      results.copied++;
    }
  }
  return results;
}

/**
 * List all immediate sub-entries of a directory (names only).
 * Returns [] if the directory does not exist.
 */
function listDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

// ─── Claude Code transformers ────────────────────────────────────────────────

/**
 * Transform a Copilot agent .agent.md into a Claude Code subagent .md.
 *
 * - Strips ```chatagent fences if present
 * - Removes Copilot-specific frontmatter: tools, argument-hint
 * - Rewrites .github/skills/ → .claude/rules/ and .github/agents/ → .claude/agents/
 */
function transformAgentForClaude(content) {
  // Strip ```chatagent wrapper
  content = content.replace(/^```chatagent\n/m, '');
  // Find the closing ``` that matches (at end of file or on its own line after body)
  content = content.replace(/\n```\s*$/, '');

  // Split frontmatter from body
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) return rewritePaths(content);

  let frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Remove Copilot-specific frontmatter fields
  frontmatter = frontmatter.replace(/^tools:.*(?:\n  .*)*$/m, '');       // multi-line tools
  frontmatter = frontmatter.replace(/^argument-hint:.*(?:\n  .*)*$/m, '');
  // Clean up blank lines
  frontmatter = frontmatter.replace(/\n{3,}/g, '\n').trim();

  body = rewritePaths(body);

  return `---\n${frontmatter}\n---\n\n${body}`;
}

/**
 * Transform a SKILL.md for Claude Code rules/.
 * Rewrites .github/ paths.
 */
function transformSkillForClaude(content) {
  return rewritePaths(content);
}

function rewritePaths(text) {
  return text
    .replace(/\.github\/skills\/([a-zA-Z0-9_-]+)\/SKILL\.md/g, '.claude/rules/$1.md')
    .replace(/\.github\/skills\//g, '.claude/rules/')
    .replace(/\.github\/agents\//g, '.claude/agents/');
}

// ─── command: list ───────────────────────────────────────────────────────────

function cmdList(args) {
  const showSkills = !args.includes('--agents');
  const showAgents = !args.includes('--skills');

  if (showSkills) {
    process.stdout.write(`\n${c.bold}${c.cyan}Skills${c.reset}\n`);
    const entries = listDir(SKILLS_SRC).filter(e => e.isDirectory());
    if (entries.length === 0) {
      dim('  (none found — package may be incomplete)');
    } else {
      for (const e of entries) {
        process.stdout.write(`  ${c.green}•${c.reset} ${e.name}\n`);
      }
    }
  }

  if (showAgents) {
    process.stdout.write(`\n${c.bold}${c.cyan}Agents${c.reset}\n`);
    const entries = listDir(AGENTS_SRC).filter(e => e.isFile() && e.name.endsWith('.agent.md'));
    if (entries.length === 0) {
      dim('  (none found — package may be incomplete)');
    } else {
      for (const e of entries) {
        process.stdout.write(`  ${c.green}•${c.reset} ${e.name.replace(/\.agent\.md$/, '')}\n`);
      }
    }
  }

  process.stdout.write('\n');
}

// ─── command: install ────────────────────────────────────────────────────────

function installForCopilot(destRoot, { force, dryRun, installSkills, installAgents }) {
  const destGithub = path.join(destRoot, '.github');
  let totalCopied  = 0;
  let totalSkipped = 0;

  process.stdout.write(
    `\n${c.bold}${c.magenta}GitHub Copilot${c.reset} → ${c.cyan}${path.relative(process.cwd(), destGithub) || '.github'}${c.reset}\n`
  );

  if (installSkills) {
    process.stdout.write(`\n${c.bold}Skills:${c.reset}\n`);
    const r = copyDirSync(SKILLS_SRC, path.join(destGithub, 'skills'), { force, dryRun });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  if (installAgents) {
    process.stdout.write(`\n${c.bold}Agents:${c.reset}\n`);
    const r = copyDirSync(AGENTS_SRC, path.join(destGithub, 'agents'), { force, dryRun });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  return { copied: totalCopied, skipped: totalSkipped };
}

function installForClaude(destRoot, { force, dryRun, installSkills, installAgents }) {
  const destClaude = path.join(destRoot, '.claude');
  let totalCopied  = 0;
  let totalSkipped = 0;

  process.stdout.write(
    `\n${c.bold}${c.magenta}Claude Code${c.reset} → ${c.cyan}${path.relative(process.cwd(), destClaude) || '.claude'}${c.reset}\n`
  );

  if (installSkills) {
    process.stdout.write(`\n${c.bold}Skills → rules/:${c.reset}\n`);
    const r = copySkillsFlat(SKILLS_SRC, path.join(destClaude, 'rules'), {
      force,
      dryRun,
      transform: transformSkillForClaude,
    });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  if (installAgents) {
    process.stdout.write(`\n${c.bold}Agents:${c.reset}\n`);
    const r = copyDirSync(AGENTS_SRC, path.join(destClaude, 'agents'), {
      force,
      dryRun,
      transform: transformAgentForClaude,
      renameFn: (name) => name.replace(/\.agent\.md$/, '.md'),
    });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  return { copied: totalCopied, skipped: totalSkipped };
}

async function cmdInstall(args) {
  const force        = args.includes('--force')       || args.includes('-f');
  const dryRun       = args.includes('--dry-run');
  const skillsOnly   = args.includes('--skills-only');
  const agentsOnly   = args.includes('--agents-only');
  const installSkills = !agentsOnly;
  const installAgents = !skillsOnly;

  // Resolve --dest <path>
  const destIdx = args.indexOf('--dest');
  const destRoot = destIdx !== -1 && args[destIdx + 1]
    ? path.resolve(args[destIdx + 1])
    : process.cwd();

  // Resolve target: --target copilot|claude|both, or interactive
  let target;
  const targetIdx = args.indexOf('--target');
  if (targetIdx !== -1 && args[targetIdx + 1]) {
    target = args[targetIdx + 1].toLowerCase();
    if (!TARGETS[target]) {
      err(`Invalid target: ${args[targetIdx + 1]}. Use: copilot, claude, or both`);
      process.exit(1);
    }
  } else {
    // Interactive selection
    target = await selectMenu('Where do you want to install?', [
      { key: 'copilot', label: 'GitHub Copilot', hint: '.github/agents/ + .github/skills/' },
      { key: 'claude',  label: 'Claude Code',    hint: '.claude/agents/ + .claude/rules/' },
      { key: 'both',    label: 'Both',            hint: 'install for both platforms' },
    ]);
  }

  process.stdout.write(
    `\n${c.bold}FlowCraft Skills${c.reset} ${c.dim}v${PKG.version}${c.reset}\n`
  );

  if (dryRun) info('Dry-run mode — no files will be written\n');

  const opts = { force, dryRun, installSkills, installAgents };
  let totalCopied  = 0;
  let totalSkipped = 0;

  if (target === 'copilot' || target === 'both') {
    const r = installForCopilot(destRoot, opts);
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  if (target === 'claude' || target === 'both') {
    const r = installForClaude(destRoot, opts);
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  process.stdout.write('\n');
  info(
    `Done.  ${c.green}${totalCopied}${c.reset} file(s) ${dryRun ? 'would be ' : ''}installed` +
    (totalSkipped ? `,  ${c.yellow}${totalSkipped}${c.reset} skipped` : '') + '.'
  );

  if (!dryRun && totalCopied > 0) {
    const dirs = [];
    if (target === 'copilot' || target === 'both') dirs.push('.github/');
    if (target === 'claude'  || target === 'both') dirs.push('.claude/');
    process.stdout.write(
      `\n${c.dim}Tip: commit ${dirs.join(' and ')} so your whole team benefits.${c.reset}\n`
    );

    // ── Activation CTA ─────────────────────────────────────────────────
    process.stdout.write(`\n${c.bold}${c.cyan}Your first 10 minutes${c.reset}\n`);
    process.stdout.write(`  Pick a real production bug from your backlog and try:\n`);
    process.stdout.write(`    ${c.green}@fc-bug-byomkesh PROJ-1234${c.reset}\n`);
    process.stdout.write(`  ${c.dim}Full walkthrough: docs/FIRST-BUG-TO-TRY.md${c.reset}\n`);

    process.stdout.write(`\n${c.bold}${c.cyan}Working in a brownfield codebase?${c.reset}\n`);
    process.stdout.write(`  ${c.dim}Start here: docs/BROWNFIELD-PLAYBOOK.md${c.reset}\n`);

    process.stdout.write(`\n${c.bold}${c.cyan}Need team-wide visibility?${c.reset}\n`);
    process.stdout.write(`  Track ROI, audit artifact quality, share evidence with leadership:\n`);
    process.stdout.write(`    ${c.cyan}https://flowcraft.systems${c.reset}\n`);
  }

  process.stdout.write('\n');
}

// ─── help ────────────────────────────────────────────────────────────────────

function printHelp() {
  process.stdout.write(`
${c.bold}FlowCraft Skills${c.reset}  v${PKG.version}

Install FlowCraft AI agent skills into your workspace.
Supports ${c.cyan}GitHub Copilot${c.reset}, ${c.cyan}Claude Code${c.reset}, or both.

${c.bold}Usage:${c.reset}
  npx @flowcraft.systems/skills <command> [options]
  flowcraft-skills <command> [options]

${c.bold}Commands:${c.reset}
  ${c.cyan}install${c.reset}   Install skills and agents (interactive target picker)
  ${c.cyan}list${c.reset}      List available skills and agents bundled in this package

${c.bold}Options for install:${c.reset}
  ${c.cyan}--target <t>${c.reset}     Target platform: ${c.bold}copilot${c.reset}, ${c.bold}claude${c.reset}, or ${c.bold}both${c.reset} (skips menu)
  ${c.cyan}--skills-only${c.reset}    Install only skills, skip agents
  ${c.cyan}--agents-only${c.reset}    Install only agents, skip skills
  ${c.cyan}--force, -f${c.reset}      Overwrite files that already exist
  ${c.cyan}--dry-run${c.reset}        Preview what would be installed without writing anything
  ${c.cyan}--dest <path>${c.reset}    Workspace root to install into (default: cwd)

${c.bold}Options for list:${c.reset}
  ${c.cyan}--skills${c.reset}         Show only skills
  ${c.cyan}--agents${c.reset}         Show only agents

${c.bold}Global options:${c.reset}
  ${c.cyan}--version, -v${c.reset}    Print version number
  ${c.cyan}--help, -h${c.reset}       Print this help message

${c.bold}Examples:${c.reset}
  ${c.dim}# Interactive — pick GitHub Copilot, Claude Code, or both:${c.reset}
  npx @flowcraft.systems/skills install

  ${c.dim}# Non-interactive — install for Claude Code:${c.reset}
  npx @flowcraft.systems/skills install --target claude

  ${c.dim}# Install for both platforms into a specific project:${c.reset}
  npx @flowcraft.systems/skills install --target both --dest ~/projects/my-app

  ${c.dim}# Preview what will be installed:${c.reset}
  npx @flowcraft.systems/skills install --dry-run

  ${c.dim}# Re-install and overwrite existing files:${c.reset}
  npx @flowcraft.systems/skills install --force

  ${c.dim}# See what's bundled:${c.reset}
  npx @flowcraft.systems/skills list

`);
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const args    = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    process.stdout.write(`${PKG.version}\n`);
    process.exit(0);
  }

  if (command === 'list') {
    cmdList(args.slice(1));
    process.exit(0);
  }

  if (command === 'install') {
    try {
      await cmdInstall(args.slice(1));
      process.exit(0);
    } catch (e) {
      err(`Install failed: ${e.message}`);
      process.exit(1);
    }
  }

  err(`Unknown command: ${command}`);
  process.stdout.write(`Run ${c.cyan}flowcraft-skills --help${c.reset} for usage.\n`);
  process.exit(1);
}

main();
