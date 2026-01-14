# Repository Guidelines

## Project Structure & Module Organization

- `src/index.js` is the Express entrypoint; `src/index.routes.js` wires API routes under `/api`.
- `src/modules/` contains feature modules (controllers/services per feature), `src/services/` holds shared services, and `src/middlewares/` houses Express middleware.
- `src/constants/` stores shared constants; `src/public/` and `src/template/` are copied into `build/` during `npm run build`.
- Tests live alongside code as `*.test.js`; some suites are under `__tests__/` directories.

## Build, Test, and Development Commands

- `npm run start-dev`: run the API in dev with Nodemon + Babel.
- `npm run build`: compile `src/` into `build/` and copy templates/static assets.
- `npm run start`: run migrations and start the compiled server from `build/`.
- `npm test`: run Jest in watch mode.
- Database helpers: `npm run set-db` (create MySQL docker), `npm run reset-db` (recreate), `npm run migration`, `npm run seed-db`.

## Coding Style & Naming Conventions

- Node/Express with ES modules via Babel; prefer small, focused middleware and services.
- ESLint uses `airbnb-base` + `prettier`; tests are ignored by ESLint per `.eslintrc.json`.
- Use 2-space indentation and keep filenames aligned with existing module/service naming.

## Testing Guidelines

- Use Jest; keep tests close to the unit under test and cover error paths for middleware/services.
- Run `npm test` for local verification before pushing changes.

## Environment & Tooling Notes

- Copy `.env.example` to `.env` for local runs; configure `PORT`, `SECRET`, and DB credentials.
- For local MySQL via Docker, use `npm run set-db` and `npm run seed-db` after migrations.
