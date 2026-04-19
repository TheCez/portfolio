# Ajay Chodankar | Dynamic Portfolio

A modern, high-performance portfolio platform completely dynamically driven by a custom Admin Content Management System (CMS). 

**Tech Stack**: Next.js 16 (App Router), React, Tailwind CSS v4, PostgreSQL, Prisma ORM, NextAuth.js, Framer Motion, MinIO (S3-compatible media storage).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js (npm)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Environment Variables Configuration
Copy the `.env.example` to `.env` or create a `.env` file in the root directory. You must set the following variables:

```env
# PostgreSQL connection string (Strictly isolated internal Docker network 'portfolio' on internal port 5432)
DATABASE_URL="postgresql://portfolio_user:portfolio_password@db:5432/portfolio_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com" # Update for production
NEXTAUTH_SECRET="A_VERY_SECURE_RANDOM_SECRET_KEY_HERE"

# S3-compatible media storage
STORAGE_ENDPOINT="http://localhost:9000"
STORAGE_REGION="us-east-1"
STORAGE_BUCKET="portfolio-media"
STORAGE_ACCESS_KEY="minioadmin"
STORAGE_SECRET_KEY="minioadmin"
```

### 2. Full OS-Agnostic Launch
This architecture is built strictly for Linux via Docker natively. You do NOT need Node.js or PM2 installed on the host operating system. To seamlessly spin up the entire cluster, simply run:

```bash
docker compose up -d --build
```

**What the Entrypoint does:**
1. Spins up the `db` Postgres cluster, the `db-backup` cron container, and a local `minio` media storage service.
2. Uniquely triggers `entrypoint.sh` inside the Next.js container on boot.
3. Automatically executes `prisma db push` and `prisma/seed.ts` *internally* to guarantee your database schemas are aligned and data exists before it starts the live server.
4. Auto-maps to port `3000` on your local machine so you can test the site directly at `http://localhost:3000`.
5. Exposes MinIO on `http://localhost:9000` and the MinIO console on `http://localhost:9001` for media inspection.

> **Nightly Backups:** The cluster automatically creates SQL backup dumps every night at 3:00 AM straight into the localized `./db_backups/` directory mapped on your host machine.

### 3. Accessing Your Portfolio & Initialization
Since the container stack handles compilation and initialization, your application is fully live!

Open your browser and navigate to `<your-configured-domain>/admin`.

> **Security Note:** Upon first launch, the app will instantly redirect you to the **`/setup`** onboarding flow. Follow the screen instructions to securely register your Root Administrator credentials (`Username`, `Email`, and `Password`). Once created, the setup closes forever and you gain full CMS access!

---

## 🎨 Admin Dashboard Capabilities
The `/admin` dashboard securely handles:
- Checking overall portfolio site statistics (total Projects, Experiences).
- Updating, deleting, or adding new Projects.
- Uploading project images / videos and managing core site settings like the profile image and homepage copy.
- All live site content changes update in real-time across your frontend views via Next.js Server Actions.

---

## 📝 Roadmap & Future Features (TODO)

- [ ] **Dynamic Resume Generation:** Integrate `@react-pdf/renderer` to dynamically compile and offer an auto-updated, beautifully formatted `.pdf` resume strictly originating from the live Postgres Database.
- [ ] **Dedicated Markdown Blog Engine:** Introduce a `BlogPost` Prisma model & dynamic routes (`/blog/[slug]`) paired with a robust Rich-Text/MDX editor within the CMS to natively post detailed AI/ML research notes directly entirely within the platform.
- [x] **Cloud Storage Integration (Media):** Added MinIO-based S3-compatible uploads so portfolio images and videos can be managed from the admin panel without hardcoding paths.
- [ ] **Markdown Formatted Project Cards:** Render `react-markdown` on the live portfolio to allow formatted bold texts, blockquotes, and internal referencing syntax directly inside entity descriptions for a much richer exhibition interface. 
- [ ] **Privacy-focused Custom Analytics:** Establish a lightweight `PageViews` metrics table & Recharts visualizations inside the Admin dashboard to natively track, trace, and aggregate demographic traffic routing strictly without implementing obtrusive 3rd-party cookie trackers like Google Analytics.
