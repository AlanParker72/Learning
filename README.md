# RBAC Quality Control Dashboard

Config-driven dashboard: **Role → role file (permissions + dashboard config) → can() → Zustand → reusable Dashboard → useDashboard (mock getDashboardData) → workflow API**.

Managers see **Unassigned / Team Tasks (O: Team Work) / Completed**. Analysts see **My Tasks / Unassigned**. Q_* vs O_* share those tab ids; domain comes from `requestGroup` (QC vs Onboarding).

Filters are a **JSON-shaped form field catalog** (`src/form/formConfigs/dashboardFormConfig.ts`). Runtime: `tab.filterPermissions ∩ role.permissions` → form field keys → stub `useFormConfig` + `<Fields />`. Columns are listed on the tab only — no `COLUMN_*` permissions.

Table UI uses the **company DataTable pattern** (`Spinner` / `Alert` / `DataTable` / `NoResultsView`). Local stubs live under `src/components/company/` until the real package import is wired (see handoff).

**No TanStack Query** — loading/data/error live in Zustand; the hook calls `getDashboardData` with async/await.

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
Role → ROLE_PERMISSIONS + getDashboardConfig(role)  (same role file)
                      → can() / <Can> safety net on requiredPermission
                      ↘ Zustand (activeTab, filters, isLoading, dashboardData, error)
                      ↘ useDashboard → useFormConfig(formConfig) + Fields
                      ↘ fetchDashboard → getDashboardData / fetchWorkflowTasks
```

Presentational components use `can()` / `<Can>` and config `requiredPermission` — not `role === …`.

### Extension point: one file per role

Each role file under `src/rbac/rolePermissions/` owns:

1. **Permission list** (`*_PERMISSIONS`) — full set the role may ever use (including all `FILTER_*` / `ACTION_*`)
2. **Dashboard config** (`*_DASHBOARD`) — title, tabs with `filterPermissions` / `actionPermissions` (permission ids only) + columns

Form field catalog: `src/form/formConfigs/dashboardFormConfig.ts`. Filter catalog under `src/rbac/catalog/filters.ts` derives from that form catalog. Tabs never embed full field arrays.

### Tabs (permission-gated)

Visible tabs:

```ts
config.tabs.filter((t) => can(t.requiredPermission))
```

Filters / actions for the active tab:

```ts
resolveFormConfigForTab(rolePermissions, tab.filterPermissions)
resolveActionsForTab(rolePermissions, tab, config.actionPermissions)
```

**Add a tab for a role:**

1. Add `Permission.TAB_*` + map the tab id in `TAB_REQUIRED_PERMISSION`.
2. In that role’s file: grant the permission **and** add the tab (`filterPermissions` / `columns` / optional `actionPermissions`) to `*_DASHBOARD`.

## API (on load)

`POST /workflow-mgmt/v1/api/workflow/tasks/{task_id}/claim?page=0&size=10`  
Body built from role + activeTab + filters. See `src/services/dashboardApi.ts`.

Mock mode (`VITE_USE_MOCK_API=true`, default) loads rows from that role’s file under `src/services/mocks/`.  
No permission for the tab → empty list. `tabCounts` only for permitted tabs.  
**Backend must authorize from session** — client role is not security.

## How to add a role

1. `src/rbac/roles.ts` — role key + label.
2. `src/rbac/rolePermissions/<role>.ts` — **permissions + dashboard config** in the same file.
3. `src/rbac/rolePermissions/index.ts` — register on `ROLE_PERMISSIONS` and `DASHBOARD_CONFIG_BY_ROLE`.
4. Optionally add form field + `Permission.*` if introducing net-new filters/actions/columns.
5. Mocks — add `src/services/mocks/<role>.ts` and register it in `mocks/index.ts`.
6. Backend grants for the same capabilities.

## Role (no UI switcher)

`authStore.activeRole` defaults to **Q_MANAGER**, or `VITE_DEFAULT_ROLE` when set. Point `setActiveRole` at real session/auth when available.

## Environment

Copy `.env.example` → `.env`:

- `VITE_USE_MOCK_API=true` — mock workflow rows (default)
- `VITE_API_BASE_URL` — axios `baseURL` when mock is off
- `VITE_WORKFLOW_TASK_ID` — optional list-on-load path `{task_id}`
- `VITE_DEFAULT_ROLE` — optional authStore default (`Q_MANAGER` | `Q_ANALYST` | `O_MANAGER` | `O_ANALYST`)

## Swap to company DataTable / DSP form

1. DataTable: replace imports in `Dashboard.tsx` from `../company/*` with the real package; delete stubs.
2. Form: replace `src/form/useFormConfig.ts` + `Fields.tsx` with `@dsp` / company form lib; keep `dashboardFormConfig.ts` field shape.
3. Keep Dashboard branch: loading → Spinner, error → Alert, rows → DataTable, empty → NoResultsView.
4. Keep column mapping: role `{ field, header }` → `{ field, headerName, renderCell }`, `rowKey="id"`.
