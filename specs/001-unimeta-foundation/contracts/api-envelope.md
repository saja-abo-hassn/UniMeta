# Provisional API Envelope Contract

**Status:** Frontend proposal only. The Laravel API is not ready. This document does not define endpoint paths, authentication, or a final backend schema.

## Success shape

```ts
type ApiMeta = Record<string, unknown> | null;

interface ApiEnvelope<T> {
  data: T;
  meta: ApiMeta;
  errors: null;
}
```

## Failure shape

```ts
interface ApiIssue {
  message: string;
  field?: string;
  code?: string;
}

interface ApiFailure {
  data: unknown | null;
  meta: ApiMeta;
  errors: ApiIssue[];
}
```

The client may throw a normalized `ApiError` that includes HTTP status and an `ApiFailure`. UI code should handle typed outcomes and should not inspect raw `Response` objects.

## Status mapping

| HTTP status/outcome | Frontend category | Expected presentation |
|---|---|---|
| 401 | `unauthorized` | Sign-in-required state; no authentication flow is implemented yet. |
| 403 | `forbidden` | Access-denied state. |
| 404 | `not-found` | Resource unavailable state; do not infer whether the resource is absent or intentionally hidden. |
| 409 | `conflict` | Conflict state; exact recovery action is endpoint-specific and deferred. |
| 422 | `validation` | Show normalized field issues beside relevant controls. |
| Network failure / unavailable connection | `offline` | Connection-lost state with retry affordance when a request exists. |
| Other non-success status | `error` | Generic service error with safe message. |

## Laravel normalization

Laravel commonly returns validation failures with a top-level `message` and an `errors` object keyed by field path. The real transport should normalize each field entry to an `ApiIssue` while preserving the original safe response details as appropriate. The frontend must not require Laravel to emit this proposal verbatim.

## Transport rules

- A single `NEXT_PUBLIC_API_MODE` setting selects `mock` or `real` transport; default is `mock`.
- Mock fixtures and handlers live under `src/mocks/` and are imported only by mock transport.
- Real transport uses the configured API base URL and imports no mock data.
- Never expose credentials, tokens, or private server values via `NEXT_PUBLIC_*` variables.
- The mode setting is build-time in production; changing it requires a new build unless a future runtime configuration design replaces it.
- Exact Laravel endpoints, auth/session behavior, request/response fields, and pagination metadata are deferred until the backend contract exists.

