# Engine development

Check out `engine-fe/` and `engine-be/` as sibling directories and run these commands from `engine-be/`. The launcher works from the Engine agent container or from a terminal on the Docker host. Use Docker Compose 2.24 or later.

```sh
./engine-dev up -d --build
./engine-dev logs -f frontend backend
```

Open the frontend at **http://localhost:3000**. The API health endpoint is **http://localhost:4040/**. The backend uses the credentials in `.env.example` by default. Copy that file to `.env` to customize credentials or set an API key. Compose supplies the database URL, backend port, and Chromium path.

Edits in `../engine-fe/` trigger a browser refresh, and edits under `src/` restart the API. Both containers poll for changes to their bind-mounted source. Docker keeps each service’s `node_modules` in its own anonymous volume.

After changing either project's dependency manifests, rebuild that service and renew its dependency volume. For example:

```sh
./engine-dev up -d --build --renew-anon-volumes frontend
```

MySQL initializes from `database_structure/db_structure.sql` on first startup. The backend applies pending Knex migrations before starting. Database data lives in the `mysql-data` named volume. To stop the stack and retain the database:

```sh
./engine-dev stop
```

Set `ENGINE_FRONTEND_PORT` or `ENGINE_BACKEND_PORT` before running the launcher to change the published ports. The browser API URL follows the backend port by default and can be overridden with `REACT_APP_API_SERVICE`. From the Docker host, you can also run `docker compose up -d --build` directly. For a different container setup, set `ENGINE_WORKSPACE_DIR` to the workspace path as seen by the Docker daemon.
