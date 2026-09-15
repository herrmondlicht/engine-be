# engine-be contributor guide

## Scope and stack

This repository is the Engine API. It is an Express application written in JavaScript with Babel, Jest, Knex, and MySQL. Use npm and the committed `package-lock.json`; the supported runtime is Node 20.

## Repository layout

- `src/index.js` creates the Express app. Routes are mounted under `/api` in `src/index.routes.js`; `/` is a health response.
- `src/modules/<Feature>/` groups route and controller code for a resource. Register a new resource in `src/index.routes.js`.
- `src/services/` contains reusable business logic. `services/databaseService/` contains the query helpers and MySQL access layer.
- `src/middlewares/` contains route middleware and error handling. Shared error codes live in `src/constants/`.
- `src/template/` and `src/public/` are runtime assets copied into `build/` by `npm run build`.
- `database_structure/` contains the base schema, Knex migrations, and development seed data.
- Tests are co-located as `*.test.js`, including directories named `_tests`, `__tests__`, and `__test`.

## Setup and development

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and configure `PORT`, `SECRET`, `PORTAL_USERNAME`, `PORTAL_PASSWORD`, and `DATABASE_URL`. Set `OPENAI_API_KEY` only for image-order functionality. `PUPPETEER_EXECUTABLE_PATH` must point to an available Chrome/Chromium binary when generating PDFs.
3. Run `npm run start-dev` to start the API with Nodemon. The local default port is 4040.

The API accepts JSON and URL-encoded bodies and mounts feature routes beneath `/api`. Most resource routes require a JWT; keep route protection consistent with the existing registration in `src/index.routes.js`.

## Database work

- Use `npm run migration` to apply Knex migrations and `npm run seed-db` to migrate and populate development data.
- Add schema changes as new timestamped files in `database_structure/migrations/`; provide both `up` and `down` operations where feasible. Do not rewrite an applied migration.
- `npm run set-db` creates the local MySQL Docker container. `npm run reset-db` forcibly removes that named container before recreating it, and seeds delete and recreate fixture rows. Treat all three as local-development operations and confirm the target database before running them.

## Code conventions

- Follow the existing ES module style and 2-space indentation. ESLint extends `airbnb-base` and Prettier; its config ignores test files.
- Keep controllers focused on HTTP concerns and put shared business or database behavior in services.
- Preserve the existing resource naming and route conventions. Use the shared error codes and error middleware rather than introducing ad hoc response formats.
- Keep secrets, database URLs, and API keys out of source, tests, and commits. Update `.env.example` when adding a required non-secret setting.

## Architecture: dependency injection and SOLID

- Keep dependency injection as the default for services and controllers. Export factories that accept a named dependency object, such as `makeCRUDService({ queryService, resourceName })` or `makeServiceOrderPdfController({ getPrintableData, getPDFStream, ... })`.
- Compose concrete infrastructure at a boundary: route modules or an explicit composition module such as `src/modules/ServiceOrderPdf/serviceOrderPdf.composition.js`. Keep controllers and business services independent of Express, Knex, Axios, EJS, Node streams, filesystem paths, and environment lookups unless that dependency is explicitly supplied.
- Use the existing factory/default-instance pattern when it fits the module: export a factory for injection and testing, then construct the production instance only at the composition boundary. Do not hide replaceable dependencies in module-level state.
- Give each controller, service, and helper one clear responsibility. Add a focused collaborator or small interface when behavior changes independently, instead of expanding a broad service or controller.
- Depend on the smallest contract needed by the caller. Pass named collaborators or functions rather than a large application object, and prefer composition over inheritance or condition-heavy branching.
- In tests, construct the unit with stubs for collaborators and assert its behavior. Mock external boundaries, not the unit's own implementation details.

## Verification

- Run a focused Jest test while developing: `npx jest path/to/file.test.js --runInBand`.
- Run the full suite without watch mode: `npx jest --runInBand`.
- Run `npm run build` when changing server startup, Babel-transpiled source, templates, or static assets. The build recreates the generated `build/` directory.
- `npm start` first applies migrations and then serves the compiled output, so do not use it as a no-side-effect smoke test.

Before handing off a change, run the smallest relevant test and record any checks that require MySQL, Chrome/Chromium, Docker, or external API credentials.
