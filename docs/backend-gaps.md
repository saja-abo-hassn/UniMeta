# UniMeta backend contract gaps

This handoff uses `docs/openapi.yaml` as the endpoint and schema source of truth. Runtime statuses below are from the earlier read-only API probe during this task. No POST, PUT, PATCH, or DELETE request was sent to the published server after the explicit no-write instruction. Any status not listed as observed remains unverified.

## Requested API review

The chatbot 500 was reported by the user but was not reproduced in this review: the configured `BACKEND_API_URL` points to the published API, and sending a chatbot message is a POST. No production write-like request was sent. There are no Laravel application logs or captured response body available in this checkout, so the backend root cause is still unconfirmed.

| الوظيفة | Endpoint الحالي | المشكلة الفعلية | المطلوب من علاء | الأولوية |
|---|---|---|---|---|
| Chatbot للزائر | `POST /ai/assistant` via `POST /api/backend/ai/assistant` | User-reported HTTP 500, not reproduced here. BFF forwards upstream HTTP status/body; its own network exception is 502 and missing API URL is 503. OpenAPI permits arbitrary request properties and a generic `data` object; frontend currently sends `{message, history:[{role, content}]}` and expects `data.answer` plus optional `data.sources`. | Correlate a failed request timestamp/request id with Laravel `storage/logs/laravel.log` and the AI provider/client logs. Confirm accepted `message`/`history` fields and concrete success/error response schema in OpenAPI. Redact credentials, prompts, and provider secrets from any shared logs. | High |
| Chatbot للمستخدم المسجّل | `POST /ai/sessions`, then `POST /ai/sessions/{id}/messages` | OpenAPI request and response schemas are generic; UI expects session `{id,title}` and message rows `{id,role,content,created_at,sources}`. The failed request's actual endpoint depends on auth state; no runtime request capture is available. | Confirm the session/message request and response schemas, and provide a redacted Laravel trace for the failing POST if this flow produces the 500. | High |
| إنشاء مادة/مساق يدوياً | `POST /admin/library/subjects` | API contract supports `subject_name`, unique `subject_code`, `major_id`, optional `description`; current `/admin/library` form is disabled, and legacy `/admin/content` still reads/writes local admin context rather than this API. This is a frontend integration gap, not a missing endpoint. | No new endpoint required. The frontend must connect the existing form to this documented endpoint and use actual major IDs. | High |
| ربط اسم المادة برمزها | `GET/POST /admin/library/subjects`; resources use `subject_id` | Subject name and code are first-class fields on one subject record. Resource rows reference that record by `subject_id`; fabricated course codes in the legacy local-only form are not backend records. | No new endpoint required. Use returned subject `id`, `subject_name`, and `subject_code`; do not synthesize codes. | High |
| نشر محتوى المكتبة للطالب | `POST /admin/library/resources`, `PATCH /admin/library/resources/{id}`, `GET /library/subjects`, `GET /library/subjects/{id}/resources` | The API contract supports resource upload with `subject_id`, `title`, `resource_type`, `visibility_status`, and `file`; student reads expose VISIBLE resources only. Admin page currently loads the API list but upload/edit controls are disabled. End-to-end publication is therefore not available through the current admin UI. | No new endpoint required for the documented flow. Connect the existing UI to these routes and verify with an authorized staging admin/student pair. | High |

### Chatbot request path and evidence

- The global UI is `components/chat/unimeta-chat.tsx`; `useUniMetaChat` blocks a second send while a request is in flight.
- Guests call `liveChatService.publicSend`, which uses `apiClient.post` with `message` and up to eight prior messages, each `{role, content}`.
- Authenticated users create a session if needed and post `{message}` to `/ai/sessions/{id}/messages`; they do not use `/ai/assistant` in that branch.
- Browser requests target the same-origin `/api/backend/...` BFF. The BFF uses server-only `BACKEND_API_URL`, attaches the HTTP-only session token when present, and forwards POST response statuses from Laravel. It returns 502 for its fetch exception and 503 when no backend URL is configured.
- Given an observed 500 on these routes, Laravel/upstream is the likely source because the BFF forwards upstream 500s; without the Network response body, request path, and correlated Laravel/provider logs, this is not proof of the failing backend component.
- The API documentation does not currently declare a 500 response for these chatbot operations or the provider failure envelope. The linked `docs/api/completion-contracts.md` referenced by OpenAPI is absent from this checkout.

## Endpoints or contracts Alaa needs to complete

| Endpoint | Page | Expected request / response |
|---|---|---|
| `/admin/content` (frontend page only) | Admin content management | This is a Next.js screen path, not a backend endpoint; calling `/api/v1/admin/content` returns 404 and the path is absent from OpenAPI. Use documented `/admin/library/resources` and `/admin/library/subjects` for its data with `manage_content`. Do not call or add a Laravel `/admin/content` route. |
| `GET /admin/dashboard/overview` — `data.active_now` | Admin dashboard active-account indicator | The current `AdminOverview` schema does not define `active_now`. Add it as a non-negative integer if the backend can provide the count; until then the UI shows “بيانات النشاط غير متاحة” instead of reporting a fabricated zero. |
| `GET /admin/users` — member profile fields | Admin members | OpenAPI returns only `id`, `full_name`, `role`, `account_status`, and `created_at`; the baseline screen also displays/searches student number, email, major, college, and loan count. Confirm which fields may be exposed to admins and document them before mapping those fields. |
| `GET /admin/library/resources/{id}/statistics` — download count | Admin content management | The path exists but its response is generic in OpenAPI. Document the exact statistics response (including the count and its meaning) before showing it in the baseline content table. |
| `GET /marketplace/offers` — owner contact phone | Book/device exchange cards and details | `MarketplaceOffer` intentionally omits contact data. If student phone display is approved, document a privacy-scoped owner phone field in the list/detail response; until then cards cannot show API-backed phone numbers. |
| `POST /marketplace/offers` — contact phone and supported listing fields | Book/device publish forms | `CreateMarketplaceOfferRequest` does not define a phone field and says unknown fields are ignored; the UI also collects listing details outside the current request schema. Define the accepted contact field and supported book/device properties before enabling publish. |
| `DELETE /marketplace/offers/{id}` | Owner's book/device listing | No DELETE operation is documented; `/marketplace/offers/{id}` only supports GET and PATCH. Define owner-only DELETE request and response semantics if listing removal is required. |
| `DELETE /graduation-projects/{id}` | Owner's graduation-project announcement | The documented path supports GET and PATCH only. Define an owner-only DELETE response and whether existing applications are retained or withdrawn. |
| `DELETE /project-applications/{id}` | Applicant's team request | No DELETE operation is documented; the existing `/project-applications/{id}/withdraw` is POST and only withdraws a pending application. Confirm whether that action is the intended control or document a DELETE contract. |
| `POST /library/contributions` | Student library contribution form | OpenAPI only describes a multipart `file` property and uses a generic response. Define required fields (subject/resource category/title/description), upload limits, moderation status, and response resource shape. |
| `GET /admin/library/contributions`, `PATCH /admin/library/contributions/{id}/review` | Admin library moderation | Both paths exist, but schemas are generic. Define list item fields, pagination, statuses, accepted review actions, request body fields, and response resource shape. |
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
