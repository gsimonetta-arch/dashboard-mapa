# CLAUDE.md — dashboard-mapa

This file provides guidance to AI assistants (Claude and others) working in this repository. Read it before making changes.

## Project Overview

**dashboard-mapa** is a map-based dashboard application. The repository is in its initial state with no committed source code yet. This file will evolve as the project grows.

- **Repository**: `gsimonetta-arch/dashboard-mapa`
- **Status**: New / bootstrapping phase

---

## Repository Structure

The project has not yet been scaffolded. Once initialized, the expected layout is:

```
dashboard-mapa/
├── CLAUDE.md              # This file
├── README.md              # Human-facing project documentation
├── package.json           # Node.js dependencies and scripts
├── src/
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

> **Note**: Update this section once the project is scaffolded with actual files and directories.

---

## Development Workflow

### Prerequisites

Document prerequisites here once the stack is chosen (e.g., Node.js version, package manager, environment variables).

### Getting Started

```bash
# Install dependencies
npm install   # or pnpm install / yarn

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Branch Strategy

- `main` — stable, production-ready code
- `develop` — integration branch for feature work
- `claude/<session-id>` — branches created by AI assistants for specific tasks
- `feature/<description>` — human-authored feature branches
- `fix/<description>` — bug fix branches

**AI assistants must develop on the branch specified in the task instructions and push only to that branch.**

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
```

---

## Tech Stack

> To be confirmed once the project is bootstrapped. Expected candidates:

| Layer | Technology |
|---|---|
| Framework | React or Vue |
| Language | TypeScript |
| Map library | Leaflet, MapLibre, or Mapbox GL JS |
| State management | Zustand, Pinia, or Redux Toolkit |
| Styling | Tailwind CSS or CSS Modules |
| Build tool | Vite |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |

---

## Key Conventions for AI Assistants

### Code Style

- Use TypeScript; avoid `any` — prefer explicit types or `unknown`.
- Functional components only (no class components if React is used).
- Named exports preferred over default exports for components.
- Keep components under ~200 lines; extract logic to hooks or utils.
- Never commit secrets, API keys, or tokens. Use environment variables.

### File Naming

- Components: `PascalCase.tsx` (e.g., `MapViewer.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useMapLayers.ts`)
- Utilities: `camelCase.ts` (e.g., `formatCoordinates.ts`)
- Types/interfaces: `PascalCase` in a `.types.ts` file or `types/` directory

### Map-Specific Conventions

- Map instance initialization belongs in a dedicated hook or service.
- Layer definitions should be data-driven (config objects), not hardcoded.
- Coordinate order: always document whether functions expect `[lng, lat]` or `[lat, lng]` — this is a common source of bugs.
- Prefer GeoJSON as the canonical data format for geographic features.

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

Document required environment variables here as the project grows. Example:

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
5. **Push to the right branch**: Always push to the branch specified in the task — never to `main` or `develop` without explicit permission.
6. **Update this file**: When the project structure changes significantly, update the relevant sections of this CLAUDE.md.

---

*Last updated: 2026-02-24 — initial creation on empty repository.*
