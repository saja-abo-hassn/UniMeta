# Quickstart and Verification

## Run the prototype

1. Install dependencies with `npm install` if they are not already present.
2. Set `NEXT_PUBLIC_API_MODE=mock` in `.env.local` (or use the documented default).
3. Start the development server with `npm run dev`.
4. Open the local development URL and check the public landing page, then visit each route in [the route contract](contracts/ui-routes-and-states.md).

To select the real transport during backend integration, set `NEXT_PUBLIC_API_MODE=real` and configure the separate API base URL. This setting is build-time for production builds; restart the dev server or rebuild after changing it. Do not put secrets in `NEXT_PUBLIC_*` values. The real mode remains provisional until Laravel endpoints, authentication, and privacy rules are agreed.

## Manual verification

- Confirm the root document exposes Arabic language and RTL direction on every route.
- Confirm public, student, and admin routes render inside their intended shell.
- Confirm sidebar surfaces are darker than the main area and the four brand colors are used consistently.
- Check route layouts at 360px wide and desktop width, including keyboard navigation and visible focus.
- Exercise loading, empty, error, unauthorized (401), forbidden (403), not-found (404), conflict (409), validation (422), and offline states with mock responses.
- Switch `NEXT_PUBLIC_API_MODE` between `mock` and `real`; confirm the client changes transport without changing page components. For production, rebuild after changing the variable.
- Confirm mock fixtures contain only synthetic, explicitly sample data and are not imported by the real transport.
- Do not connect real records until authentication, authorization, and privacy rules are implemented.

## Implementation checks

Run these during implementation:

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Real API smoke checks are deferred until the backend provides endpoint and authentication contracts. This planning task does not run these commands.

