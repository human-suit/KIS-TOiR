# Database Runtime

The generated project must include a **PostgreSQL development database** so the application can run immediately after generation without manual database setup.

Use **Docker** to provision the database.

---

# docker-compose.yml

The generator must create a `docker-compose.yml` file at the **project root** (same level as `server/` and `client/` directories).

## Example

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16
    container_name: toir-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: toir
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# Rules

- **Location:** Project root (e.g. `TOiR-generation/docker-compose.yml` or monorepo root).
- **Service name:** Can be `postgres` or project-specific (e.g. `toir-postgres` as container_name).
- **Credentials and DB name** must match the `DATABASE_URL` in `server/.env`:
  - User: `postgres`
  - Password: `postgres`
  - Database: `toir`
  - Host: `localhost`
  - Port: `5432`
- **Volume:** Use a named volume so data persists across container restarts.

---

# Usage

Start the database before running the backend:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Without this file and a running database, the backend will fail at runtime with errors such as:

```
PrismaClientInitializationError P1001: Can't reach database server at localhost:5432
```
