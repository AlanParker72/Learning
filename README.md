# RBAC Skeleton

Pure TypeScript RBAC scaffold: roles → permissions → `can()` / `<Can>` → config filtering.
Minimal demo wiring only — **not** a full dashboard product.

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
                      ↘ getDashboardConfig(role) → filterByPermission(tabs, can)
                      ↘ getDashboardData({ role, tab, filters })  // stub
```

## How to add a role

1. `src/rbac/roles.ts` — add the role key + label.
2. `src/rbac/rolePermissions.ts` — declare its permission list.
3. `src/config/dashboardConfig.ts` — tabs with optional `requiredPermission`.
4. `src/services/dashboardApi.ts` — implement fetch when the API exists.
5. Backend grants for the same capabilities (required for production).

Do **not** add `role === "…"` branches in presentational UI — use `can()` / `<Can>`.

## Key paths

| Concern | Path |
| --- | --- |
| Roles | `src/rbac/roles.ts` |
| Permissions | `src/rbac/permissions.ts` |
| Role → permissions | `src/rbac/rolePermissions.ts` |
| `can()` / `<Can />` | `src/rbac/usePermission.ts`, `src/rbac/Can.tsx` |
| Barrel | `src/rbac/index.ts` |
| Config filter pattern | `src/config/dashboardConfig.ts` |
| Auth (temp role) | `src/store/authStore.ts` |
| API stub | `src/services/dashboardApi.ts` |
| Demo shell | `src/components/dashboard/Dashboard.tsx` |
| Temp RoleSwitcher | `src/components/dashboard/RoleSwitcher.tsx` |

## Removing the temp RoleSwitcher

1. Delete `src/components/dashboard/RoleSwitcher.tsx`.
2. Remove its import/usage from `Dashboard.tsx`.
3. Point `authStore` at real session/auth.

## Environment

Copy `.env.example` → `.env`:

- `VITE_USE_MOCK_API=true` — empty placeholder from `getDashboardData` (default)
- `VITE_API_BASE_URL` — axios `baseURL` when mock is off
