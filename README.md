# Dynamic Portfolio CMS

A reusable portfolio platform with a polished public site, a full admin panel, media uploads, dynamic content sections, and first-run onboarding.

This project is built so you can use it as your own portfolio starter instead of editing hardcoded files every time.

## Stack

- Next.js 16 App Router
- React
- Tailwind CSS v4
- PostgreSQL
- Prisma ORM
- NextAuth credentials auth
- Framer Motion
- MinIO / S3-compatible object storage

## What This Project Supports

- Public portfolio website with animated landing page and editable sections
- Admin dashboard for managing content without touching code
- First-run setup flow: the site stays locked until the first admin account is created
- Automatic placeholder seeding so a fresh install is not empty
- Dynamic badge initials in the navbar and favicon based on the configured name
- Drag-and-drop ordering in admin for sortable sections
- Drag-and-drop media upload plus URL-based media fields
- Optional images on supported records
- S3-compatible media storage via MinIO by default
- Factory reset flag for wiping the app back to setup mode

## Editable Sections

The admin panel currently manages:

- Site settings
- Experience
- Projects
- Skills
- Education
- Achievements
- References

Media uploads are supported where relevant, including profile image, project media, education certificates, achievement images, and reference photos.

## First-Run Behavior

On a clean install:

1. The database schema is applied automatically.
2. Seed data is inserted automatically so the site has placeholder content.
3. The public homepage remains locked and shows a setup prompt.
4. You create the first admin account at `/setup`.
5. After signup, you sign in and manage the site through `/admin`.

The seeded content is useful both for your own first launch and for anyone reusing this project as a template.

## Environment Variables

Set these values in your environment before launching the production stack.

### Required

```env
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

### Optional but Common

```env
NEXTAUTH_URL="https://your-domain.example"
FACTORY_RESET="false"
```

### Notes

- `NEXTAUTH_SECRET` is optional if you want the app to generate and persist one automatically into `./runtime/nextauth_secret`.
- If you do provide `NEXTAUTH_SECRET`, it will still be synced into runtime storage for persistence across container recreations.
- `NEXTAUTH_URL` is optional in production if your deployment forwards the correct host/protocol headers, but setting it explicitly is often cleaner.
- `FACTORY_RESET=true` wipes the app back to a clean state on the next container boot, then the container can be started normally again with `FACTORY_RESET=false`.

## Local Development with Docker

For local testing, the project includes `docker-compose.local.yml`.

That stack exposes:

- App on `http://localhost:3000`
- Postgres on `localhost:5433`
- MinIO API on `http://localhost:9000`
- MinIO console on `http://localhost:9001`

Local `.env` values currently support that flow.

### Launch local stack

```bash
docker compose -f docker-compose.local.yml up -d --build
```

### Local env values used by the app

```env
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5433/portfolio_db?schema=public"
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL_LOCAL="http://localhost:3000"
STORAGE_ENDPOINT="http://localhost:9000"
STORAGE_REGION="us-east-1"
STORAGE_BUCKET="portfolio-media"
STORAGE_ACCESS_KEY="minioadmin"
STORAGE_SECRET_KEY="minioadmin"
FACTORY_RESET="false"
```

### Local factory reset

If you want to go back to setup mode locally:

```bash
FACTORY_RESET=true docker compose -f docker-compose.local.yml up -d --build
```

Then start it again normally:

```bash
FACTORY_RESET=false docker compose -f docker-compose.local.yml up -d --build
```

## Production Docker Stack

The main production stack is defined in `docker-compose.yml`.

Important behavior:

- Postgres is internal to Docker
- MinIO is internal to Docker
- The app container talks to `db:5432` and `minio:9000`
- The app exposes port `3000` internally for container-to-container access
- The stack includes an external `setup_npm` network entry because this project was prepared for reverse-proxy-based deployments

### Launch production stack

```bash
docker compose up -d --build
```

### Production env values used by the app

```env
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="https://your-domain.example"
FACTORY_RESET="false"
```

The remaining values for the production compose file are already declared inside `docker-compose.yml`:

- `DATABASE_URL` points to the internal Postgres service
- `STORAGE_ENDPOINT` points to the internal MinIO service
- storage bucket and access credentials are provided through the compose file

If you want to replace MinIO with another S3-compatible provider, update the storage-related values accordingly.

## Media Storage

Uploads are stored in S3-compatible object storage.

By default:

- local debug stack uses MinIO exposed on localhost
- production compose uses MinIO as an internal container service
- MinIO object files are stored locally in `./data/minio`

The app serves uploaded files through its own `/api/media/...` route, which allows storage to stay internal.

## Auth Secret Persistence

The app persists its auth secret in a runtime folder.

- production runtime secret path: `./runtime/nextauth_secret`
- local debug runtime secret path: `./runtime_debug/nextauth_secret`

Behavior:

- if `NEXTAUTH_SECRET` is provided, it is copied into runtime storage
- if `NEXTAUTH_SECRET` is missing and a runtime secret file exists, that secret is reused
- if both are missing, the app generates a secret automatically and saves it

This makes auth more portable across rebuilds and server moves.

## Admin Features

The admin panel includes:

- dashboard overview
- CRUD flows for all main content sections
- drag-to-reorder for supported content lists
- media upload inputs with drag-and-drop
- optional URL-based media fields
- seeded placeholder content to guide first-time editing

## Factory Reset

Factory reset is intended for cases where you want to return the project to first-launch state.

When enabled:

- database schema contents are wiped
- uploaded media in the configured storage bucket is cleared when available
- schema is recreated
- seed data is inserted again
- the site returns to setup mode because no admin account exists

Use this carefully in real deployments.

## Data Recovery Model

The current recovery model is intentionally split:

- live Postgres state is kept in a Docker volume
- Postgres backups are written to `./db_backups`
- MinIO media files are kept in `./data/minio`
- auth secret is kept in `./runtime`

On a fresh Postgres initialization:

- if `./db_backups` contains SQL dumps, the newest backup is restored automatically
- if no SQL dump exists, the database starts empty and the app seeds placeholder content

This means:

- media files move with the project folder
- auth secret moves with the project folder
- database recovery happens from SQL backups rather than from copying raw Postgres data files

## Current Product Notes

This project already includes several quality-of-life improvements added during recent development:

- setup-first lock screen when no admin exists
- signup flow followed by admin login
- proxy-safe auth behavior
- dynamic initials badge and favicon
- seeded skills and placeholder content on fresh installs
- dynamic achievements and references support
- optional image support across relevant sections

## Backups

The production compose file includes a `db-backup` container that runs nightly Postgres dumps into:

```text
./db_backups/
```

If the database starts from an empty state later, the newest backup in that folder is used automatically during initialization.

## Useful Routes

- `/` public site
- `/setup` first admin creation
- `/admin` admin dashboard
- `/api/auth/signin` sign-in page

## Recommended Cleanup After Cloning

If you are reusing this as your own portfolio:

1. Start the stack.
2. Complete `/setup`.
3. Review the seeded placeholder content in `/admin`.
4. Replace it section by section with your own data.
5. Update site settings first so the initials badge/favicon match your own name.

## Future Ideas

Some natural next steps for this project:

- richer project detail views
- exportable resume generation
- blog or writing section
- analytics dashboard
- richer reference formatting helpers
