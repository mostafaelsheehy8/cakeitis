# Cakeitis

Web app for Cakeitis, a tiramisu cloud kitchen: menu, cart, cash-on-delivery checkout, event booking requests and a small admin panel.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · MongoDB + Mongoose

## Run locally

Requirements: Node 20+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run seed                 # loads the 6 menu flavours
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | e.g. `mongodb://127.0.0.1:27017/cakeitis` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the admin cookie |

`.env.local` is git-ignored. Never commit it.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Landing page |
| `/menu` | Flavours with Cup / Small tray / Large tray sizes |
| `/cart`, `/checkout` | Cart (saved in localStorage) and COD checkout |
| `/order/[id]` | Order confirmation |
| `/events` | Event booking request form |
| `/admin` | Orders and bookings with status updates (password protected) |

## API

- `GET /api/products`
- `POST /api/orders`: the server looks prices up in the DB; client prices are ignored
- `POST /api/events`
- `POST /api/admin/login`, `POST /api/admin/logout`
- `PATCH /api/admin/orders/:id`, `PATCH /api/admin/events/:id` with body `{ "status": "..." }`

`/admin/*` and `/api/admin/*` are protected by `src/middleware.ts` (HMAC-signed, httpOnly cookie, 12h).

## Editing the menu

Change the list in `scripts/seed.ts` and run `npm run seed` again. It upserts by `slug`, so existing products keep their ids.

## Later phases

Online payment (Paymob / InstaPay), customer accounts, notifications (WhatsApp/email), real product photos, Arabic/RTL, deployment.
