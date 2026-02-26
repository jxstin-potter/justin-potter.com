# AGENTS.md

## Cursor Cloud specific instructions

This is a client-side-only React portfolio site (Create React App). There are no backend services, databases, or environment variables required.

### Services

| Service | Command | Port | Notes |
|---|---|---|---|
| Dev server | `npm start` | 3000 | CRA webpack-dev-server with hot reload |

### Development commands

See `package.json` scripts. Key commands:

- **Dev server**: `BROWSER=none npm start` (use `BROWSER=none` in headless environments)
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Tests**: `CI=true npm test -- --passWithNoTests` (no test files currently exist; `--passWithNoTests` avoids exit code 1)
- **Format check**: `npm run format:check`

### Gotchas

- The test suite has zero test files. Running `npm test` without `--passWithNoTests` exits with code 1, which is not a real failure.
- The `homepage` field in `package.json` is set to `https://www.justin-potter.com` for GitHub Pages deployment. During `npm run build`, assets are generated assuming they are hosted at `/`. The dev server (`npm start`) is unaffected.
