# Ajay Chodankar | Dynamic Portfolio

A modern, high-performance portfolio platform completely dynamically driven by a custom Admin Content Management System (CMS). 

**Tech Stack**: Next.js 16 (App Router), React, Tailwind CSS v4, PostgreSQL, Prisma ORM, NextAuth.js, Framer Motion.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js (npm)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Environment Variables Configuration
Copy the `.env.example` to `.env` or create a `.env` file in the root directory. You must set the following variables:

```env
# PostgreSQL connection string (Docker uses port 5433 by default via docker-compose)
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5433/portfolio_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="A_VERY_SECURE_RANDOM_SECRET_KEY_HERE"
```

### 2. Automated Launch
To effortlessly spin up the entire backend and schedule database backups, open a terminal in Windows as Administrator (optional but recommended for task scheduling) and run:

```powershell
.\launch.ps1
```

**What the Launch Script does:**
1. Starts the `portfolio_db` PostgreSQL container silently using Docker Compose.
2. Synchronizes the Prisma Schema to the running database.
3. Conditionally populates the database with initial dummy data if the tables are empty.
4. Natively registers a Windows Scheduled Task (`PortfolioNightlyBackup`) to automatically run `pg_dump` every night at 3:00 AM!

### 3. Start Frontend & Initial Setup
Once the background infrastructure is ready, start your frontend local development server:

```bash
npm run dev
```

Next, open your browser and navigate to `http://localhost:3000/admin`. 

> **Security Note:** Upon first launch, the app will instantly redirect you to the **`/setup`** onboarding flow. Follow the screen instructions to natively register your Root Administrator credentials (`Username`, `Email`, and `Password`). Once created, the setup closes forever and you can access your protected CMS!

---

## 🎨 Admin Dashboard Capabilities
The `/admin` dashboard securely handles:
- Checking overall portfolio site statistics (total Projects, Experiences).
- Updating, deleting, or adding new Projects.
- All live site content changes update in real-time across your frontend views via Next.js Server Actions.

---

## 📝 Roadmap & Future Features (TODO)

- [ ] **Dynamic Resume Generation:** Integrate `@react-pdf/renderer` to dynamically compile and offer an auto-updated, beautifully formatted `.pdf` resume strictly originating from the live Postgres Database.
- [ ] **Dedicated Markdown Blog Engine:** Introduce a `BlogPost` Prisma model & dynamic routes (`/blog/[slug]`) paired with a robust Rich-Text/MDX editor within the CMS to natively post detailed AI/ML research notes directly entirely within the platform.
- [ ] **Cloud Storage Integration (Media):** Replace raw URL linking references with Amazon S3 or Vercel Blob integrations allowing seamless "Drag & Drop" media uploading directly inside the Admin editing panels. 
- [ ] **Markdown Formatted Project Cards:** Render `react-markdown` on the live portfolio to allow formatted bold texts, blockquotes, and internal referencing syntax directly inside entity descriptions for a much richer exhibition interface. 
- [ ] **Privacy-focused Custom Analytics:** Establish a lightweight `PageViews` metrics table & Recharts visualizations inside the Admin dashboard to natively track, trace, and aggregate demographic traffic routing strictly without implementing obtrusive 3rd-party cookie trackers like Google Analytics.
