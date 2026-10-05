# RBAC Quality Control Dashboard

Config-driven dashboard: **Role → Permissions → dashboardConfig → Zustand → reusable Dashboard → TanStack Query → workflow API**.

Managers see **Unassigned / Team Tasks / Completed**. Analysts see **My Tasks / Unassigned**. Q_* vs O_* share those tab ids; domain comes from `requestGroup` (QC vs Onboarding).

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
                      ↘ getDashboardConfig(role) → filterByPermission(tabs|filters|columns|actions)
                      ↘ Zustand (activeTab, filters)
                      ↘ useDashboardData → getDashboardData / fetchWorkflowTasks
```

Presentational components use `can()` / `<Can>` and config `requiredPermission` — not `role === …`.

### Tabs (permission-gated)

Visible tabs:

```ts
config.tabs.filter((t) => can(t.requiredPermission))
```

Each tab id maps to a permission in `TAB_REQUIRED_PERMISSION` (`src/rbac/permissions.ts`).  
`rolePermissions.ts` is the **single place that grants** which tabs a role sees.

**Add a tab for a role (3 steps):**

1. Add `Permission.TAB_*` + map the tab id in `TAB_REQUIRED_PERMISSION`.
2. Grant that permission in the role’s array in `rolePermissions.ts`.
3. Add the tab entry in `dashboardConfig.ts` (reuse catalog helpers; set `requiredPermission` via the map).

Mocks reuse the same tab ids — no per-role dataset copy.

## API (on load)

`POST /workflow-mgmt/v1/api/workflow/tasks/{task_id}/claim?page=0&size=10`  
Body built from role + activeTab + filters. See `src/services/dashboardApi.ts`.

Mock mode (`VITE_USE_MOCK_API=true`, default) returns shared tab seeds shaped like the API.  
No permission for the tab → empty list. `tabCounts` only for permitted tabs.  
**Backend must authorize from session** — client role is not security.

## How to add a role

1. `src/rbac/roles.ts` — role key + label.
2. `src/rbac/rolePermissions.ts` — permission list (tabs/filters/columns/actions).
3. `src/config/dashboardConfig.ts` — only if you need new titles or net-new tab/action entries.
4. Mocks usually work as-is when reusing existing tab ids (`mockWorkflowData.ts`).
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
