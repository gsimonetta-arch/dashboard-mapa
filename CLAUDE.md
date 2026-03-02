# CLAUDE.md — dashboard-mapa

This file provides guidance to AI assistants (Claude and others) working in this repository. Read it before making changes.

## Project Overview

**dashboard-mapa** is a map-based dashboard application. The repository is in its initial bootstrapping phase — only this file has been committed. Source code scaffolding has not yet been done.

- **Repository**: `gsimonetta-arch/dashboard-mapa`
- **Status**: Bootstrapping — no source code yet

---

## Current Repository State

As of 2026-03-02, the repository contains:

```
dashboard-mapa/
└── CLAUDE.md              # This file (only committed source)
```

**Commits**: 1 (`d5857cb docs: add initial CLAUDE.md for AI assistant guidance`)

**Branches**:
- `master` — default / stable branch (no source code yet)
- `claude/<session-id>` — AI assistant working branches

**No `package.json`, `src/`, tests, or config files exist yet.** This CLAUDE.md acts as the specification until the project is scaffolded.

### Scaffolding Checklist

Track progress here as the project is initialized:

- [ ] Initialize `package.json` (choose npm / pnpm / yarn)
- [ ] Scaffold project with Vite (`npm create vite@latest`)
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Add and configure ESLint + Prettier
- [ ] Add and configure Vitest + Testing Library
- [ ] Install chosen map library (Leaflet / MapLibre / Mapbox GL JS)
- [ ] Install chosen state management library (Zustand / Pinia / Redux Toolkit)
- [ ] Set up Tailwind CSS or CSS Modules
- [ ] Create `src/` directory structure
- [ ] Create `tests/` directory
- [ ] Create `public/` directory
- [ ] Create `README.md`
- [ ] Update this CLAUDE.md with actual tech stack and structure

---

## Expected Repository Structure

Once scaffolded, the expected layout is:

```
dashboard-mapa/
├── CLAUDE.md              # This file
├── README.md              # Human-facing project documentation
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── .eslintrc.cjs          # ESLint rules
├── .prettierrc            # Prettier formatting config
├── .env.local             # Local env vars (never committed)
├── src/
│   ├── main.tsx           # App entry point
│   ├── App.tsx            # Root component
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API calls and external integrations
│   ├── store/             # State management
│   ├── utils/             # Pure helper functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── tests/                 # Test files (unit + integration)
└── docs/                  # Extended documentation
```

> Update this section once the project is scaffolded with actual files and directories.

---

## Tech Stack

> To be confirmed during scaffolding. Expected candidates:

| Layer | Technology |
|---|---|
| Framework | React (preferred) or Vue |
| Language | TypeScript |
| Map library | Leaflet, MapLibre, or Mapbox GL JS |
| State management | Zustand (preferred), Pinia, or Redux Toolkit |
| Styling | Tailwind CSS or CSS Modules |
| Build tool | Vite |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |

Update this table when the stack is finalized.

---

## Development Workflow

### Prerequisites

Document prerequisites here once the stack is confirmed (e.g., Node.js version, package manager, environment variables).

### Getting Started

```bash
# Install dependencies
npm install   # or: pnpm install / yarn

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Branch Strategy

- `master` — stable, production-ready code (default branch)
- `develop` — integration branch for feature work (create when needed)
- `claude/<session-id>` — branches created by AI assistants for specific tasks
- `feature/<description>` — human-authored feature branches
- `fix/<description>` — bug fix branches

**AI assistants must develop on the branch specified in the task instructions and push only to that branch. Never push to `master` or `develop` without explicit permission.**

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`

Examples:
```
feat(map): add layer toggle control
fix(dashboard): correct tile URL for offline mode
docs(CLAUDE.md): update project structure
chore: scaffold project with Vite
```

---

## Key Conventions for AI Assistants

### Code Style

- Use TypeScript; avoid `any` — prefer explicit types or `unknown`.
- Functional components only (no class components).
- Named exports preferred over default exports for components.
- Keep components under ~200 lines; extract logic to hooks or utils.
- Never commit secrets, API keys, or tokens. Use environment variables.

### File Naming

- Components: `PascalCase.tsx` (e.g., `MapViewer.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useMapLayers.ts`)
- Utilities: `camelCase.ts` (e.g., `formatCoordinates.ts`)
- Types/interfaces: `PascalCase` in a `.types.ts` file or `types/` directory

### Map-Specific Conventions

- Map instance initialization belongs in a dedicated hook or service (e.g., `useMap.ts`).
- Layer definitions should be data-driven (config objects), not hardcoded inline.
- Coordinate order: always document whether functions expect `[lng, lat]` or `[lat, lng]` — this is a common source of bugs.
- Prefer GeoJSON as the canonical data format for geographic features.
- Never store the raw map instance in global React state; manage it via a ref or context.

### Testing

- Write tests alongside source files or in `tests/` mirroring the source tree.
- Unit-test pure utilities and hooks in isolation.
- Integration tests should cover key user flows (e.g., load map, toggle layer, interact with dashboard filters).
- Do not skip or mock tests to make CI pass; fix the underlying issue.

### Pull Requests

- PRs should be small and focused on a single concern.
- Include a description of what changed and why.
- All CI checks must pass before merging.
- AI-generated PRs must include a summary of changes and a testing checklist.

---

## Environment Variables

Document required environment variables here as the project grows.

```bash
# .env.local (never committed)
VITE_MAP_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.example.com
```

---

## Common Commands Reference

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite |
| `npm run lint` | Lint the codebase |
| `npm run typecheck` | TypeScript type checking only |
| `npm run format` | Auto-format with Prettier |

> Update this table as scripts are added to `package.json`.

---

## Notes for AI Assistants

1. **Read before writing**: Always read relevant files before editing them.
2. **Minimal changes**: Only change what is necessary to complete the task.
3. **No over-engineering**: Avoid adding abstractions, helpers, or features beyond what is explicitly requested.
4. **Verify structure**: Before creating new files, check if a similar one already exists.
5. **Push to the right branch**: Always push to the `claude/<session-id>` branch assigned in task instructions. Never push to `master` or `develop` without explicit permission.
6. **Update this file**: When the project structure changes significantly (e.g., after scaffolding), update the relevant sections of this CLAUDE.md including the "Current Repository State" and "Scaffolding Checklist" sections.
7. **Default branch is `master`**: The repository uses `master` (not `main`) as the default/stable branch.

---

*Last updated: 2026-03-02 — updated repository state, corrected default branch name (`master`), added scaffolding checklist and map-specific notes.*
