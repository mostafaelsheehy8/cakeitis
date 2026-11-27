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
| `/admin` | Orders, bookings and products (password protected) |

## API

- `GET /api/products`
- `POST /api/orders`: the server looks prices up in the DB; client prices are ignored
- `POST /api/events`
- `POST /api/admin/login`, `POST /api/admin/logout`
- `PATCH /api/admin/orders/:id`, `PATCH /api/admin/events/:id` with body `{ "status": "..." }`

`/admin/*` and `/api/admin/*` are protected by `src/middleware.ts` (HMAC-signed, httpOnly cookie, 12h).

## Event pricing

The booking form shows an estimated price from the number of guests: a flat per-guest rate based on 150 guests = 7800 EGP, rounded to the nearest 50 EGP. The server computes and stores the estimate. To change the rate, edit `EVENT_REFERENCE_GUESTS` / `EVENT_REFERENCE_PRICE` in `src/lib/config.ts`.

## Editing the menu

Log in to `/admin` and open the **Products** tab: add products, change names, descriptions, sizes and prices, pick a photo, hide or delete. Changes show on the menu straight away.

Photos are picked from the list in `src/lib/productInput.ts` (`PRODUCT_PHOTOS`). To offer a new photo, put the file in `public/products/` and add it to that list.

`npm run seed` is only for setting up a fresh database. It overwrites the seeded products and hides any product not in `scripts/seed.ts`, so don't run it against the live database once you edit products from the admin.

## Later phases

Online payment (Paymob / InstaPay), customer accounts, notifications (WhatsApp/email), real product photos, Arabic/RTL, deployment.
