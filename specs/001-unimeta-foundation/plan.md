# Implementation Plan: UniMeta Foundation

**Branch**: `001-unimeta-foundation`  
**Date**: 2026-11-02  
**Specification**: [spec.md](spec.md)

## Summary

Build the UniMeta frontend foundation as a Next.js App Router application using TypeScript, with a global Arabic RTL document, a responsive public shell, and distinct student and admin dashboard shells. Establish the brand tokens, shared UI components and service states, then add placeholder pages for every route in the specification. Define a typed API boundary that selects either isolated sample fixtures or a future Laravel transport through one environment setting. The first phase has no real authentication, business workflows, backend endpoints, or private records.

## Technical Context

- **Existing stack:** Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, npm.
- **Language and document direction:** Arabic (`lang="ar"`) and RTL (`dir="rtl"`) at the root document; CSS logical properties for layout.
- **Typography:** Self-host Noto Sans Arabic in a variable WOFF2 asset when available, with Arabic-capable system fallbacks.
- **Visual system:** Primary `#295255`, secondary `#577877`, light `#F0F5F7`, dark `#162623`; calm translucent cards; sidebar uses the darker surface; responsive layouts down to 360px.
- **Routing:** App Router; public route group for `/`, `/login`, and `/register`; nested student and admin route layouts.
- **Data mode:** `NEXT_PUBLIC_API_MODE=mock|real`, default `mock`; build-time setting. The Laravel base URL is a separate environment setting. No credentials or secrets in client-exposed variables.
- **API boundary:** Generic typed `data` / `meta` / `errors` envelope and normalized transport errors. Mock fixtures live separately from the real fetch transport. No endpoint names or backend behavior are invented.
- **Authentication and privacy:** No authentication in this prototype. Student/admin routes are open only while they display sample data. Authentication, authorization, and privacy rules are prerequisites before real private records are connected.
- **Testing:** This planning phase adds no tests and does not run tests. Implementation verification commands and manual checks are documented in [quickstart.md](quickstart.md).
- **Constraints:** Calendar, notification center, community, Course Hub, standalone chatbot page, 4.0 GPA, payments, and all other excluded features remain out of scope.

## Constitution Check

The repository constitution at `.specify/memory/constitution.md` contains only unratified template placeholders. There are no approved project principles to evaluate or claim as binding. This plan therefore treats the user-approved feature specification as the source of scope and constraints and does not invent constitution rules.

### Gates

- **Scope gate:** Pass. Work is limited to the foundation, route shells, shared components, placeholder content, and API abstraction described by the spec.
- **Data separation gate:** Pass. Sample data is isolated under `src/mocks/`; real transport does not import fixture data.
- **Privacy gate:** Pass for prototype scope. No real records or authentication are included. Real private data cannot be enabled until access and privacy rules are implemented.
- **Contract gate:** Conditional. The frontend envelope is provisional and normalized at the transport boundary until Laravel publishes its contract.
- **Responsive and RTL gate:** Pass by design requirement; validate every route at narrow mobile and desktop sizes during implementation.

## Project Structure

```text
app/
  layout.tsx                         # Arabic RTL root document and global providers/styles
  globals.css                        # tokens, typography, logical layout primitives
  not-found.tsx                      # unknown route state
  error.tsx                          # unexpected rendering failure boundary
  (public)/
    layout.tsx                       # public navigation shell
    page.tsx                         # /
    login/page.tsx                   # /login
    register/page.tsx                # /register
  student/
    layout.tsx                       # student sidebar and responsive shell
    loading.tsx
    page.tsx                          # /student
    academic/page.tsx
    library/page.tsx
    productivity/page.tsx
    interests/page.tsx
    teams/page.tsx
    exchange/books/page.tsx
    exchange/devices/page.tsx
    agreements/page.tsx
    settings/page.tsx
  admin/
    layout.tsx                       # admin sidebar and responsive shell
    loading.tsx
    page.tsx                          # /admin
    students/page.tsx
    library/page.tsx
    agreements/page.tsx
    reports/page.tsx
components/
  layout/                            # Navbar, Sidebar, area shells
  shared/                            # Button, Card, Table, FormField, Modal, StatePanel
  placeholders/                      # reusable placeholder page content
src/
  lib/api/                           # config, client, errors, real transport
  mocks/                             # sample fixtures and mock transport only
  types/                             # shared API and UI types
public/fonts/                        # self-hosted Arabic font asset
specs/001-unimeta-foundation/
  contracts/                         # proposed API and route/state contracts
```

