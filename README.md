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

## Notes

- Entry: `src/main.tsx`
- Dashboard: `src/components/dashboard/DeliveryDashboard.tsx`
- Deliveries table: `src/components/deliveries/DeliveriesTable.tsx`
- Mock API: `src/api/mockApi.ts` and `src/api/dashboardStatusApi.ts`
- Set `VITE_USE_STUBS=false` and `VITE_API_BASE` in `.env` to call a live API
