#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Creating agent compatibility links..."

SKILLS=(
  architecture
  testing
  git-workflow
  conventions
  debugging
  code-review
  ui-design
  api-design
)

link_skills() {
  local target_dir="$1"
  mkdir -p "$target_dir"
  for skill in "${SKILLS[@]}"; do
    if [ ! -e "$target_dir/$skill" ]; then
      ln -s "../../.cursor/skills/$skill" "$target_dir/$skill"
      echo "✓ $target_dir/$skill -> .cursor/skills/$skill"
    fi
  done
}

# Claude Code
mkdir -p .claude
if [ ! -e CLAUDE.md ]; then
  ln -s AGENTS.md CLAUDE.md
  echo "✓ CLAUDE.md -> AGENTS.md"
fi

if [ ! -e .claude/CLAUDE.md ]; then
  ln -s ../AGENTS.md .claude/CLAUDE.md
  echo "✓ .claude/CLAUDE.md -> ../AGENTS.md"
fi

# Windsurf
if [ ! -e .windsurfrules ]; then
  ln -s AGENTS.md .windsurfrules
  echo "✓ .windsurfrules -> AGENTS.md"
fi

# Antigravity / generic agent folder
mkdir -p .agent
if [ ! -e .agent/AGENTS.md ]; then
  ln -s ../AGENTS.md .agent/AGENTS.md
  echo "✓ .agent/AGENTS.md -> ../AGENTS.md"
fi

# Codex — project skills (symlinks to .cursor/skills/)
link_skills ".codex/skills"

# OpenCode — project skills (symlinks to .cursor/skills/)
link_skills ".opencode/skills"

# GitHub Copilot fallback pointer
mkdir -p .github
if [ ! -e .github/copilot-instructions.md ]; then
  cat > .github/copilot-instructions.md <<'EOF'
Este archivo es un puntero de compatibilidad.
Fuente universal: `../AGENTS.md`.
Fuente técnica: `../docs/ai/`.
Skills operativos: `../docs/skills/`.
EOF
  echo "✓ .github/copilot-instructions.md"
fi

echo ""
echo "Done."
echo "  Universal source: AGENTS.md"
echo "  OpenCode config: opencode.json"
echo "  Codex skills:    .codex/skills/"
echo "  OpenCode skills: .opencode/skills/"
