# UNIMETA — Laravel Auth & Permissions Contract

Source: Laravel backend repository (`AlaaMhammad/UniMate`, branch `baseline/backend-2026-11-11`), read on 2026-11-20.
Method: source reading + an isolated PHPUnit probe on the local **test** database (`unimate_test`, `RefreshDatabase`, synthetic users only, mail faked). No production request was sent and no live data was changed. The probe file was deleted after the run.

Status legend: **VERIFIED** (source + test), **UNVERIFIED**, **NOT IMPLEMENTED**.

---

## 1. Executive diagnosis — VERIFIED

- `role: "ADMIN"` alone **cannot** tell a Super Admin from a moderator. Both are stored as `role = ADMIN`.
- The real discriminator is whether a row exists in `moderator_profiles` for that user:
  - `ADMIN` **without** a `ModeratorProfile` → Super Admin. It has every admin capability, including the `root`-only areas.
  - `ADMIN` **with** a `ModeratorProfile` → moderator. It can do only what its `permissions` map grants, and only while `active = true`.
  - `STUDENT` → never has admin access.
- Laravel already exposes this distinction, but **only** at `GET /users/me/profile`, through `admin_role` and `permissions`.
- `GET /users/me` and the `POST /auth/login` response both use `UserResource`. That resource returns only `id, full_name, email, role`. This is why the frontend could not tell the two kinds of admin apart.
- **Fix on the frontend side:** read `/users/me/profile`, including immediately after a successful login. No backend change is strictly required.

Evidence:
- `app/Services/Completion/ModuleSupport.php:23-30`: `permit()`. A user with a profile must be active and have `permissions[$p] === true`. `root` is never grantable. A user with no profile passes.
- `app/Http/Controllers/Api/V1/Completion/IdentityController.php:56-60`: `admin_role = $staff ? 'moderator' : (role === 'ADMIN' ? 'super_admin' : null)` and `permissions = $staff?->permissions`.
- `app/Http/Resources/Api/V1/UserResource.php:26`: only `id, full_name, email, role`.

## 2. Canonical role/permissions contract — VERIFIED

Canonical endpoint: **`GET /api/v1/users/me/profile`** (auth: Sanctum bearer, through the BFF).

| Field | Type | Semantics |
|---|---|---|
| `role` | `"STUDENT" \| "ADMIN"` | Storage role only. Not enough to authorize anything. |
| `admin_role` | `"super_admin" \| "moderator" \| null` | **Discriminator.** `null` for students. |
| `permissions` | `object<string, boolean> \| null` | Moderator's effective grant map. `null` for Super Admin, because Super Admin is universal rather than holding a list. `null` for students. A missing key means `false`. |

Allowed permission keys, all of them (`ModuleSupport.php:14`):
`manage_content`, `manage_agreements`, `manage_reports`, `manage_members`, `view_sensitive`.
`root` is internal. It cannot be granted (tested: invite with `{"root":true}` → 422).

Is Super Admin universal or a granted set? **Universal by backend logic.** `permit()` skips the permission check when there is no profile.

## 3. Endpoint matrix — VERIFIED (routes: `routes/completion.php:63-100`, `routes/api.php:191-218`)

Every `/admin/*` route runs `auth:sanctum` → `account.active` → `role:ADMIN`. Inside `role:ADMIN`, `EnsureRole.php:31-45` then maps the path to a required permission:

| Path prefix | Required permission | Super Admin | Moderator |
|---|---|---|---|
| `admin/moderators*`, `admin/invitations*`, `admin/settings*`, `admin/tuition*`, `admin/academic*`, `admin/interest*` | `root` | ✅ | ❌ always 403 |
| `admin/library*` (resources, subjects, contributions) | `manage_content` | ✅ | if granted |
| `admin/agreements*` | `manage_agreements` | ✅ | if granted |
| `admin/agreements/{id}/sensitive` | `manage_agreements` **and** `view_sensitive` (`AgreementController.php:83`) | ✅ | if both are granted |
| `admin/reports*` | `manage_reports` | ✅ | if granted |
| `admin/users*`, `admin/audit-logs*` | `manage_members` | ✅ | if granted |
| anything else, e.g. `admin/dashboard/overview`, `admin/majors` | active staff only | ✅ | ✅ when active |

Moderator and invitation endpoints. All of them are Super Admin only: `root` via the middleware, re-checked in the controller.

