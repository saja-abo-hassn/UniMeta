# UniMeta backend contract gaps

This handoff uses `docs/openapi.yaml` as the endpoint and schema source of truth. Runtime statuses below are from the earlier read-only API probe during this task. No POST, PUT, PATCH, or DELETE request was sent to the published server after the explicit no-write instruction. Any status not listed as observed remains unverified.

## Endpoints or contracts Alaa needs to complete

| Endpoint | Page | Expected request / response |
|---|---|---|
| `/admin/content` (frontend page only) | Admin content management | This is a Next.js screen path, not a backend endpoint; calling `/api/v1/admin/content` returns 404 and the path is absent from OpenAPI. Use documented `/admin/library/resources` and `/admin/library/subjects` for its data with `manage_content`. Do not call or add a Laravel `/admin/content` route. |
| `GET /admin/dashboard/overview` — `data.active_now` | Admin dashboard active-account indicator | The current `AdminOverview` schema does not define `active_now`. Add it as a non-negative integer if the backend can provide the count; until then the UI shows “بيانات النشاط غير متاحة” instead of reporting a fabricated zero. |
| `POST /library/contributions` | Student library contribution form | OpenAPI only describes a multipart `file` property and uses a generic response. Define required fields (subject/resource category/title/description), upload limits, moderation status, and response resource shape. |
| `GET /admin/library/contributions`, `PATCH /admin/library/contributions/{id}/review` | Admin library moderation | Both paths exist, but schemas are generic. Define list item fields, pagination, statuses, accepted review actions, request body fields, and response resource shape. |
| Mobile phone OTP issue and verify | Exchange flow (books/devices) | No phone OTP endpoint exists in OpenAPI. The documented auth verification endpoints are email based (`/auth/email/resend-verification`, `/auth/verify-email`). Provide phone OTP send/verify paths, request fields, expiry/rate limits, and response schemas if mobile verification is required. |
| `POST /marketplace/offers` | Student exchange listing | Documented body accepts `title`, `description`, `item_type`, `offer_type`, and `item_condition`; the baseline form also asks for price/deposit/currency/duration and KYC/pledge/signature details. Define which of those fields are supported and add them to the contract if required. |
| `POST /marketplace/offers/{id}/requests` | Student exchange request | OpenAPI only documents an optional `message`; baseline flow gathers phone verification and identity/pledge/signature data. Define the supported request fields and response, or confirm that the flow must stop before submission. |
| Accept/reject marketplace request | Student/admin exchange flow | The documented reject path is `/marketplace-requests/{id}/reject`; an accept path and its request/response schema are not documented. Add the actual supported action contract if acceptance is required. |
| Agreements and reports completion contracts | Student/admin agreements and reports | OpenAPI references a separate `docs/api/completion-contracts.md`, which is absent from this checkout. Define request/response schemas for agreements, signatures, confirmations, events, sensitive-data access, and reports, including the admin action bodies. |
| Settings, tuition, AI, Pomodoro, and other completion endpoints | Admin settings, fee calculator, productivity, chat | Several operations use generic `object`/`array` schemas with unrestricted properties. Add the concrete request and response fields needed by the existing screens before the client relies on them. |

## Swagger differences from observed runtime

| Endpoint / flow | OpenAPI contract | Observed runtime | Difference / follow-up |
|---|---|---|---|
| `/api/v1/admin/content` | No path documented | `404` | Expected: frontend screen `/admin/content` maps to `/admin/library/resources` and `/admin/library/subjects`; no backend route is missing for the basic content list. |
| `/admin/library/subjects`, `/admin/library/resources` | Typed CRUD paths documented | Related read endpoints returned `200` | Read routes are present. Mutations were not called under the no-write rule; verify body/response parity only in an authorized test environment. |
| `/marketplace/offers` and `/marketplace/offers/{id}/requests` | Minimal listing fields; request body only has optional `message` | Earlier authenticated GET probe returned `200` for exchange read data; write parity not tested | Baseline UI fields exceed the documented contract. Do not send the richer payload until Alaa updates/clarifies the schema. |
| Mobile OTP in exchange | No phone OTP route; email verification routes are documented | Earlier integration attempted email verification in the phone-verification step; this mapping was removed | Email verification cannot stand in for mobile OTP. Mobile OTP remains unavailable pending backend contract. |
| `/admin/agreements`, `/reports`, `/admin/reports`, `/admin/settings`, `/library/contributions` | Paths exist, but schemas are generic or delegated to the missing completion-contracts document | `/admin/agreements` and agreement/report read routes returned `200` in the earlier probe | Runtime availability does not resolve the schema gap. Compare concrete payloads and mutation behavior in staging once contracts and credentials are provided. |
| Protected reads | OpenAPI requires bearer authentication for protected operations | Earlier authenticated GET probes returned `200` for dashboard, moderators, invitations, audit logs, agreements, library, and student read routes | Do not use production login for verification under the no-write instruction. Re-test auth and payload parity with a staging account. |

## Safe verification still needed

- A staging API base URL and test accounts for student, moderator, and admin.
- Approval to run write-flow tests in that staging environment; production writes remain untested.
- The missing completion-contracts document or concrete schemas in OpenAPI.
- A mobile number/OTP test setup if phone verification remains part of exchange.
