# RBAC Quality Control Dashboard

Config-driven dashboard: **Role → Permissions → dashboardConfig → Zustand → reusable Dashboard → TanStack Query → workflow API**.

Primary UI mapping: **Q_MANAGER** Quality Control Requests (tabs, filters, table). Q_ANALYST uses My Tasks / Unassigned. O_* roles keep thin stubs.

## Quick start

```bash
npm install
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | TypeScript check |
| `npm run build` | typecheck + production bundle |

## Pipeline

```
Role → ROLE_PERMISSIONS → can() / <Can>
                      ↘ getDashboardConfig(role) → filterByPermission(…)
                      ↘ Zustand (activeTab, filters)
                      ↘ useDashboardData → getDashboardData / fetchWorkflowTasks
```

Presentational components use `can()` / `<Can>` and config `requiredPermission` — not `role === …`.

## API (on load)

`POST /workflow-mgmt/v1/api/workflow/tasks/{task_id}/claim?page=0&size=10`  
Body built from role + activeTab + filters. See `src/services/dashboardApi.ts`.

Mock mode (`VITE_USE_MOCK_API=true`, default) returns realistic workflow rows.  
**Backend must authorize from session** — client role is not security.

## How to add a role

1. `src/rbac/roles.ts` — role key + label.
2. `src/rbac/rolePermissions.ts` — permission list.
3. `src/config/dashboardConfig.ts` — tabs / filters / columns / actions with `requiredPermission`.
4. Mock / API mapping in `src/services/` as needed.
5. Backend grants for the same capabilities.

## Removing the temp RoleSwitcher

1. Delete `src/components/dashboard/RoleSwitcher.tsx`.
2. Remove its usage from `DashboardHeader.tsx`.
3. Point `authStore` at real session/auth.

## Environment

Copy `.env.example` → `.env`:

- `VITE_USE_MOCK_API=true` — mock workflow rows (default)
- `VITE_API_BASE_URL` — axios `baseURL` when mock is off
- `VITE_WORKFLOW_TASK_ID` — optional list-on-load path `{task_id}`
