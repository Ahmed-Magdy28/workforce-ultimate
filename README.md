# Workforce Ultimate — Enterprise Workforce & Project Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-workforce--ultimate.vercel.app-blue?style=for-the-badge&logo=vercel)](https://workforce-ultimate.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange?style=for-the-badge&logo=pwa)](https://workforce-ultimate.vercel.app/)

A modern, high-performance enterprise workforce, project management, and organizational collaboration platform inspired by **Jira**, **ClickUp**, and **Linear**. 

Built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **TypeScript**, and **Supabase (PostgreSQL with RLS & Realtime)**.

---

## 🌐 Live Application

Explore the live platform:
### 👉 **[https://workforce-ultimate.vercel.app/](https://workforce-ultimate.vercel.app/)**

---

## 🚀 Key Features by Roadmap Phases

### 🔵 Phase 1 — Foundation & Core Architecture
- **Next.js 16 App Router & Turbopack:** Full SSR, dynamic streaming, and sub-second page compilation.
- **Supabase Authentication:** Secure email/password login, signup, password recovery, and session persistence.
- **Multi-language Support (i18n):** Native English & Arabic localization with dynamic RTL layout switching.
- **Theme Customization:** Seamless Dark & Light mode toggle.

### 🔵 Phase 2 — Core MVP & Workforce Hierarchy
- **5-Tier Company Hierarchy:** Strict Role-Based Access Control (**Owner**, **Admin**, **HR**, **Managers**, and **Employees**).
- **Workspace Invitation System:** Multi-use and single-use invite codes with instant 1-click joining for authenticated users.
- **Company Management:** Timezone selection (auto-detected from browser, supports Egypt GMT+2), country of origin, and custom branding.
- **Project & Task Lifecycle:** Task creation, assignee management, status pipelines (`todo`, `in_progress`, `review`, `done`), and priority flags.
- **Time Estimation Workflow:** Estimated vs. actual logged labor tracking with approval states.
- **Dedicated Dashboards:** Custom role-based views for Owners, HR, Managers, and Employees.

### 🔵 Phase 2.5 — Essential Operations Hub
- **Daily Work Logs:** Employee end-of-day reports (tasks completed, hours worked, blockers, and mood ratings 1–5).
- **Performance Evaluation System:** Company OKRs, employee goal tracking, and periodic review cycles.
- **In-App & Email Notifications:** Real-time event notifications with notification preference controls.
- **Universal Search & Filtering:** Instant live filtering by keywords, status, dates, and assignees.
- **Operations Analytics:** Interactive charts for task completion rates and time distribution.

### 🔵 Phase 3 — Real-Time Collaboration
- **Real-Time Team Chat:**
  - 🌐 **Public Channels:** Workspace-wide discussions (`#general`, `#announcements`).
  - 🔒 **Private Channels:** Restricted to specifically invited coworkers.
  - 👔 **Management Channels:** Restricted strictly to Leadership (Owner, HR, Admins, Managers).
  - 💬 **Direct Messages (1:1):** Private direct chats between colleagues.
  - **Dynamic Sender Identity:** Every message displays real sender names and distinctive role badges (`OWNER`, `HR`, `MANAGER`, `EMPLOYEE`).
- **Task Attachments & Comments:** File uploads with Supabase Storage and threaded comments.
- **Activity Audit Logs:** Company-wide audit trail tracking all actions and security events.
- **HR Actions Management:** Formal bonuses and disciplinary warnings tracking.
- **Integration Hub:** GitHub commit sync, Gmail notifications, and webhook management.

### 🔵 Phase 4 — Scale & Polish
- **Progressive Web App (PWA):**
  - **Installable:** Installable on desktop and mobile home screens with custom manifest.
  - **Offline Resilience:** Service Worker (`public/sw.js`) caching core app shell with automatic offline detection.
  - **Web Push Notifications:** Real-time push notification subscriptions via Web Push API.
