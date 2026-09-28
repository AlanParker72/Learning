# RBAC Dashboard Skeleton

Thin TypeScript scaffold showing how to maintain **RBAC for multiple roles** and how the pieces wire together. **Not** a full Onboarding/QC dashboard.

## Quick start

```bash
npm install
npm run dev
```

Use the **Temp role** switcher to flip O/Q Manager/Analyst. The shell only lists tab ids from config and shows a `<Can>` example.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | TypeScript check |
| `npm run build` | typecheck + production bundle |
| `npm test` | Vitest (tiny RBAC + `<Can>` tests) |

## Pipeline

```
Role → Permissions → dashboardConfig → Zustand (UI) → Dashboard shell
  → getDashboardData({ role, tab, filters })
```

## How to add a role (3–5 files)

1. `src/rbac/roles.ts` — add the role key (+ label).
2. `src/rbac/rolePermissions.ts` — declare its permission list.
3. `src/config/dashboardConfig.ts` — tabs / filters / widgets / columns / actions (`requiredPermission` optional).
4. `src/services/dashboardApi.ts` — implement fetch for the new role+tabs *(when API exists)*.
5. Backend grants for the same capabilities *(required for production)*.

Shell, stores, and hooks do **not** fork per role.

## What NOT to put in components

- **No** `role === "Q_MANAGER"` (or similar) in presentational UI.
- Use `can(permission)` / `<Can permission="…">` and items from `dashboardConfig`.
- **Zustand** = UI state only (role, tab, filters). **TanStack Query** = server data.
- Backend must not trust client-sent `role`.

## Key paths

| Concern | Path |
| --- | --- |
| Roles | `src/rbac/roles.ts` |
| Permissions | `src/rbac/permissions.ts` |
| Role → permissions | `src/rbac/rolePermissions.ts` |
| `can()` / `<Can />` | `src/rbac/usePermission.ts`, `src/rbac/Can.tsx` |
| Config shape | `src/config/types.ts`, `src/config/dashboardConfig.ts` |
| Auth / temp role | `src/store/authStore.ts` |
| Tab / filters stubs | `src/store/dashboardStore.ts` |
| HTTP + API stub | `src/services/apiClient.ts`, `src/services/dashboardApi.ts` |
| Composition demo | `src/components/dashboard/Dashboard.tsx` |
| Temp RoleSwitcher | `src/components/dashboard/RoleSwitcher.tsx` |

## Removing the temp RoleSwitcher

1. Delete `src/components/dashboard/RoleSwitcher.tsx`.
2. Remove its import/usage from `Dashboard.tsx`.
3. Point `authStore` at real session/auth.

## Environment

Copy `.env.example` → `.env`:

- `VITE_USE_MOCK_API=true` — empty placeholder from `getDashboardData` (default)
- `VITE_API_BASE_URL` — axios `baseURL` when mock is off
