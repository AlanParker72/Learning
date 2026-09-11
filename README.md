Delivery Status Vite + React + MUI

Quick start:

1. cd C:\projects\delivery-status-vite
2. npm install
3. npm run dev

This project is TypeScript-first. The mock API is implemented in src/api/mockApi.ts and the UI consumes TypeScript components under src/. Charts are separate components and the deliveries table supports search filters and URL query params.

Notes:
- Entry point: src/main.tsx
- App component: src/App.tsx
- Mock API: src/api/mockApi.ts (in-memory SAMPLE dataset, supports q, status, channel, page, pageSize)
- Charts: src/components/StatusChart.tsx and src/components/ChannelChart.tsx
- Table: src/components/DeliveriesTable.tsx (uses @mui/x-data-grid)

If you ran earlier versions with .jsx/.js files, those have been removed to keep the repo TypeScript-only.