| Method + path | Request | Success response (`data`) | Notable errors |
|---|---|---|---|
| `GET /admin/moderators` | – | array of `{id:string, name, email, role:"moderator", title, assignedDepartment, permissions:{…}, active:bool, status:"نشط"\|"معطل", createdAt}` (not paginated) | 403 for moderators and students |
| `POST /admin/moderators/invite` | `{name, email, title?, assignedDepartment?, permissions:{key:bool}}` | 201 `{invitation:{…}, inviteUrl}` | 422 validation or an active invitation already exists. 503 if `FRONTEND_URL` is missing or mail fails. |
| `PATCH /admin/moderators/{id}/permissions` | `{permissions:{key:bool}}` | moderator representation | 404 if `{id}` is not a moderator. 422. 403. |
| `PATCH /admin/moderators/{id}/status` | `{active: boolean}` | moderator representation | 422 for `"status":"معطل"` or `"INACTIVE"` (tested) |
| `DELETE /admin/moderators/{id}` | – | moderator representation | **Soft:** sets `active=false`, suspends the account and revokes its tokens. Nothing is deleted. |
| `GET /admin/invitations` | `?page&per_page≤100` | paginated invitations + `meta` | 403 |
| `POST /admin/invitations/{id}/resend` | – | `{inviteUrl}` | 422 if not pending. 429 if resent within 1 minute. |
| `DELETE /admin/invitations/{id}` | – | `{cancelled:true}` | 422 if not pending |
| `GET /invitations/{token}` (public) | – | `{name,email,title,assignedDepartment,expiresAt}` | 404 if invalid or expired |
| `POST /invitations/{token}/accept` (public) | `{password (min 8)}` | 201 `{email}` | 422 if the email is already registered. 404. |

## 4. Exact payloads — VERIFIED against `ModeratorController.php:36,97,106`

Rule: `permissions` is **required**, must be an **object keyed by permission name**, and every value must be a boolean. Zero, one or many keys are fine as long as the object is not empty.

```json
// invite — one permission
{ "name": "Synthetic Moderator", "email": "mod@example.test", "title": "مشرف محتوى",
  "assignedDepartment": "IT", "permissions": { "manage_content": true } }

// invite — multiple
{ "name": "Synthetic Moderator", "email": "mod2@example.test",
  "permissions": { "manage_content": true, "manage_reports": true, "view_sensitive": false } }

// invite — zero permissions (send at least one key set to false; {} is rejected)
{ "name": "Synthetic Moderator", "email": "mod3@example.test", "permissions": { "manage_content": false } }

// update permissions — this REPLACES the whole map; keys you omit become false
{ "permissions": { "manage_members": true, "manage_content": false } }

// status
{ "active": false }
```

Rejected with 422 (tested): `["manage_content"]` (a list), `{}` (empty), `{"root":true}`, `{"manage_content":"yes"}`, `permissions_list` without `permissions`, and `{"status":"معطل"}`.
The backend does **not** support `permissions_list` or parallel arrays at all.

## 5. Synthetic user responses — VERIFIED

`GET /users/me/profile`, Super Admin:
```json
{ "data": { "id": 1, "full_name": "Synthetic Root", "email": "root@example.test", "role": "ADMIN",
  "student_id": null, "faculty": null, "avatar_url": null, "email_verified": true, "phone": null,
  "national_id_last_four": null, "preferences": [], "admin_role": "super_admin", "permissions": null } }
```
`GET /users/me/profile`, restricted moderator:
```json
{ "data": { "id": 7, "full_name": "Synthetic Mod", "email": "mod@example.test", "role": "ADMIN",
  "…": "…", "admin_role": "moderator", "permissions": { "manage_content": true } } }
```
`GET /users/me` and `POST /auth/login` → `data.user`, for both kinds of admin: `{ "id", "full_name", "email", "role": "ADMIN" }`. There is **no** discriminator here.

## 6. Permission → screen mapping — VERIFIED for the backend side

| Permission | Backend routes it unlocks | Frontend screen |
|---|---|---|
| `manage_content` | `admin/library/*` (subjects, resources, file replace, statistics, contributions review/download) | `/admin/content`, `/admin/library` |
| `manage_agreements` | `admin/agreements*` | `/admin/agreements` |
| `view_sensitive` | `POST admin/agreements/{id}/sensitive` (also needs `manage_agreements`) | the sensitive-data panel inside agreements |
| `manage_reports` | `admin/reports*` | `/admin/moderation` |
| `manage_members` | `admin/users*`, `admin/audit-logs` | `/admin/members` |
| *(Super Admin only)* | moderators, invitations, settings, tuition-rates, academic-plans, interest-categories | `/admin/permissions`, `/admin/settings`, tuition and academic config |
| *(any active staff)* | `admin/dashboard/overview`, `admin/majors` | `/admin` home |

## 7. 403 root-cause matrix

| Cause | Status | Evidence |
|---|---|---|
| A moderator calls a `root` area (moderators, invitations, settings, tuition, academic, interest). This happens for **every** moderator, whatever they were granted. | **VERIFIED** | `EnsureRole.php:33`. Probe: a moderator got 403 on all six. |
| A moderator lacks the specific grant | **VERIFIED** | `ModuleSupport.php:28`. Probe: `manage_content` only → `admin/users` 403. |
| An **ADMIN** (any kind) calls a STUDENT route such as `/majors`, `/academic-plans`, `/tuition-rates` or `/library/*` | **VERIFIED** | `routes/api.php:74`, `completion.php:37`. Probe: the root user got 403 on `/majors` and `/academic-plans`. Admins must use `/admin/majors` and `/admin/academic-plans`. |
| The moderator is deactivated or deleted | **VERIFIED** | `EnsureAccountActive.php:27-30`. Tokens are also revoked, so the next request is 401 or 403. |
| A student calls `/admin/*` | **VERIFIED** | `EnsureRole.php:29` |
| Frontend `PermissionGuard` produced the 403 | **NOT the source** | Laravel's 403 body is `{"code":"FORBIDDEN","message":"This action is not allowed."}` (`ApiExceptionRenderer.php:28`). That message can only come from Laravel. |
| Wrong path | Not found in the current frontend `master` | All 165 calls match real routes. Unknown paths return 404 or 405, never 403. |
| Proxy or session issue | **UNVERIFIED** | A missing or expired cookie gives **401**, not 403. To check a specific 403, send the method + path + the role of the account used (no token). |

