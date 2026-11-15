# Data Model: UniMeta Foundation

This model describes frontend presentation and transport types only. It is not a Laravel database schema and does not imply persistence or real user records.

## Core types

### Platform destination

Represents one navigation destination used to render the route skeleton.

| Field | Type | Meaning |
|---|---|---|
| `id` | `string` | Stable navigation identifier. |
| `title` | `string` | Arabic route label. |
| `area` | `"public" \| "student" \| "admin"` | Shell that owns the destination. |
| `path` | `string` | URL path from the feature route list. |
| `description` | `string` | Short placeholder explanation. |

### Sample record

Represents a synthetic display-only item. Sample records must be stored under `src/mocks/`, marked as sample, and must not contain copied or real personal data.

| Field | Type | Meaning |
|---|---|---|
| `id` | `string` | Synthetic stable identifier. |
| `kind` | `string` | Sample resource category. |
| `label` | `string` | Safe display label. |
| `fields` | `Record<string, string>` | Synthetic display values only. |
| `source` | `"sample"` | Explicit marker that the record is mock data. |

### API metadata

`ApiMeta` is nullable and may carry optional pagination or request tracing metadata only after the backend contract defines those fields. Do not invent a database identity or pagination contract at this stage.

### API issue and envelope

`ApiIssue` contains a human-readable message and optional field path and stable error code. `ApiEnvelope<T>` carries a typed `data`, nullable `meta`, and nullable or structured `errors`. A normalized `ApiError` also carries HTTP status and a category for transport handling.

### Service state

Shared components support `loading`, `empty`, `error`, `unauthorized`, `forbidden`, `offline`, `conflict`, and `validation` states. The specification's 401 and 403 states remain distinct even though both concern access.

## Relationships and boundaries

- A route destination belongs to exactly one of the public, student, or admin shells.
- A sample record is owned by the mock layer only; a real API response is owned by the real transport and is never backed by a mock fixture.
- A UI state is derived from transport outcome or local loading/empty conditions; it is not persisted as a domain record.
- `visitor`, `student`, and `admin` are navigation-area labels only in this phase. They do not represent authenticated principals or authorization claims.

## Privacy and lifecycle

No real student, administrator, agreement, library, or exchange records are modeled here. When real data is introduced, define authentication, authorization, role scope, data minimization, logging, and retention in a separate backend integration specification before enabling those records in the UI.

