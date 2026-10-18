# GitHub Pages + AJAX + MySQL Architecture

## Runtime topology

```text
GitHub Pages (static React/Vite frontend)
        |
        | fetch() / JSON over HTTPS
        v
Express MySQL API (backend/mysql-api.ts)
        |
        | mysql2/promise + parameterized SQL
        v
MySQL 8.x
```

GitHub Pages is static hosting. It does not run Node.js or MySQL. The API must therefore be deployed to a separate HTTPS-capable server/container, while the browser frontend remains on GitHub Pages.

## Browser request example

```ts
const response = await fetch(`${API_BASE_URL}/api/players`);
const players = await response.json();
```

## Configuration

Copy `backend/.env.example` to the environment used by the API host and set real credentials there. Never commit a real MySQL password, connection string, API key, or session secret.

## Database setup

Run `database/mysql/schema.sql` against MySQL 8.x. The schema creates the `stellar_dominion` database, `players`, and `api_config` tables.

## Local development

1. Install dependencies.
2. Install MySQL 8.x or connect to an existing MySQL server.
3. Create the schema with `database/mysql/schema.sql`.
4. Set the `MYSQL_*` variables from `backend/.env.example`.
5. Start the API with `tsx backend/mysql-api.ts`.
6. Set the frontend API base URL to the HTTPS API endpoint.

## Security baseline

- Use HTTPS for the production API.
- Keep MySQL private; never expose port 3306 directly to browsers.
- Use least-privilege MySQL credentials.
- Use parameterized queries.
- Restrict `CORS_ORIGINS` to the deployed frontend origin.
- Store secrets in the backend host's environment/secrets manager.
