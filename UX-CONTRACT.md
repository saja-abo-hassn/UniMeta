# UniMate UX Contract

## Scope

This contract covers the foundation only: Arabic RTL rendering, route ownership, shared navigation and primitives, and standard UI states. It does not define authentication, business rules, backend behavior, or the excluded features listed in `DESIGN.md`.

## Locale and shell

- The root document is `lang="ar"` and `dir="rtl"`; component layouts use logical properties and Arabic copy.
- `/` is the public landing shell. `/login` and `/register` use the public navigation and auth placeholder treatment.
- `/student/**` shares the student sidebar shell. `/admin/**` shares the admin sidebar shell.
- Desktop uses a dark sidebar beside a light work area. Mobile exposes the same links in a keyboard-operable navigation disclosure.
- Each route provides a page-specific Arabic title and description; placeholders clearly state that the full service is not implemented yet.

## Shared component owners

`components/shared` owns Navbar, Sidebar, PagePlaceholder, Card, Table, form fields, Modal, Button, and state panels. Route files compose these owners and do not create parallel versions.

## State language

Loading, empty, error, forbidden (401/403), and offline states use one shared state panel with Arabic labels and recovery guidance where an action is available. API failures retain status and the `data`, `meta`, and `errors` envelope shape. No authentication or authorization decision is implemented in this phase.

## API source selection

`src/lib/api/config.ts` is the single source-selection setting. The mock adapter and fixtures remain under `src/mocks`; real requests use the Laravel base URL and typed client. Switching source must not require editing route components or fixture data.

## Accessibility and responsive behavior

Native anchors and buttons own navigation and actions. Focus is visible, field labels are associated with controls, tables use native table semantics, and modal dialogs use the browser dialog focus and Escape behavior. Mobile navigation preserves every route link and does not depend on hover. Reduced-motion preferences are honored.
