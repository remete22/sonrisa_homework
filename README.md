# Sonrisa — News Alert Admin System

## Table of Contents

1. [Requirement](#requirement)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Current Solution](#current-solution)
   - [Architecture Overview](#architecture-overview)
   - [Database Schema](#database-schema)
   - [API Layer](#api-layer)
   - [Frontend Layer](#frontend-layer)
   - [State Management](#state-management)
5. [Environment Variables](#environment-variables)
6. [Tech Debt](#tech-debt)

---

## Requirement

Sonrisa is a news alert administration system. The core concept is:

- An administrator can manage **news channels** — external news sources identified by a URL and optional API credentials (key / secret).
- Each registered **user** has exactly one **subscription**. A subscription ties the user to one or more channels and a delivery method (EMAIL or SLACK).
- When new content is available on a subscribed channel, the user should be notified via their chosen delivery method.
- All activity (successful sends, errors) must be recorded in a **log**.

The goal of this project is to build the admin panel that covers channel and subscription management, and to lay the groundwork for the notification dispatch pipeline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (`compatibilityVersion: 4`) |
| Language | TypeScript |
| Database | SQLite (via [Prisma 6](https://www.prisma.io)) |
| ORM | Prisma Client (`prisma-client-js`) |
| State | [Pinia](https://pinia.vuejs.org) (`@pinia/nuxt`) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) (`@nuxtjs/tailwindcss`) |
| Icons | `@nuxt/icon` (Heroicons set) |
| Password hashing | `bcryptjs` (cost factor 12) |
| Testing | Vitest + `@vue/test-utils` + `happy-dom` |
| Linting | ESLint (`@nuxt/eslint`, `@nuxtjs/eslint-module`) |
| Runtime | Node.js v24 |

> **shadcn-nuxt**, `radix-vue`, `lucide-vue-next`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `tailwindcss-animate` are listed as dependencies but are **not actively used**. They were installed during an earlier phase that was subsequently abandoned. They are safe to remove in a cleanup pass.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example below into a `.env` file at the project root and fill in your values:

```dotenv
DATABASE_URL="file:./prisma/dev.db"
NYT_API_KEY=""
NYT_API_SECRET=""
```

### 3. Set up the database

Run the migration and seed in one step:

```bash
npm run db:migrate
```

Or push the schema without a migration history and then seed manually:

```bash
npm run db:push
npm run db:seed
```

The seed creates:
- Roles: `ADMIN`, `USER`
- Subscription methods: `EMAIL`, `SLACK`
- Admin user: `test@user.com` / `test123`
- News channel: *New York Times – Top Stories* (populated from `NYT_API_KEY` / `NYT_API_SECRET`)

### 4. Start the development server

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

### Database scripts

| Script | Command | Description |
|---|---|---|
| `npm run db:migrate` | `prisma migrate dev` | Create a new migration and apply it |
| `npm run db:push` | `prisma db push` | Push schema without migration history |
| `npm run db:seed` | `prisma db seed` | Run `prisma/seed.ts` |
| `npm run db:generate` | `prisma generate` | Re-generate the Prisma client |
| `npm run db:studio` | `prisma studio` | Open Prisma Studio in the browser |

---

## Current Solution

### Architecture Overview

The application follows the strict **Nuxt 4 layer structure**:

```
app/             ← Nuxt frontend (pages, components, layouts, stores)
server/          ← Nitro server (API routes, server utilities)
prisma/          ← Schema, migrations, seed
public/          ← Static assets
```

**Key architectural decisions:**

- `useFetch` / `useAsyncData` are the **only** permitted data-fetching mechanisms in app code — raw `$fetch` is not used in any page or component.
- **Pinia stores are pure state.** They hold data and expose setters but make no API calls. All `useFetch` calls live inside `<script setup>` of pages or components, and results are pushed into the store via watchers or direct setters.
- Mutations (create, update) use `useFetch` with `{ immediate: false, watch: false }` and are triggered by calling `execute()`. After a successful mutation the list is refreshed via the `refresh()` handle from the corresponding list fetch.
- The Prisma client is a **lazy singleton** in `server/utils/prisma.ts`, auto-imported by Nitro. The database URL is read from `useRuntimeConfig()` so credentials never touch the client bundle.

### Database Schema

```
Roles              (id, name)
Users              (userId, email, password, roleId → Roles, isActive)
NewsChannels       (channelId, name, url, secret?, username?, isActive, createdAt)
SubscriptionMethods (methodId, methodName)
Subscriptions      (subscriptionId, userId → Users, methodId → SubscriptionMethods, channels ↔ NewsChannels)
Logs               (logId, userId → Users, channelId → NewsChannels, status, error?, createdAt)
```

Subscriptions and NewsChannels share an implicit many-to-many join table managed by Prisma.

### API Layer

All routes are versioned under `/api/v1/`.

#### Channels

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/channels` | Return all channels ordered by `createdAt` desc |
| `GET` | `/api/v1/channels/:id` | Return a single channel; 404 if not found |
| `PUT` | `/api/v1/channels` | Create a channel (`name` and `url` required) |
| `PATCH` | `/api/v1/channels/:id` | Update a channel; soft-delete sets `isActive: false` |

#### Subscriptions

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/subscriptions` | Return `{ users, methods }` — all users with their subscription (if any) and all delivery methods |
| `PUT` | `/api/v1/subscriptions` | Create a subscription for a user (`userId`, `methodId`, optional `channelIds[]`) |
| `PATCH` | `/api/v1/subscriptions/:id` | Update an existing subscription (`methodId?`, `channelIds?` replaces the channel set via Prisma `set`) |

### Frontend Layer

A single route (`/`) renders a tabbed admin panel.

**Tabs:**

| Tab | Content |
|---|---|
| Channels | Searchable channel list with create / edit / soft-delete actions |
| Subscriptions | List of all users, each with an inline subscription editor |

**Component tree:**

```
app/pages/index.vue          ← data fetching, modal state, mutation handlers
  TabBar.vue                 ← tab switcher (v-model)
  ── Channels tab
       PageHeader.vue        ← search bar + "New Channel" button
       ChannelList.vue       ← reads store.filtered, edit/delete icons
       ChannelModal.vue      ← create / edit form, useFetch mutations
       ConfirmModal.vue      ← soft-delete confirmation
  ── Subscriptions tab
       SubscriptionList.vue  ← fetches /api/v1/subscriptions, renders cards
         SubscriptionCard.vue ← per-user inline editor (method radio + channel combobox)
           ChannelCombobox.vue ← multi-select dropdown with search
app/layouts/default.vue      ← wraps every page
  AppHeader.vue              ← site header (branding only)
```

### State Management

**`stores/channels.ts`**
- `channels` — raw list from the API
- `search` — search string bound to `PageHeader`
- `filtered` — computed list filtered by name/url
- `setChannels(data)` — called from `index.vue` watcher after every fetch

**`stores/subscriptions.ts`**
- `users` — list of `UserWithSubscription`
- `methods` — list of `SubscriptionMethod`
- `setUsers(data)` / `setMethods(data)` — called from `SubscriptionList` after fetch

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma datasource URL. For local dev: `file:./prisma/dev.db` |
| `NYT_API_KEY` | No | New York Times API key. Stored as `username` on the NYT channel record. |
| `NYT_API_SECRET` | No | New York Times API secret. Stored as `secret` on the NYT channel record. |

> **Security note:** Never commit real credentials to source control. The `.env` file should be listed in `.gitignore`.

---

## Tech Debt

The items below are known gaps between the current state and a production-ready system. They are documented here to provide a clear roadmap for the next development phase.

### 1. Authentication and Authorization

**Status:** Removed — not implemented.

**Background:** An integration with `@sidebase/nuxt-auth` (credentials strategy) was attempted. It was abandoned because the library's session endpoint URL resolution caused an infinite recursion loop (`/session` instead of `/api/auth/session`) that could not be resolved within the available time.

**What needs to be done:**
- Re-evaluate `@sidebase/nuxt-auth` with an explicit `baseURL` override, or switch to a lighter alternative (e.g. a custom JWT/cookie implementation using Nuxt server middleware).
- Implement a `server/api/auth/[...].ts` catch-all handler that validates credentials against the `Users` table using `bcryptjs.compare()`.
- Create `app/pages/login.vue` with an email + password form.
- Add a global Nuxt middleware (`app/middleware/auth.global.ts`) that redirects unauthenticated requests to `/login`.
- Protect all `/api/v1/` routes with a server-side session check.
- All seeded passwords are already hashed with bcryptjs (cost factor 12) so the database is ready.

### 2. Debugging Router Behaviour

**Status:** Unresolved — workaround in place.

**Background:** When a separate `/subscriptions` page was introduced, the Nuxt router intermittently redirected to the index route or threw hydration mismatches. The root cause was not isolated — likely a stale `.nuxt` compiled cache containing a ghost `sidebase-auth` global middleware. The subscriptions page was scrapped and replaced with a tab on the index page to unblock progress.

**What needs to be done:**
- Perform a clean build (`rm -rf .nuxt && npm run build`) in a CI environment to confirm whether the issue reproduces without cache.
- Investigate whether removing the unused `shadcn-nuxt` module (which registers its own Nuxt hooks) resolves the instability.
- Once the root cause is confirmed, restore the `/subscriptions` route as a proper page to improve code separation.
- Add `vitest` route-level integration tests to catch regressions.

### 3. Reintroducing the Header and Layout Navigation

**Status:** Simplified — navigation links removed.

**Background:** During the auth removal phase the layout was stripped to a minimal header (branding only) because navigation links pointed to routes that no longer existed. The tab-based layout was introduced as a stopgap.

**What needs to be done:**
- Once multi-page routing is stable, update `app/layouts/default.vue` to include a proper `<nav>` with links to all top-level sections.
- Update `AppHeader.vue` to render navigation links and highlight the active route using `useRoute()`.
- Decide whether to keep tabs for in-page navigation or promote them to full routes.

### 4. Writing Tests to Cover the Current Codebase

**Status:** Test infrastructure in place (`vitest`, `@nuxt/test-utils`, `@vue/test-utils`, `happy-dom`). Zero tests written.

**What needs to be done:**

**Unit tests** (`test/unit/`):
- Pinia stores: verify `setChannels`, `setMethods`, `filtered` computed.
- Utility functions: any pure helpers extracted from components.

**Component tests** (`test/nuxt/`):
- `ChannelModal` — renders create/edit form, emits `saved` on success.
- `ChannelList` — renders channels from store, emits `edit`/`delete` events.
- `SubscriptionCard` — radio group, combobox interaction, mutation flow.
- `ConfirmModal` — emits `confirm` on button click.

**API integration tests**:
- `GET /api/v1/channels` — returns seeded channel list.
- `PUT /api/v1/channels` — rejects missing `name`/`url`, creates channel.
- `PATCH /api/v1/channels/:id` — soft-delete sets `isActive: false`.
- `PUT /api/v1/subscriptions` — creates subscription for user.
- `PATCH /api/v1/subscriptions/:id` — replaces channel set.

Use `@nuxt/test-utils` `setup()` with an in-memory SQLite database for API tests to avoid polluting the development database.

### 5. Implementing the Notification Dispatch (Cron Job)

**Status:** Not implemented — schema and subscription data model are ready.

**Background:** The entire purpose of the system is to deliver notifications when new content appears on a subscribed channel. The database has a `Logs` table ready to record dispatch events. No polling or sending mechanism exists yet.

**What needs to be done:**

1. **Poller service** — A Nitro scheduled task (or an external cron) that, on a configurable interval:
   - Iterates over all active `NewsChannels`.
   - Fetches the channel URL with the stored credentials.
   - Compares the response against the last known state (e.g. a hash or timestamp stored in `Logs`).
   - If new content is detected, queues notifications for all subscribers of that channel.

2. **Email delivery** — For subscriptions with `method = EMAIL`:
   - Integrate a transactional email provider (e.g. Nodemailer + SMTP, Resend, or SendGrid).
   - Format a digest email with the new article headlines and links.
   - Record the attempt in `Logs` with `status = 'sent'` or `status = 'error'`.

3. **Slack delivery** — For subscriptions with `method = SLACK`:
   - Use the user's stored `secret` (Slack incoming webhook URL) to `POST` a message payload.
   - Record the attempt in `Logs`.

4. **Scheduling** — Nitro supports `defineNitroScheduledTask` (experimental) for in-process scheduling, or the poller can be an external Node script triggered by an OS cron / GitHub Action.

5. **NYT API integration** — The NYT Top Stories API returns a JSON feed. The poller should parse `results[].title`, `results[].url`, and `results[].published_date` to build the notification payload.

