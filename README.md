# Gym Management

A small dashboard for managing gym members. It supports creating, editing, deleting, searching and filtering members through a local mock API.

## Features

- Add new members with name, email, phone and status
- Edit a member by selecting it from the table (the form pre-fills and stays in edit mode until cancelled)
- Delete a member with a confirmation prompt
- Search across name, email and phone, combined with an All / Active / Inactive status filter
- Toast notifications for create/update/delete results
- Responsive, accessible UI with loading, empty and error states

## Tech stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit Query for API state and caching
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- shadcn/ui (Radix Nova preset) with Lucide icons
- sonner for toasts
- json-server as the local REST API

## Prerequisites

- Node.js 20.19+ (or 22.12+)
- npm

## Getting started

```bash
npm install
```

Start the mock API in one terminal:

```bash
npm run start
```

Start the Vite dev server in another:

```bash
npm run dev
```

Then open <http://localhost:5173>.

The API base URL is set to `http://localhost:3001` in `src/features/members/members.api.ts`, so both servers need to be running. Member data is stored in `db.json` and json-server writes changes back to it.

## Scripts

| Script            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                      |
| `npm run start`   | Start json-server on port 3001 (watches data)  |
| `npm run srv`     | Start json-server on port 3001 (no watch)      |
| `npm run build`   | Type-check and build for production            |
| `npm run lint`    | Run ESLint                                     |
| `npm run preview` | Preview the production build locally           |

## Project structure

```
src/
├── app/store.ts                     # Redux store + API middleware
├── components/ui/                   # Generated shadcn/ui components
├── features/members/
│   ├── members.api.ts               # RTK Query endpoints
│   ├── members.types.ts             # Member / NewMember types
│   ├── CreateMember.tsx             # Create + edit form
│   └── MembersList.tsx              # Table, search and filters
├── App.tsx                          # Page shell, header and toaster
└── index.css                        # Tailwind + shadcn theme tokens
public/favicon.svg
components.json                      # shadcn CLI configuration
db.json                              # Local mock database
```

## API endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | `/members`        | List all members  |
| POST   | `/members`        | Create a member   |
| PUT    | `/members/:id`    | Update a member   |
| DELETE | `/members/:id`    | Delete a member   |

## Adding more shadcn components

The `@/*` import alias is configured in both `tsconfig.app.json` and `vite.config.ts`, so the CLI works directly:

```bash
npx shadcn@latest add dialog
```

Generated components land in `src/components/ui/`. Theme tokens live in `src/index.css`.
