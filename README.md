# UniMate

Arabic-first university platform foundation built with Next.js App Router and TypeScript. The app is RTL at the document level and uses a local Arabic-capable system font stack.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` to configure the API source. The default mode is `mock`; set `NEXT_PUBLIC_API_MODE=real` to send requests to the Laravel API. Set `NEXT_PUBLIC_API_URL` when the API is not available at `http://localhost:8000/api`.

## Routes

- Public: `/`, `/login`, `/register`
- Student: `/student`, `/student/academic`, `/student/library`, `/student/productivity`, `/student/interests`, `/student/teams`, `/student/exchange/books`, `/student/exchange/devices`, `/student/agreements`, `/student/settings`
- Admin: `/admin`, `/admin/students`, `/admin/library`, `/admin/agreements`, `/admin/reports`

All dashboard routes use shared area shells. Route pages are intentionally placeholders; authentication, business workflows, and backend behavior are out of scope for this foundation.

## Structure

- `app/`: routes, area layouts, root RTL layout, and global tokens/styles
- `components/shared/`: navigation, placeholders, cards, tables, fields, modal, buttons, and UI states
- `src/lib/api/`: typed API request surface, error normalization, source switch, and Laravel transport
- `src/mocks/`: mock fixtures and transport, separate from the Laravel transport
- `DESIGN.md`: palette, typography, layout, and component direction
- `UX-CONTRACT.md`: route-shell and shared behavior contracts

The API source is selected in `src/lib/api/config.ts` through the single `NEXT_PUBLIC_API_MODE` setting. Mock fixtures are only consumed by the mock transport.
