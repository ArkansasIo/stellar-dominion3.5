# Contributing to Universe Civilization: Empires at War

Thank you for your interest in contributing! We welcome contributions from the community. This document outlines the process and expectations.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Reporting Bugs](#reporting-bugs)
3. [Feature Requests](#feature-requests)
4. [Pull Request Process](#pull-request-process)
5. [Development Setup](#development-setup)
6. [Coding Standards](#coding-standards)
7. [Commit Conventions](#commit-conventions)
8. [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- **Be respectful** — Disagreement is fine, personal attacks are not.
- **Be constructive** — Focus on what is best for the community and the project.
- **Be inclusive** — Use welcoming and inclusive language.
- **Be accountable** — Own your mistakes and learn from them.

### Unacceptable Behavior

- Harassment, intimidation, or discrimination in any form
- Trolling, insulting/derogatory comments, and personal or political attacks
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team at **conduct@universeciv.game**. All complaints will be reviewed and investigated promptly and fairly.

---

## Reporting Bugs

### Before Submitting

1. **Search existing issues** — Check if the bug has already been reported.
2. **Check the latest build** — The bug may have already been fixed.
3. **Determine reproducibility** — Can you reliably reproduce the issue?

### How to Report

Open a [GitHub Issue](https://github.com/anomalyco/universe-civilization/issues) with the following template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots/Logs**
If applicable, add screenshots or server logs.

**Environment:**
- OS: [e.g., Ubuntu 24.04, Windows 11]
- Browser: [e.g., Chrome 125, Firefox 129]
- Game Version: [e.g., v0.9.0]
- Universe: [e.g., Nexus-Alpha]

**Additional context**
Add any other context about the problem here.
```

---

## Feature Requests

We love hearing ideas! To submit a feature request:

1. **Search existing requests** — Your idea may already be under discussion.
2. **Open a discussion** — Use [GitHub Discussions](https://github.com/anomalyco/universe-civilization/discussions) for proposals that need community input.
3. **Create a feature request** — Use the [Feature Request template](https://github.com/anomalyco/universe-civilization/issues/new?template=feature_request.md).

### What makes a good feature request?

- **Clear problem statement** — What gap does this fill?
- **Proposed solution** — How might it work?
- **Alternatives considered** — What other approaches were evaluated?
- **Acceptance criteria** — How would we know it's done?

---

## Pull Request Process

### TL;DR

1. Fork the repo and create a branch from `main`.
2. Make your changes following the coding standards.
3. Write or update tests as needed.
4. Run the full test suite and lint checks.
5. Submit a PR with a clear description and link to related issues.

### Detailed Process

#### 1. Branch Naming

Use descriptive branch names with a category prefix:

```
feat/   — New features        (feat/alliance-war-declarations)
fix/    — Bug fixes           (fix/combat-overflow-calculation)
refactor/ — Code changes      (refactor/player-state-service)
docs/   — Documentation       (docs/api-authentication)
chore/  — Maintenance         (chore/update-dependencies)
test/   — Tests               (test/combat-round-resolution)
```

#### 2. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) (see below).

#### 3. Before Submitting

- Ensure all tests pass: `npm test`
- Ensure lint passes: `npm run lint`
- Ensure TypeScript compiles: `npm run typecheck`
- Ensure your branch is up to date with `main`
- Write a descriptive PR title and body

#### 4. PR Title Format

```
<type>(<scope>): <description>
```

Examples:
```
feat(alliances): add war declaration system
fix(combat): resolve overflow in damage calculation
docs(api): document authentication endpoints
```

#### 5. PR Body

Include:
- **What** this PR changes
- **Why** this change is needed (reference issues if applicable)
- **How** the change was implemented
- **Testing** — what was tested and how
- **Screenshots** for UI changes
- **Breaking changes** with migration notes

#### 6. Review Process

- At least one maintainer review is required.
- Address review feedback promptly.
- Maintainers may request changes. Please discuss if you disagree.
- Once approved, a maintainer will merge your PR.

---

## Development Setup

### Prerequisites

| Tool | Version  | Purpose          |
|------|----------|------------------|
| Node.js | 20.x LTS | Runtime         |
| npm   | 10.x     | Package manager  |
| PostgreSQL | 16.x | Database       |
| Git   | 2.40+    | Version control  |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/anomalyco/universe-civilization.git
cd universe-civilization

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string and secrets

# 4. Set up the database
npx drizzle-kit push    # Push schema to database
npm run db:seed         # Seed default data

# 5. Start development servers
npm run dev             # Starts both client and server with hot reload
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost:5432/universeciv` |
| `JWT_SECRET` | Token signing secret | (required) |
| `SESSION_SECRET` | Session encryption secret | (required) |
| `PORT` | API server port | `3000` |
| `CLIENT_PORT` | Client dev server port | `5173` |
| `NODE_ENV` | Environment mode | `development` |

### Docker Setup (Alternative)

```bash
# Start PostgreSQL and the application
docker compose up -d

# Run migrations
docker compose exec app npm run db:push

# Seed data
docker compose exec app npm run db:seed
```

---

## Coding Standards

### Language & Runtime

- **TypeScript** — Strict mode enabled. All new code must be typed.
- **Node.js** — ES2022+ features. Async/await preferred over callbacks.
- **React 19** — Functional components with hooks. No class components.

### TypeScript Configuration

The project uses strict TypeScript. Key rules:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true
  }
}
```

### ESLint

We enforce code quality with ESLint. Key rules:

- `@typescript-eslint/no-explicit-any` — Avoid `any`; use `unknown` if needed.
- `@typescript-eslint/strict-boolean-expressions` — No loose truthiness.
- `no-console` — Use the project's logger instead.
- `import/order` — Organized imports (external → internal → relative).

### Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Files/Directories | `kebab-case` | `player-state-service.ts` |
| Classes/Interfaces/Types | `PascalCase` | `PlayerState`, `BattleReport` |
| Functions/Variables | `camelCase` | `getPlayerState()`, `fleetSpeed` |
| Constants (true constants) | `UPPER_SNAKE_CASE` | `MAX_FLEET_SIZE`, `DEFAULT_RESOURCES` |
| Database tables | `snake_case` | `player_states`, `battle_logs` |
| Database columns | `snake_case` | `user_id`, `created_at` |
| API routes | `kebab-case` | `/api/fleet-combat` |
| React components | `PascalCase` | `FleetOverview.tsx` |

### Code Organization

```
src/
├── client/           # React frontend
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route-level page components
│   ├── styles/       # CSS and theming
│   └── utils/        # Client-side utilities
├── server/           # Express.js backend
│   ├── routes/       # Route definitions
│   ├── controllers/  # Request handlers
│   ├── services/     # Business logic layer
│   ├── middleware/    # Express middleware
│   └── storage/      # Database operations
├── shared/           # Shared types/configs
│   ├── config/       # Game configuration data
│   ├── sql/          # SQL schemas and seeds
│   └── types/        # TypeScript type definitions
└── database/         # Migration files
```

### Best Practices

- **Immutability** — Prefer `const`, `Readonly<T>`, and immutable array operations.
- **Error handling** — Always handle promise rejections. Use typed error classes.
- **Logging** — Use structured logging. Include request IDs and context.
- **Security** — Never log secrets. Validate all user input. Use parameterized queries.
- **Performance** — Avoid N+1 queries. Use database indexing. Cache where appropriate.

---

## Commit Conventions

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) for all commits.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type     | Usage                                      |
|----------|--------------------------------------------|
| `feat`   | A new feature                              |
| `fix`    | A bug fix                                  |
| `docs`   | Documentation only changes                 |
| `style`  | Code style changes (formatting, no logic)  |
| `refactor` | Code change that neither fixes nor adds |
| `test`   | Adding or updating tests                   |
| `chore`  | Build process, tooling, dependencies       |
| `perf`   | Performance improvement                    |
| `ci`     | CI/CD configuration changes                |

### Examples

```
feat(alliances): add war declaration system

Implement alliance war mechanics including:
- War declaration UI with casus belli selection
- Automatic ceasefire after 7 days
- War score tracking on alliance profile

Closes #245
```

```
fix(combat): resolve integer overflow in damage calculation

Large fleet battles were overflowing the 32-bit integer
limit for total damage. Switched to BigInt for damage
accumulation.

Fixes #312
```

```
docs(api): document fleet dispatch endpoint
```

### Breaking Changes

Append `!` after the type to indicate a breaking change:

```
feat!(api): restructure authentication response format

The login endpoint now returns a refresh token alongside
the access token. The session cookie is no longer set
automatically.

Migration: Update clients to handle the new response format.
BREAKING CHANGE: Session cookie auth is removed.
```

---

## Testing Requirements

### Testing Philosophy

- **Unit tests** for services, utilities, and business logic.
- **Integration tests** for API endpoints and database operations.
- **Manual testing notes** for UI changes where automation is impractical.
- Tests should be **deterministic** — no reliance on shared state or timing.

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:int

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

### Coverage Requirements

| Metric | Target |
|--------|--------|
| Statements | ≥ 80% |
| Branches   | ≥ 75% |
| Functions  | ≥ 80% |
| Lines      | ≥ 80% |

New features should maintain or improve these thresholds.

### Writing Tests

- Place test files next to the source file: `service.ts` → `service.test.ts`
- Use descriptive test names: `'should return 400 when resource amount is negative'`
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies (database, network, time)
- Test edge cases (empty state, max values, concurrent access)

### Test Framework

- **Vitest** — Primary test runner
- **Supertest** — HTTP integration testing
- **Testcontainers** — PostgreSQL in integration tests

---

## Questions?

If you have questions about contributing, start a [GitHub Discussion](https://github.com/anomalyco/universe-civilization/discussions) or reach out in the project's community channels.

Thank you for helping build Universe Civilization: Empires at War!
