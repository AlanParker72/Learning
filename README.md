# RBAC Dashboard Scaffold

Config-driven React + TypeScript dashboard shell. One `Dashboard` component; role differences come from **permissions + `dashboardConfig`**, not forked pages.

## Quick start

```bash
npm install
npm run dev
```

Open the app and use the **Temp role** switcher (O Manager / O Analyst / Q Manager / Q Analyst). Tabs, filters, widgets, and actions update without a full page refresh.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | TypeScript check |
| `npm run build` | typecheck + production bundle |
| `npm test` | Vitest (RBAC + mock API) |

## Environment

Copy `.env.example` to `.env`:

- `VITE_USE_MOCK_API=true` — mock `getDashboardData({ role, tab, filters })` (default)
- `VITE_USE_MOCK_API=false` — real HTTP via `apiClient`
- `VITE_API_BASE_URL` — axios `baseURL`

## Architecture (pipeline)

```
Role → Permissions → dashboardConfig → Zustand (UI) → Dashboard shell
  → getDashboardData({ role, tab, filters }) via TanStack Query
```

### Key paths

| Concern | Path |
| --- | --- |
| Roles | `src/rbac/roles.ts` |
| Permissions | `src/rbac/permissions.ts` |
| Role → permissions | `src/rbac/rolePermissions.ts` |
| `can()` / `<Can />` | `src/rbac/usePermission.ts`, `src/rbac/Can.tsx` |
| Per-role layout | `src/config/dashboardConfig.ts`, `src/config/types.ts` |
| Auth / temp role | `src/store/authStore.ts` |
| Tab / filters UI state | `src/store/dashboardStore.ts` |
| HTTP + mock API | `src/services/apiClient.ts`, `src/services/dashboardApi.ts` |
| Shell | `src/components/dashboard/Dashboard.tsx` |
| Temp RoleSwitcher | `src/components/dashboard/RoleSwitcher.tsx` |

### Separation rules

- **No** `role === "Q_MANAGER"` in presentational widgets — use permissions + config.
- **Zustand** = UI state only (role switcher, tab, filters, selection).
- **TanStack Query** = server/mock data. Do not store API responses in Zustand.
- **Backend** must not trust client-sent `role` (see comments in `apiClient.ts` / `dashboardApi.ts`).

## How to add a new role (3–5 files)

1. `src/rbac/roles.ts` — add the role key (+ label).
2. `src/rbac/rolePermissions.ts` — declare its permission list.
3. `src/config/dashboardConfig.ts` — add tabs / filters / widgets / columns / actions.
4. `src/services/dashboardApi.ts` — mock (or real) data for the new role+tabs *(optional until API exists)*.
5. Backend grants for the same capabilities *(required for production)*.

Shell, stores, and query hooks do **not** fork per role.

## Removing the temp RoleSwitcher

1. Delete `src/components/dashboard/RoleSwitcher.tsx`.
2. Remove its usage from `DashboardHeader.tsx`.
3. Point `authStore` roles at real session/auth instead of the switcher.

## Legacy delivery dashboard

Older delivery-performance components under `src/components/deliveries/` and related `src/api/` remain in the tree but are not mounted by `App.tsx`.
