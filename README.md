# Job Application Tracker

A small app for tracking job applications from wishlist to offer, built with
Next.js (App Router), Tailwind CSS, and Prisma + SQLite.

## Features

- **List view** (`/`) — table of all applications with status filtering and sorting
- **Add / edit form** (`/applications/new`, `/applications/[id]/edit`)
- **Kanban board** (`/board`) — drag and drop applications between status columns
  (Wishlist, Applied, Interview, Offer, Rejected)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The SQLite database (`dev.db`) ships with seed data. To reset and re-seed it:

```bash
npx prisma migrate reset
```

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) with SQLite (via `@prisma/adapter-better-sqlite3`)
- [dnd-kit](https://dndkit.com) for the kanban board

## Project structure

- `src/app/page.tsx` — list view
- `src/app/board/page.tsx` + `src/components/Board.tsx` — kanban board
- `src/app/applications/new`, `src/app/applications/[id]/edit` — add/edit form pages
- `src/app/api/applications` — CRUD API routes
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — sample data
