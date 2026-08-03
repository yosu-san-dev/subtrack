# Subtrack

A personal subscription and payment tracking API. Manage your recurring subscriptions, log payments, organize with categories, and switch between multiple accounts — all stored locally with SQLite.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Auth | Session tokens (stored in DB, no expiry) |
| Password Hashing | bcryptjs |

## Architecture

```
HTTP Request
    ↓
routes/          — defines endpoints, applies middleware
    ↓
controllers/     — handles req/res, input validation
    ↓
services/        — business logic, orchestration, rules
    ↓
models/          — raw DB queries via better-sqlite3
    ↓
database/        — SQLite connection, migrations, seeds
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm**

### Install

```bash
git clone https://github.com/yosu-san-dev/subtrack.git
cd subtrack
npm install
```

### Environment Variables

Create a `.env.development.local` file in the project root:

```env
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000
JWT_SECRET=<generate-a-secure-random-string>
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `SERVER_URL` | Base URL of the server | — |
| `DB_PATH` | Path to SQLite database file | `./subtrack.db` |
| `JWT_SECRET` | Secret used for legacy/future token needs | — |

### Run

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

On first boot the server will:
1. Create `subtrack.db` in the project root
2. Run all table migrations
3. Seed 8 default categories

## Database

The database is a single SQLite file (`subtrack.db`) created automatically on first boot.

### Tables

- **users** — name, email, password, role
- **sessions** — auth tokens, active account reference
- **accounts** — multi-account support per user
- **categories** — system defaults + user-created custom
- **subscriptions** — recurring subscriptions tied to accounts
- **payments** — payment log tied to accounts

### Inspecting the Database

Use [DB Browser for SQLite](https://sqlitebrowser.org/) or any SQLite client to open `subtrack.db`.

## Roles

| Role | Description |
|---|---|
| `user` | Default role for all new users |
| `admin` | Administrative access (future use) |
| `developer` | Developer-level access (future use) |

Roles are stored on the `users` table. Role-based middleware guards are planned for the future.

## Multi-Account

Each user can own multiple **accounts** (e.g., Personal, Business). Subscriptions and payments are scoped to accounts, not directly to users.

- On sign-up, a default **"Personal"** account is created
- Create additional accounts via `POST /api/v1/accounts`
- Switch active account via `POST /api/v1/accounts/:id/switch`
- All subscription/payment operations use the **active account** from the session

## API Reference

All endpoints except auth require a `Authorization: Bearer <token>` header.

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/sign-up` | Register a new user |
| `POST` | `/api/v1/auth/sign-in` | Sign in |
| `POST` | `/api/v1/auth/sign-out` | Sign out (invalidates token) |

### Accounts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/accounts` | List all accounts |
| `POST` | `/api/v1/accounts` | Create a new account |
| `GET` | `/api/v1/accounts/:id` | Get account details |
| `PUT` | `/api/v1/accounts/:id` | Update account |
| `DELETE` | `/api/v1/accounts/:id` | Delete account |
| `POST` | `/api/v1/accounts/:id/switch` | Switch active account |

### Subscriptions

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/subscriptions` | List subscriptions (active account) |
| `POST` | `/api/v1/subscriptions` | Create subscription |
| `GET` | `/api/v1/subscriptions/:id` | Get subscription |
| `PUT` | `/api/v1/subscriptions/:id` | Update subscription |
| `DELETE` | `/api/v1/subscriptions/:id` | Delete subscription |
| `PUT` | `/api/v1/subscriptions/:id/cancel` | Cancel subscription |
| `GET` | `/api/v1/subscriptions/upcoming-renewals` | Upcoming renewals |

### Payments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/payments` | List payments (active account) |
| `POST` | `/api/v1/payments` | Log a payment |
| `GET` | `/api/v1/payments/:id` | Get payment |
| `DELETE` | `/api/v1/payments/:id` | Delete payment |

**Query filters:** `?category=`, `?type=`, `?from=`, `?to=`

**Payment types:** `periodic`, `one-time`, `other`

### Categories

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/categories` | List all categories |
| `POST` | `/api/v1/categories` | Create custom category |
| `DELETE` | `/api/v1/categories/:id` | Delete custom category |

### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/users/:id` | Get user profile |

## Project Structure

```
subtrack/
├── app.js                          # Express app entry point
├── package.json
├── .env.development.local          # Environment variables
│
├── config/
│   └── env.js                      # Loads env vars
│
├── database/
│   ├── sqlite.js                   # DB connection + init
│   ├── migrations.js               # Table creation
│   └── seed.js                     # Default categories
│
├── models/                         # Data access (SQL queries)
│   ├── user.model.js
│   ├── session.model.js
│   ├── account.model.js
│   ├── category.model.js
│   ├── subscription.model.js
│   └── payment.model.js
│
├── services/                       # Business logic
│   ├── auth.service.js
│   ├── account.service.js
│   ├── category.service.js
│   ├── subscription.service.js
│   └── payment.service.js
│
├── controllers/                    # HTTP handlers
│   ├── auth.controller.js
│   ├── account.controller.js
│   ├── category.controller.js
│   ├── subscription.controller.js
│   ├── payment.controller.js
│   └── user.controller.js
│
├── routes/                         # Route definitions
│   ├── auth.routes.js
│   ├── account.routes.js
│   ├── category.routes.js
│   ├── subscription.routes.js
│   ├── payment.routes.js
│   └── user.routes.js
│
├── middlewares/
│   ├── auth.middleware.js          # Token verification
│   └── error.middleware.js         # Global error handler
│
└── utils/                          # (empty — reserved for helpers)
```