Public route groups do not affect the URL. Student and admin pages share their respective area shell through nested layouts. Keep UI components independent from transport implementation; pages consume typed client functions and render shared state components.

## Architecture and Data Flow

1. A page calls the typed API client from a server or client component as appropriate.
2. The API client reads the single mode setting and dispatches to either mock transport or real transport.
3. Mock transport imports only fixtures from `src/mocks/`. Real transport uses `fetch`, the configured API base URL, and response normalization; it never imports sample fixtures.
4. Both transports return the same typed envelope or throw a normalized `ApiError` carrying HTTP status and structured issue details.
5. UI maps 401 to sign-in-required, 403 to forbidden, 404 to missing/unavailable, 409 to conflict, 422 to field validation, and connection failures to offline. No automatic login redirect is implemented in this phase.

The API envelope and state mapping are specified provisionally in [contracts/api-envelope.md](contracts/api-envelope.md). Route shells and prototype access are listed in [contracts/ui-routes-and-states.md](contracts/ui-routes-and-states.md).

## Implementation Phases

### Phase 1: Application shell and design foundation

- Confirm strict TypeScript and existing Next.js configuration remain compatible.
- Add global Arabic RTL document settings and Arabic typography/fallbacks.
- Define brand tokens and responsive logical layout primitives.
- Build public, student, and admin shells with mobile navigation behavior; keep the sidebar darker than the main surface.

### Phase 2: Shared components and UI states

- Build Navbar, Sidebar, Button, Card, Table, form controls, and Modal.
- Add reusable loading, empty, error, unauthorized, forbidden, and offline presentations.
- Add the not-found and unexpected-error boundaries.
- Ensure keyboard access, visible focus, semantic labels, and narrow-screen behavior.

### Phase 3: Route skeleton

- Add all 18 specified paths with the correct area shell and Arabic placeholder content.
- Keep placeholder pages descriptive and clearly identify sample-only content.
- Ensure direct navigation to each route works without authentication in the prototype.

### Phase 4: Typed API foundation

- Add TypeScript request/response, metadata, error, and issue types.
- Implement normalized API errors and status mapping for 401/403/404/409/422 and offline/network failure.
- Create the `mock|real` selection in one setting with mock as the default.
- Put all mock records and handlers in `src/mocks/` and create a separate real fetch transport.
- Leave endpoint-specific functions minimal/provisional until Laravel publishes its API contract.

### Phase 5: Verification and handoff

- Run the documented lint, type, and production build checks during implementation.
- Verify all routes, the three shells, RTL direction, mobile layout, shared states, and mode switching using the quickstart checklist.
- Record real-backend integration blockers: endpoint contract, authentication/authorization, role policy, and privacy requirements.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Laravel contract differs from the provisional frontend envelope | Integration churn | Normalize responses in one adapter and confirm contract before wiring endpoint-specific features. |
| `NEXT_PUBLIC_API_MODE` is assumed to be runtime-switchable | A deployed build continues using its build-time mode | Document restart/rebuild requirement; use runtime server config later if deployment needs artifact-level switching. |
| Prototype routes are mistaken for protected production dashboards | Private information exposure if real records are introduced prematurely | Use only synthetic fixtures; treat auth, authorization, and privacy implementation as a hard prerequisite for real records. |
| Arabic layout breaks at narrow widths or in mixed-direction values | Navigation/forms may become difficult to use | Use logical CSS properties, RTL-aware components, and route-by-route mobile verification. |
| Arabic font binary is unavailable in the repository | Font appearance varies by system | Add the selected self-hosted WOFF2 asset before visual sign-off and keep Arabic system fallbacks. |

## Design Artifacts

- [Research decisions](research.md)
- [Data model](data-model.md)
- [API envelope contract](contracts/api-envelope.md)
- [Route and state contract](contracts/ui-routes-and-states.md)
- [Quickstart and verification](quickstart.md)

## Complexity Tracking

No constitution violations or exceptional complexity require justification. The project has one frontend application and one normalized API boundary; no backend, authentication service, persistence store, or deployment architecture is introduced in this phase.

