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
- **Tests**: `CI=true npm test -- --watchAll=false`
- **Format check**: `npm run format:check`

### Gotchas

- `npm run lint` runs with `--max-warnings 0`. Every rule this project configures is warn-level, so without it eslint would exit 0 and the CI gate would pass while letting warnings through.
- The `homepage` field in `package.json` is set to `https://www.justin-potter.com` for GitHub Pages deployment. During `npm run build`, assets are generated assuming they are hosted at `/`. The dev server (`npm start`) is unaffected.
