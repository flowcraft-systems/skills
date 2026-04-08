#!/usr/bin/env node
'use strict';

const path = require('path');
const fs   = require('fs');

// ─── constants ───────────────────────────────────────────────────────────────

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PKG          = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
const AGENTS_SRC   = path.join(PACKAGE_ROOT, '.github', 'agents');
const SKILLS_SRC   = path.join(PACKAGE_ROOT, '.github', 'skills');

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
};

function ok(msg)   { process.stdout.write(`${c.green}✔${c.reset}  ${msg}\n`); }
function warn(msg) { process.stderr.write(`${c.yellow}⚠${c.reset}  ${msg}\n`); }
function info(msg) { process.stdout.write(`${c.cyan}ℹ${c.reset}  ${msg}\n`); }
function err(msg)  { process.stderr.write(`${c.red}✖${c.reset}  ${msg}\n`); }
function dim(msg)  { process.stdout.write(`${c.dim}${msg}${c.reset}\n`); }

// ─── file utilities ──────────────────────────────────────────────────────────

/**
 * Recursively copy a directory tree.
 * Returns { copied, skipped } counts.
 */
function copyDirSync(src, dest, { force = false, dryRun = false } = {}) {
  const results = { copied: 0, skipped: 0 };

  function walk(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath  = path.join(srcDir,  entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        if (!dryRun) fs.mkdirSync(destPath, { recursive: true });
        walk(srcPath, destPath);
      } else {
        const rel    = path.relative(process.cwd(), destPath);
        const exists = fs.existsSync(destPath);
        if (exists && !force) {
          warn(`Skipping (exists): ${rel}  ${c.dim}(--force to overwrite)${c.reset}`);
          results.skipped++;
        } else {
          if (!dryRun) {
            fs.mkdirSync(destDir, { recursive: true });
            fs.copyFileSync(srcPath, destPath);
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

// ─── command: list ───────────────────────────────────────────────────────────

function cmdList(args) {
  const showSkills = !args.includes('--agents');
  const showAgents = !args.includes('--skills');

  if (showSkills) {
    process.stdout.write(`\n${c.bold}${c.cyan}Skills${c.reset}  (.github/skills/)\n`);
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
    process.stdout.write(`\n${c.bold}${c.cyan}Agents${c.reset}  (.github/agents/)\n`);
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

function cmdInstall(args) {
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

  const destGithub  = path.join(destRoot, '.github');
  const destSkills  = path.join(destGithub, 'skills');
  const destAgents  = path.join(destGithub, 'agents');

  process.stdout.write(
    `\n${c.bold}FlowCraft Skills${c.reset} ${c.dim}v${PKG.version}${c.reset}` +
    ` — installing into ${c.cyan}${path.relative(process.cwd(), destGithub) || '.github'}${c.reset}\n`
  );

  if (dryRun) info('Dry-run mode — no files will be written\n');

  let totalCopied  = 0;
  let totalSkipped = 0;

  if (installSkills) {
    process.stdout.write(`\n${c.bold}Skills:${c.reset}\n`);
    const r = copyDirSync(SKILLS_SRC, destSkills, { force, dryRun });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  if (installAgents) {
    process.stdout.write(`\n${c.bold}Agents:${c.reset}\n`);
    const r = copyDirSync(AGENTS_SRC, destAgents, { force, dryRun });
    totalCopied  += r.copied;
    totalSkipped += r.skipped;
  }

  process.stdout.write('\n');
  info(
    `Done.  ${c.green}${totalCopied}${c.reset} file(s) ${dryRun ? 'would be ' : ''}installed` +
    (totalSkipped ? `,  ${c.yellow}${totalSkipped}${c.reset} skipped` : '') + '.'
  );

  if (!dryRun && totalCopied > 0) {
    process.stdout.write(
      `\n${c.dim}Tip: commit the .github/ directory so your whole team can use these agents and skills.${c.reset}\n`
    );
  }

  process.stdout.write('\n');
}

// ─── help ────────────────────────────────────────────────────────────────────

function printHelp() {
  process.stdout.write(`
${c.bold}FlowCraft Skills${c.reset}  v${PKG.version}

Install FlowCraft AI agent skills and agents into your GitHub Copilot workspace.

${c.bold}Usage:${c.reset}
  npx @flowcraft.systems/skills <command> [options]
  flowcraft-skills <command> [options]

${c.bold}Commands:${c.reset}
  ${c.cyan}install${c.reset}   Copy skills and agents into .github/ in the current (or given) directory
  ${c.cyan}list${c.reset}      List available skills and agents bundled in this package

${c.bold}Options for install:${c.reset}
  ${c.cyan}--skills-only${c.reset}   Install only skill SKILL.md files, skip agents
  ${c.cyan}--agents-only${c.reset}   Install only agent .agent.md files, skip skills
  ${c.cyan}--force, -f${c.reset}     Overwrite files that already exist
  ${c.cyan}--dry-run${c.reset}       Preview what would be installed without writing anything
  ${c.cyan}--dest <path>${c.reset}   Workspace root to install into (default: current directory)

${c.bold}Options for list:${c.reset}
  ${c.cyan}--skills${c.reset}        Show only skills
  ${c.cyan}--agents${c.reset}        Show only agents

${c.bold}Global options:${c.reset}
  ${c.cyan}--version, -v${c.reset}   Print version number
  ${c.cyan}--help, -h${c.reset}      Print this help message

${c.bold}Examples:${c.reset}
  ${c.dim}# Quick install via npx (no global install needed):${c.reset}
  npx @flowcraft.systems/skills install

  ${c.dim}# Install into a specific project:${c.reset}
  npx @flowcraft.systems/skills install --dest ~/projects/my-app

  ${c.dim}# Preview what will be installed:${c.reset}
  npx @flowcraft.systems/skills install --dry-run

  ${c.dim}# Re-install and overwrite existing files:${c.reset}
  npx @flowcraft.systems/skills install --force

  ${c.dim}# Install only skills (not agent definitions):${c.reset}
  npx @flowcraft.systems/skills install --skills-only

  ${c.dim}# See what skills are bundled:${c.reset}
  npx @flowcraft.systems/skills list

`);
}

// ─── main ────────────────────────────────────────────────────────────────────

function main() {
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
      cmdInstall(args.slice(1));
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
