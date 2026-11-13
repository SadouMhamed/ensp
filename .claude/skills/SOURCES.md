# Agent skills in this project

Claude Code loads every `SKILL.md` in this folder for anyone working on the repo.
Each skill was copied as-is from its official source after review (2026-11-13).

| Skill | Use it for | Source (commit) |
|---|---|---|
| `vercel-react-best-practices` | Writing/reviewing React & Next.js code for performance (70 rules) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) (`1a2c79d4e6c4`) |
| `vercel-composition-patterns` | Structuring reusable React components | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns) (`1a2c79d4e6c4`) |
| `web-design-guidelines` | "Review my UI / check accessibility". Fetches Vercel's latest guidelines when used | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) (`1a2c79d4e6c4`) |
| `shadcn` | Adding, fixing and styling shadcn/ui components, presets | [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) (`dd41d19e2f80`) |
| `next-cache-components-optimizer` | Making routes render instantly (Cache Components) | [vercel/next.js](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-optimizer) (`807c3b5b1d8c`) |
| `next-partial-prefetching-optimizer` | Tuning link prefetching (Partial Prefetching) | [vercel/next.js](https://github.com/vercel/next.js/tree/canary/skills/next-partial-prefetching-optimizer) (`807c3b5b1d8c`) |
| `next-bundle-optimizer` | Shrinking client JavaScript bundles | [vercel/next.js](https://github.com/vercel/next.js/tree/canary/skills/next-bundle-optimizer) (`807c3b5b1d8c`) |

Not installed on purpose:
- `next-dev-loop` (vercel/next.js): requires the global `agent-browser` CLI.
- `next-cache-components-adoption` / `next-partial-prefetching-adoption`: this app already uses both features.
- `vercel-labs/next-skills` → `next-best-practices`: retired. Its guidance now ships with Next.js itself
  (the version-matched docs referenced by `AGENTS.md` in the repo root).

## Updating

Re-copy a skill folder from its source link above, or use Vercel's skills CLI, for example:

```bash
npx skills add vercel/next.js --skill next-cache-components-optimizer
```

Review the diff before committing. Skills are instructions the agent follows.
