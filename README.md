# Delivery Performance Dashboard

Vite + React + TypeScript dashboard for message delivery status. The UI is the dashboard canvas only (no product sidebar).

## Quick start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – local development server
- `npm run typecheck` – TypeScript check
- `npm run build` – typecheck + production bundle

## Environment

Copy `.env.example` to `.env`:

- `VITE_USE_STUBS=true` — use stubs under `src/stubs/` (default)
- `VITE_USE_STUBS=false` — call live APIs via axios (`withCredentials: true`)
- `VITE_API_BASE_URL` / `VITE_API_BASE` — axios `baseURL` for live mode (also overridable from `main.tsx` `appConfig.apiBaseUrl`)

## Bootstrap (`src/main.tsx`)

```ts
const appConfig = {
  roles: ['ADMIN', 'READ_ONLY'],
  selectedRole: 'ADMIN', // set to 'READ_ONLY' to hide Acknowledge/Resend
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? '',
}
```

Provided via `AppConfigProvider` so the deliveries table and HTTP client can read them.

## Notes

- Entry: `src/main.tsx`
- Dashboard: `src/components/dashboard/DeliveryDashboard.tsx`
- Deliveries table: `src/components/deliveries/DeliveriesTable.tsx`
- Roles: `ADMIN` (actions) / `READ_ONLY` (view only)
- HTTP: `src/api/httpClient.ts` (axios only)
- Stubs: `src/stubs/` (one file per API)