## 8. Recommended frontend implementation

1. **Source of truth:** call `GET /users/me/profile` on app boot **and immediately after a successful login**, before routing. Do not trust `data.user` from the login response for authorization.
2. Set `isSuperAdmin = admin_role === "super_admin"` and `isModerator = admin_role === "moderator"`. Show the `/admin` shell only if `admin_role !== null`.
3. `can(p) = isSuperAdmin || (isModerator && permissions?.[p] === true)`. Never treat `role === "ADMIN"` as "all permissions".
4. Super-Admin-only screens (moderators/permissions, settings, tuition, academic config): show them only when `isSuperAdmin`.
5. Serialize permissions as a keyed boolean object. Always send the full map of the 5 keys so that zero permissions is valid.
6. Admin screens must use `/admin/majors` and `/admin/academic-plans`, never the student routes.
7. Treat a 403 from the API as authoritative. Show a "no permission" state and then re-fetch `/users/me/profile`, because a grant may have just changed.
8. Show a loading state until the profile resolves. Never render admin content optimistically.

Current frontend `master` (81dad67) does not do this yet:
- `components/admin/permission-guard.tsx` always renders its children ("Always allow access…").
- `src/contexts/admin/use-admin-auth-state.ts:143` treats `role === "admin"` as full access.
- The login flow uses the login response (`role: ADMIN`) until the page reloads.

## 9. Minimal backend changes — optional, not implemented, need approval

None is required for correctness. These are optional and backward-compatible:
- **B1.** Add `admin_role` and `permissions` to `UserResource`, so that `/users/me` and the login response carry the discriminator too. This only adds fields and removes the extra round-trip after login. Note: the OpenAPI contract test will need its schema updated.
- **B2.** Product decision: should moderators get read access to `admin/academic-plans` and `admin/interest-categories`? Today these are `root` only.
- **B3.** Make an empty `permissions: {}` mean "no permissions". Today it is a 422, and the workaround is to send all-false keys.

## 10. Evidence and tests

- Existing test: `tests/Feature/Completion/CompletionModulesTest.php:226` (`test_moderator_invitation_permissions_are_enforced_server_side`) and `:306` (root cannot be granted). Both pass.
- Temporary probe, deleted afterwards: `php artisan test --filter=ZzPermissionContractProbeTest` → 1 test passed. Its observed results are quoted throughout sections 2–7.
- Full backend suite run today: 1226 / 1228 passed. The 2 failures are unrelated to permissions; they come from the new email-verification-on-register change.
- When permission changes take effect: **on the very next request**. `permit()` and `EnsureAccountActive` read `moderator_profiles` from the DB on every request, and tokens carry `['*']` abilities (`AccessTokenIssuer`). No re-login or token refresh is needed. Probe: after a grant change, the old area returned 403 and the new area returned 200 with the same token. Deactivation also deletes the moderator's tokens.
- **UNVERIFIED:** behaviour on the production server (not touched), and the exact request behind each 403 the frontend team observed.

```
FRONTEND HANDOFF
Canonical current-user endpoint: GET /api/v1/users/me/profile (call on boot AND right after login)
Super Admin discriminator (verified): admin_role === "super_admin" (ADMIN without a moderator profile); "moderator" for staff; null for students
Moderator effective permissions field and type: permissions: { manage_content|manage_agreements|manage_reports|manage_members|view_sensitive: boolean } | null; missing key = false
Invitation payload schema: POST /admin/moderators/invite {name, email, title?, assignedDepartment?, permissions:{key:boolean, ≥1 key}}
Permission update payload schema: PATCH /admin/moderators/{id}/permissions {permissions:{key:boolean}} — replaces the whole map
Moderator status payload schema: PATCH /admin/moderators/{id}/status {active: boolean}
Who can manage moderators: Super Admin only (server-enforced "root"; moderators always get 403)
When updated permissions take effect: next request, same token (no re-login)
Confirmed frontend mismatches: login response used for role (no admin_role); role "admin" treated as all-permissions; PermissionGuard is a no-op on master; admin screens must not call student routes (/majors, /academic-plans → 403 for ADMIN); permissions_list / parallel arrays are not supported
Backend gaps and required decision: none blocking; optional B1 (add admin_role+permissions to /users/me and login), B2 (moderator read access to academic config?), B3 (accept empty permissions {})
```