- **Multi-Tier Caching Strategy:** TanStack React Query caching presets (Metadata, Workspace, Standard, Dynamic, Realtime) and persistent offline queue.
- **Background Jobs Engine:** Asynchronous jobs queue (`background_jobs`, `job_logs`) with 1-click manual triggers (e.g. purge expired invites, sync integrations, weekly rollup).
- **Advanced Executive Reporting:**
  - Executive Workforce Overview (headcount, efficiency, log compliance).
  - Time & Delivery Variance Analysis (planned vs. actual hours).
  - Workforce Role Distribution Breakdown.
  - 📥 **Export to CSV:** Instant 1-click multi-section CSV report download.
  - 🖨️ **Printable Report / PDF Mode:** Clean document layout for printing or saving to PDF.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Realtime Subscriptions, Storage) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), [TanStack React Query v5](https://tanstack.com/query) |
| **Forms & Validation** | React Hook Form, Zod |
| **Internationalization** | i18next (English & Arabic with RTL support) |
| **PWA & Offline** | Service Worker, Web App Manifest, Web Push API |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```text
workforce-ultimate/
├── public/                 # Static assets, PWA manifest, service worker (sw.js), locales
├── sql/                    # Supabase PostgreSQL database migrations (RLS, functions, triggers)
│   ├── sql_creation_1.sql
│   ├── phase2_core_mvp.sql
│   ├── phase2_5_essential_features.sql
│   ├── phase3_collaboration.sql
│   ├── phase4_scale_and_polish.sql
│   ├── fix_invitations_validation.sql
│   └── chat_privacy_fix.sql
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, route handlers)
│   │   ├── (protected)/    # Authenticated workspace routes (dashboard, chat, people, more, etc.)
│   │   ├── (public)/       # Public marketing routes (landing, login, signup, roadmap, etc.)
│   │   └── manifest.ts     # Dynamic Next.js PWA Web App Manifest
│   ├── components/         # Reusable UI components & feature widgets
│   │   ├── collaboration/  # Real-time chat & collaboration views
│   │   ├── common/         # PWA banner, offline indicator, navbar, notifications
│   │   ├── jobs/           # Background jobs manager UI
│   │   ├── reporting/      # Advanced reporting & CSV export engine
│   │   └── ui/             # Core Radix/Tailwind design system primitives
│   ├── features/           # Domain feature modules (auth, company, tasks, projects, etc.)
│   ├── hooks/              # Custom React hooks (usePWA, useRole, useAuth, etc.)
│   ├── lib/                # Caching strategy, queryClient, i18n configuration
│   ├── providers/          # Global application providers
│   ├── services/           # Supabase client initialization
│   ├── store/              # Redux slices and store configuration
│   └── types/              # Domain TypeScript types & interfaces
└── package.json
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/) or [Bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project

### 2. Clone Repository
```bash
git clone https://github.com/AhmedMagdy01/workforce-ultimate.git
cd workforce-ultimate
```

### 3. Install Dependencies
```bash
bun install
# or: npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run Database Migrations
Open your **Supabase Dashboard ➔ SQL Editor** and execute the scripts in the [`/sql`](./sql) directory to set up tables, RLS policies, and RPC functions:
1. `sql/sql_creation_1.sql` (Initial Schema)
2. `sql/phase2_core_mvp.sql` (Role Hierarchy & Company Linking)
3. `sql/phase2_5_essential_features.sql` (Daily Logs, OKRs, Notifications)
4. `sql/phase3_collaboration.sql` (Real-Time Chat, Attachments, Integrations)
5. `sql/phase4_scale_and_polish.sql` (Background Jobs, Push Subscriptions)
6. `sql/fix_invitations_validation.sql` (Security Definer Invite Validation)
7. `sql/chat_privacy_fix.sql` (Channel Types & Member Permissions)

### 6. Start Development Server
```bash
bun run dev
# or: npm run dev
```

Visit [`http://localhost:4000`](http://localhost:4000) in your browser.

---

## 📦 Production Build

```bash
bun run build
bun run start
```

---

## 👨‍💻 Author

**Ahmed Magdy**  
*Senior Frontend / Full-Stack Engineer*  
- Live Application: [https://workforce-ultimate.vercel.app/](https://workforce-ultimate.vercel.app/)
- Repository: [https://github.com/Ahmed-Magdy28/workforce-ultimate](https://github.com/Ahmed-Magdy28/workforce-ultimate)
