# UI Routes and State Contract

## Route map

| Area | Path | Shell |
|---|---|---|
| Public | `/` | Public navigation |
| Public | `/login` | Public navigation |
| Public | `/register` | Public navigation |
| Student | `/student` | Student dashboard |
| Student | `/student/academic` | Student dashboard |
| Student | `/student/library` | Student dashboard |
| Student | `/student/productivity` | Student dashboard |
| Student | `/student/interests` | Student dashboard |
| Student | `/student/teams` | Student dashboard |
| Student | `/student/exchange/books` | Student dashboard |
| Student | `/student/exchange/devices` | Student dashboard |
| Student | `/student/agreements` | Student dashboard |
| Student | `/student/settings` | Student dashboard |
| Admin | `/admin` | Admin dashboard |
| Admin | `/admin/students` | Admin dashboard |
| Admin | `/admin/library` | Admin dashboard |
| Admin | `/admin/agreements` | Admin dashboard |
| Admin | `/admin/reports` | Admin dashboard |

There are 18 routes. The public route group is source organization only and does not change the URL.

## Shell behavior

- Root document language is Arabic and direction is RTL.
- Public routes use a public Navbar and responsive content shell.
- Student routes use student navigation with a dark sidebar on desktop and an accessible compact navigation pattern on mobile.
- Admin routes use an admin navigation shell with the same brand language and darker sidebar surface.
- Shared components include Navbar, Sidebar, Card, Table, form inputs, Modal, Button, and state panels.
- All pages are placeholders in this phase. Student and admin prototype pages are directly accessible and show only synthetic sample content.

## Standard states

| State | Trigger | UI behavior |
|---|---|---|
| Loading | Route segment or request is pending | Show stable skeleton/progress UI; retain the owning shell. |
| Empty | Successful response has no displayable items | Explain the empty state in Arabic and provide a relevant next step only if one exists. |
| Error | Unexpected service response or rendering exception | Show a safe error message; unexpected rendering exceptions use the App Router error boundary. |
| Unauthorized (401) | API reports missing/invalid authentication | Show sign-in-required copy; no real sign-in redirect is implemented in this phase. |
| Forbidden (403) | API reports insufficient access | Show a distinct forbidden state. |
| Not found (404) | Route or requested resource is unavailable | Unknown routes use the not-found boundary; API resource 404 uses a resource state without asserting why it is unavailable. |
| Conflict (409) | API reports a request conflict | Show a conflict state; endpoint-specific recovery is deferred. |
| Validation (422) | API rejects submitted fields | Show field-level issues normalized by the API layer. |
| Offline | Network request cannot connect | Show offline state and retry when the page has a retryable request. |

## Access boundary

No authentication or authorization is implemented for the prototype. This is acceptable only while all displayed data is synthetic. Before real private student or admin data is connected, enforce authentication and role authorization on both server and API, then verify the privacy rules for each route and response. A UI-only hidden link is not access control.

