# Research: UniMeta Foundation

## Decisions and rationale

### Next.js routing and area shells

- **Decision:** Use the App Router with one root layout and nested public, student, and admin layouts. Place public pages under `app/(public)/` so the route group does not add a URL segment; place student and admin routes under `app/student/` and `app/admin/`.
- **Rationale:** The three areas need different navigation shells while sharing root-level document settings and components. App Router layouts provide persistent shared UI for nested routes. Route groups can organize source files without affecting public URLs.
- **Alternatives considered:** Duplicate the full navigation on every page (rejected because it creates drift); make one conditional layout for every area (rejected because area-specific navigation and responsive behavior become harder to maintain).
- **References:** [Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [Next.js route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups), [Next.js layout convention](https://nextjs.org/docs/app/api-reference/file-conventions/layout).

### Arabic RTL and typography

- **Decision:** Set `lang="ar"` and `dir="rtl"` on the root HTML element. Use CSS logical properties for directional spacing and alignment. Self-host an Arabic-friendly font (Noto Sans Arabic) when its font asset is added, with system Arabic sans-serif fallbacks.
- **Rationale:** Direction belongs at the document root so all routes and native form controls inherit the correct direction. Logical properties preserve layout behavior without left/right-specific overrides. Self-hosting avoids a runtime dependency on an external font service.
- **Alternatives considered:** Set RTL per page (rejected because it permits inconsistent route behavior); use a Latin-oriented font with no Arabic tuning (rejected for readability); load a remote font at runtime (rejected for reliability and privacy).
- **References:** [HTML `dir` attribute](https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute), [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts).

### API mode selection and transport boundary

- **Decision:** Provide one `NEXT_PUBLIC_API_MODE=mock|real` setting, defaulting to `mock`, which selects one typed API transport. Keep mock fixtures and handlers in `src/mocks/`; keep the real fetch transport separate. Configure the Laravel base URL separately and never place secrets in `NEXT_PUBLIC_*` variables.
- **Rationale:** This satisfies one-setting selection while keeping sample data out of real transport code. The frontend can begin with a provisional contract and normalize the Laravel response shape once it is available.
- **Alternatives considered:** Scatter mode checks throughout pages (rejected because mock and real paths become mixed); maintain two unrelated client APIs (rejected because components would need mode-specific code); put credentials or server secrets in public environment values (rejected because public variables are exposed to browser code).
- **Operational constraint:** Next.js inlines `NEXT_PUBLIC_*` values at build time. Changing the mode requires restarting the dev server or rebuilding/redeploying the app. If the deployed artifact later needs runtime switching, replace this with a server-provided runtime setting without changing the API interface.
- **References:** [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables).

### Typed API envelope and error normalization

- **Decision:** Define frontend-owned generic success and failure envelopes with `data`, `meta`, and `errors`; normalize HTTP and network outcomes in the API client. Map 401, 403, 404, 409, and 422 distinctly. Adapt Laravel validation responses into the frontend's typed issue shape.
- **Rationale:** The backend is not ready, and Laravel's standard validation response uses a `message` plus an `errors` field map. A boundary adapter keeps UI components stable without claiming Laravel already implements the proposed envelope.
- **Alternatives considered:** Assume an unconfirmed backend envelope (rejected); expose raw `Response` objects to components (rejected because error handling would be duplicated); treat all failures as generic errors (rejected because the required UI states differ).
- **References:** [Laravel validation](https://laravel.com/docs/validation), [Laravel responses](https://laravel.com/docs/13.x/responses), [Laravel authorization](https://laravel.com/docs/13.x/authorization).

### Loading, route errors, and expected service states

- **Decision:** Use App Router `loading.tsx` boundaries for navigation loading; a shared state component for expected empty, offline, unauthorized, forbidden, conflict, validation, and service error states; `not-found.tsx` for unknown routes; and `error.tsx` for unexpected rendering exceptions.
- **Rationale:** These states have different user actions and should be represented consistently, while framework boundaries handle route transitions and unexpected failures.
- **Alternatives considered:** Build bespoke state markup per page (rejected because visual and behavior drift); show every failure through a single error boundary (rejected because expected API responses are not rendering exceptions).
- **References:** [Next.js loading convention](https://nextjs.org/docs/app/api-reference/file-conventions/loading), [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling).

### Scope of the prototype data and access

- **Decision:** Student and admin placeholder routes are directly accessible in the prototype and display only clearly labeled, non-sensitive sample content. Real records, authentication, and authorization are deferred; their policy is a prerequisite before connecting real private data.
- **Rationale:** This follows the clarification that open access is acceptable for the demo while privacy must be enforced when the platform uses real data.
- **Alternatives considered:** Add a fake login gate now (rejected because real authentication is explicitly out of scope and a mock gate can imply security that does not exist); use real or copied personal records in fixtures (rejected for privacy and data separation).

## Deferred decisions

- Laravel endpoint paths, request payloads, pagination/filter parameters, and exact success envelope remain unknown until the backend contract is published.
- Authentication mechanism, session/token lifecycle, role enforcement, and detailed privacy/retention rules must be agreed and implemented before real student/admin records are connected.
- The meaning and recovery action for HTTP 409 must be defined per endpoint when those endpoints exist.
- Whether a production build needs runtime API-mode switching is deferred; the initial single setting is build-time as documented above.

