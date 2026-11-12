# UniMeta: Spec Kit + Figma Implementation Plan

> Source: "UniMeta: ط§ظ„ط¯ظ„ظٹظ„ ط§ظ„ط´ط§ظ…ظ„ ظ„طµظپط­ط§طھ ط§ظ„ظ…ظ†طµط© ظˆط§ظ„ط±ط¨ط· ط¨ظٹظ†ظ‡ط§" (1 Nov 2026)
> Method: Spec-Driven Development with [GitHub Spec Kit](https://github.com/github/spec-kit), with **Figma as the visual source of truth** via the Figma MCP.
> Each phase below is one Spec Kit feature (its own `specs/00X-*/` folder and branch).
> Command prefix: this file uses `$speckit-*` (Codex). In Claude Code / other agents use `/speckit.*`.

---

## 1. Executive Summary

**UniMeta** is a unified Arabic (RTL) university web platform that simplifies a student's academic life: study-plan tracking, credit-hour progress, GPA calculation (out of 100), a digital library, study productivity tools, an interests test, graduation-team matching, and a structured book/device loan, rental, and exchange system with admin oversight.

**Three interfaces, one system**

| Interface | User | Purpose |
|---|---|---|
| Landing Page | Visitor | Introduce the platform, register, log in |
| Student Dashboard | Student | Academic, personal, teams, and exchange services |
| Admin Dashboard | Admin | Manage accounts, library, agreements, reports |

**Stack:** React + Next.js + TypeScript (frontend), Laravel/PHP + REST APIs (backend), Figma (design source of truth, read through the Figma MCP).
**Roles:** Visitor, Student, Admin only.
**Brand:** `#295255` primary, `#577877` secondary, `#F0F5F7` light, `#162623` dark; calm glass-style cards, darker sidebar, RTL and responsive.

**Core principles**
- Authorization is enforced on the server for every request. The frontend only hides UI.
- Admin approval **and** mutual handover confirmation are both required before an agreement becomes active.
- GPA is out of 100 (credit-weighted). Fees are estimates in JOD, with no payment processing.
- Sensitive data (national ID, signatures) is masked, access-logged, and never shown in list views.
- Admin has no role in accepting graduation-team members. Reports never trigger automatic penalties.
- **Figma wins visually.** Layout, spacing, typography, colors, icons, and responsive behavior come from the Figma frame, not from guesses.

**Explicitly out of scope:** academic calendar, global notification center, discussion community, standalone Course Hub, standalone chatbot page, 4.0 GPA, online payments, team-leader admin role, automatic expulsion or public shaming.

**Important note:** The API routes, tables, and permission model in the source document are *proposals*, not an implemented backend. The API contract is therefore documented in each spec's `contracts/` folder and agreed before integration. Until then, the frontend uses a separated mock-data layer.

**Delivery approach:** 11 phases, each going through the full Spec Kit loop with its Figma frames attached. Phases 1 to 3 are the critical path; phases 5 to 8 are independent and can run in parallel.

---

## 2. Setup (once)

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init UniMeta --ai codex      # or: --ai claude
specify check
```

### Workflow for every phase

```
$speckit-specify     <phase prompt from section 5, with its Figma links filled in>
$speckit-clarify     answer the open questions
$speckit-plan        <tech notes + "read the Figma frames via MCP and map them to components/tokens">
$speckit-tasks
$speckit-analyze     must pass the constitution check
$speckit-implement   fetch each frame via Figma MCP before building its page
```

Merge the branch, then start the next phase.

---

## 3. Figma Integration

### 3.1 Connect the Figma MCP

1. Figma â†’ Settings â†’ Security â†’ **Personal access tokens** â†’ generate (File content: read-only).
2. **Antigravity:** "..." in the agent panel â†’ Manage MCP Servers â†’ View raw config â†’ edit `mcp_config.json`.
   **Codex:** edit `~/.codex/config.toml`.

`mcp_config.json` (Antigravity):
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
    }
  }
}
```
On Windows, if `npx` fails, use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]`.

`config.toml` (Codex):
```toml
[mcp_servers.figma]
command = "npx"
args = ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
```

3. Restart the IDE and confirm `figma` shows as connected.
4. **Never commit the token.** Keep it out of the repo (use an environment variable or local config only).

### 3.2 Figma frame links (fill before each phase)

In Figma: right-click the frame â†’ **Copy link to selection**. Give one frame or page per link, not the whole file.

| Phase | Frames needed | Desktop link | Mobile link |
|---|---|---|---|
| 1 | Design system: colors, typography, components, layout shells | `<PASTE>` | `<PASTE>` |
| 2 | Landing page (all sections) | `<PASTE>` | `<PASTE>` |
| 3 | Login, register, password recovery | `<PASTE>` | `<PASTE>` |
| 4 | Student shell, home, academic path, calculators | `<PASTE>` | `<PASTE>` |
| 5 | Library (student cards, subject detail) + admin library | `<PASTE>` | `<PASTE>` |
| 6 | Productivity (Pomodoro, tasks, journal) + interests quiz (3 states) | `<PASTE>` | `<PASTE>` |
| 7 | Graduation teams (search, details, requests) | `<PASTE>` | `<PASTE>` |
| 8 | Books and devices markets | `<PASTE>` | `<PASTE>` |
| 9 | Agreements (student + admin review) | `<PASTE>` | `<PASTE>` |
| 10 | Admin overview, accounts, reports, audit log | `<PASTE>` | `<PASTE>` |

### 3.3 Figma rules for the agent

- Before writing a spec or building a page, fetch the listed frames through the Figma MCP.
- Reuse the design tokens from Phase 1. Do not hardcode colors, fonts, or spacing in pages. If a value is missing from the tokens, add it to the tokens first.
- If Figma and the reference document disagree on **layout or visuals**, Figma wins. If they disagree on **business rules or scope**, the reference document and the constitution win. Flag the conflict in `/speckit.clarify` instead of silently choosing.
- If a Figma state is missing (loading, empty, error), use the shared state components from Phase 1.

---

## 4. Constitution (`$speckit-constitution`)

```
Project: UniMeta, an Arabic RTL university student platform (Landing, Student Dashboard, Admin Dashboard).
Stack: Next.js + React + TypeScript frontend; Laravel/PHP REST API backend; Figma is the final design reference, accessed through the Figma MCP.

Principles:
1. Arabic-first, RTL, responsive. Palette: #295255 (primary), #577877 (secondary), #F0F5F7 (light), #162623 (dark). Calm glass-style cards, sidebar darker than main area.
2. Roles are only Student and Admin. Authorization is enforced on the server for every request; the frontend only hides UI.
3. Every data screen has loading, empty, error, and unauthorized states. Prevent duplicate form submits.
4. Mock data lives in a separate layer from real API data and is swapped via a single API client layer. Typed request/response contracts (TypeScript).
5. GPA is out of 100, weighted by credit hours. Fees are estimates in JOD with no payment. No 4.0 scale, no online payments.
6. Out of scope (never build): academic calendar, global notification center, discussion community, standalone Course Hub, standalone chatbot page, team-leader admin role, admin intervention in team acceptance, auto-expulsion/public shaming.
7. Sensitive data (national ID, signatures) is masked by default, access is audit-logged, and it is never loaded in list views.
8. API paths in the reference doc are proposals, so the API contract is documented in specs/ and agreed before integration.
9. Figma is the source of truth for visuals. Before implementing any page, read its frame via the Figma MCP and match layout, spacing, typography, colors, icons, and responsive behavior. All styles come from shared design tokens; no hardcoded values in pages. On a visual conflict Figma wins; on a business-rule or scope conflict this constitution wins and the conflict is raised in clarify.
10. Never commit secrets, including the Figma token.

Quality gates: TypeScript strict, ESLint, component tests for key flows, visual comparison against Figma for every page.
```

---

## 5. Phases

### Phase overview

| # | Phase | Depends on | Status |
|---|---|---|---|
| 1 | Foundation: design system from Figma, RTL, API client, mocks | none | âکگ |
| 2 | Landing page | 1 | âکگ |
| 3 | Auth, roles, route guards | 1 | âکگ |
| 4 | Student shell, home, academic path | 3 | âکگ |
| 5 | Digital library (student + admin) | 3 | âکگ |
| 6 | Productivity + interests quiz | 3 | âکگ |
| 7 | Graduation teams | 3 | âکگ |
| 8 | Marketplace (books and devices) | 3 | âکگ |
| 9 | Agreements lifecycle | 8 | âکگ |
| 10 | Admin: overview, accounts, reports, audit log | 3, 9 | âکگ |
| 11 | Hardening, Figma visual QA, acceptance | all | âکگ |

Every `specify` prompt below ends with a **Design reference** block. Replace the placeholders with the links from section 3.2.

---

### Phase 1: Foundation

**`$speckit-specify`**
```
Set up the UniMeta foundation: a Next.js + TypeScript app (App Router) for an Arabic RTL university platform with three areas: public Landing, Student Dashboard, Admin Dashboard.

Scope:
- Design tokens extracted from the Figma design system (colors, typography, spacing, radii, shadows, glass-card effect). Brand palette: #295255, #577877, #F0F5F7, #162623.
- Global RTL Arabic layout, responsive down to mobile, with the Arabic font used in Figma.
- Shared components matching Figma: Navbar, Sidebar, Card, Table, Form inputs, Modal, Button.
- Standard state components: loading, empty, error, forbidden (401/403), offline.
- Route skeleton with placeholder pages: /, /login, /register, /student, /student/academic, /student/library, /student/productivity, /student/interests, /student/teams, /student/exchange/books, /student/exchange/devices, /student/agreements, /student/settings, /admin, /admin/students, /admin/library, /admin/agreements, /admin/reports.
- Typed API client layer (request/response types, data/meta/errors shape, handling of 401/403/404/409/422) with a single switch between mock data and the real Laravel API. Mocks live in a separate folder.
- Folder structure for pages, components, API layer, types, and mocks.

Out of scope: real authentication, real business pages, backend work, and any excluded feature (calendar, notification center, community, Course Hub, standalone chatbot page, 4.0 GPA, payments).

Design reference (Figma): 
- Design system / components: <FIGMA_LINK_DESKTOP>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP before writing the spec. Tokens and components must match Figma.

Success criteria: the app runs in RTL; every route renders a placeholder inside the correct layout shell; shared components visually match Figma; switching the API client between mock and real requires changing one setting.
```
**Done when:** tokens and shared components match Figma, RTL works, and the API client can switch between mock and real.

---

### Phase 2: Landing Page

**`$speckit-specify`**
```
Build the Landing Page: navbar with 4 links (ط§ظ„ط±ط¦ظٹط³ظٹط©طŒ ظ„ظ…ط§ط°ط§ UniMetaطںطŒ ظ…ظ…ظٹط²ط§طھظ†ط§طŒ ظ…ظ† ظ†ط­ظ†), UniMeta + Al-Azhar logos, login link and "ط§ط¨ط¯ط£ ط§ظ„ط¢ظ†" button, Hero ("ط±ط­ظ„طھظƒ ط§ظ„ط¬ط§ظ…ط¹ظٹط©... ظƒظ„ظ‡ط§ ط¨ظ…ظƒط§ظ† ظˆط§ط­ط¯") with dashboard preview, interests-test card, why-UniMeta cards, features (academic path, GPA, library, productivity, graduation teams, exchange, smart assistant), About with team members. Unauthenticated visitors see only public pages; the interests card routes to login if not signed in, otherwise to /student/interests.

Design reference (Figma):
- Landing desktop: <FIGMA_LINK_DESKTOP>
- Landing mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP. Use the shared tokens and components from Phase 1.
```
**Done when:** every section matches Figma on desktop and mobile, and the interests card routing depends on login state.

---

### Phase 3: Auth, Roles, Route Guards

**`$speckit-specify`**
```
Registration (minimum student data, unique email and university ID), login, logout, password recovery, session handling (Sanctum-style), role read from server after login: Student â†’ /student, Admin â†’ /admin. Private routes redirect unauthenticated users to /login; students are blocked from /admin. Document the CORS/CSRF/session contract.

Design reference (Figma):
- Login / register / recovery desktop: <FIGMA_LINK_DESKTOP>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP, including validation and error states if designed.
```
**Done when:** the role redirect works, a student cannot open `/admin`, logout ends the session, the auth contract is documented, and the forms match Figma.

---

### Phase 4: Student Shell, Home, Academic Path

**`$speckit-specify`**
```
Student dashboard shell (right-side sidebar, top bar, floating assistant icon, no notification bell) and home (greeting, GPA/100, completed/remaining hours, task count, plan progress, today's tasks, quick links). Academic path: plan selection on first use, course tree (university/college/major, required/elective, codes, hours, prerequisites, status), hours-progress calculator, fee estimator (JOD, not payment), GPA calculator (semester/cumulative/projected, out of 100, credit-weighted).

Design reference (Figma):
- Student shell + home + academic: <FIGMA_LINK_DESKTOP>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** GPA is out of 100 and credit-weighted, the fee estimate is labeled as non-binding, there is no calendar or notification bell, and the screens match Figma.

---

### Phase 5: Digital Library

**`$speckit-specify`**
```
Student library: subject cards (name, code, major, file count), subject detail with files by type (summaries, lectures, references, exams), search and filters (major, subject, file type), open/preview/download per permissions. Admin library management: create subjects linked to a major, upload resources, edit description/type/publish status, hide/delete. Published files appear on the subject's own card.

Design reference (Figma):
- Student library: <FIGMA_LINK_DESKTOP>
- Admin library: <FIGMA_LINK_DESKTOP_ADMIN>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** a file uploaded by an admin appears on the student's subject card, there is no standalone Course Hub, and the screens match Figma.

---

### Phase 6: Productivity + Interests Quiz

**`$speckit-specify`**
```
Pomodoro timer (start/pause/resume), focus garden tied to completed sessions, session stats, daily tasks (add/edit/complete/delete), private journal (never visible to other users/admin). Interests test with 3 states: intro, sequential questions with progress bar, results with suggested majors and an advisory match percentage (not an admission decision).

Design reference (Figma):
- Productivity: <FIGMA_LINK_DESKTOP>
- Interests quiz (3 states): <FIGMA_LINK_DESKTOP_QUIZ>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** journals are private to their author, quiz results are labeled advisory, and all three quiz states match Figma.

---

### Phase 7: Graduation Teams

**`$speckit-specify`**
```
Team search page with search, two independent filters (project stage: all/1/2/1&2; members needed: 1/2/1 or 2), team cards and details. Students publish team ads, others send join requests with a message; the owner accepts/rejects in "ط·ظ„ط¨ط§طھ ط§ظ„ط§ظ†ط¶ظ…ط§ظ…", seats update safely on accept; applicants see the outcome in "ط·ظ„ط¨ط§طھظٹ". Contextual counter inside this section only. Admin has no role in acceptance.

Design reference (Figma):
- Teams (search, details, requests): <FIGMA_LINK_DESKTOP>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** both filters work independently, only the ad owner can decide, seat counts update safely on accept, and screens match Figma.

---

### Phase 8: Marketplace (Books and Devices)

**`$speckit-specify`**
```
Separate books and devices markets: search, filters, listing cards, add listing, listing details, and a request button for loan/rental/exchange. Rental records an agreed price with no in-platform payment.

Design reference (Figma):
- Books market: <FIGMA_LINK_DESKTOP_BOOKS>
- Devices market: <FIGMA_LINK_DESKTOP_DEVICES>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** each market has its own routes, listings can be created, requests link to a listing and its owner, and screens match Figma.

---

### Phase 9: Agreements Lifecycle

**`$speckit-specify`**
```
Agreement creation from a request, with transaction types: loan, rental, temporary exchange, permanent exchange. Flow: pending signature â†’ pending admin review â†’ pending handover â†’ active â†’ completed; alternates: rejected, overdue, disputed. Both parties sign; admin approves/rejects with reason; each party confirms handover/receipt only for themselves; active only after admin approval AND both confirm handover; permanent exchange replaces return with mutual receipt confirmation. Admin review screen with party verification fields (masked national ID, access logged). Student reports linked to an agreement; a report alone proves nothing.

Design reference (Figma):
- Student agreements: <FIGMA_LINK_DESKTOP>
- Admin agreement review: <FIGMA_LINK_DESKTOP_ADMIN>
- Mobile: <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP, including each status badge and state.
```
**Done when:**
- An agreement does not become active on signatures or admin approval alone.
- Nobody can confirm handover for the other party.
- Status names are unified between database and UI.
- Screens and status badges match Figma.

---

### Phase 10: Admin Dashboard

**`$speckit-specify`**
```
Admin overview with KPI cards each linking to a filtered list (accounts, pending/active/overdue agreements, open reports; no revenue). Student accounts table with search/filter and authorized actions; every status or permission change is logged with admin, reason, date. Reports management (parties' statements, attachments, handling history, no automatic penalties). Audit log screen. Granular admin permissions.

Design reference (Figma):
- Admin overview, accounts, reports, audit log: <FIGMA_LINK_DESKTOP_ADMIN>
- Mobile (if designed): <FIGMA_LINK_MOBILE>
Read these frames through the Figma MCP.
```
**Done when:** KPIs come from real records, every change is audit-logged, reports do not trigger automatic penalties, and screens match Figma.

---

### Phase 11: Hardening, Figma Visual QA, Acceptance

**`$speckit-specify`**
```
Run the acceptance scenarios: role-based access, interests flow from landing, library file visibility, team filters and request flow, seat updates, agreement activation rules, return/closure, reports with no auto-penalty, ID masking, GPA/fees, logout, mobile RTL.

Also run a visual QA pass: compare every implemented page against its Figma frame (desktop and mobile) through the Figma MCP, list deviations in spacing, typography, colors, icons, and states, and fix them. Remove leftover mock data from real flows, and run a security audit.

Design reference (Figma): all frames listed in the Figma links table.
```

**Acceptance checklist**

| Scenario | Expected result |
|---|---|
| Login by role | Student blocked from admin dashboard |
| Interests test | Correct transition from Landing |
| Library | Admin's file appears in student's account |
| Graduation teams | Filters work; request reaches ad owner |
| Accept request | Membership and seats updated |
| Agreement signing | Requires both parties, admin, and handover confirmation |
| Return | Correct closure after confirmation |
| Reports | Visible to admin with no automatic penalty |
| Identity data | Sensitive information protected |
| Fees and GPA | GPA out of 100; fees estimated, no payment |
| Logout | Session ends, access blocked |
| Mobile | RTL responsive layout matches Figma |
| Visual QA | Every page matches its Figma frame, with no hardcoded styles |

---

## 6. Notes

- **Constitution first.** `$speckit-analyze` will flag any task that reintroduces out-of-scope features or hardcoded styles.
- **Phase 1 sets the quality bar.** If the tokens and shared components are accurate to Figma, every later page is faster and more consistent.
- **Backend (Laravel).** Run a parallel `$speckit-plan` per phase for migrations, policies, controllers, and policy/gate/middleware checks, against the same `contracts/`.
- **Mock vs real data.** Keep mocks separate from server data. Remove them from real flows in Phase 11.
- **Commit after every phase.** Do not move on until `npm run dev` runs clean and the pages look right in RTL.



## ظ†ط¸ط§ظ… ط§ظ„ط£ط¯ظˆط§ط± ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ
- ظˆط§ط¬ظ‡ط© ظˆط§ط­ط¯ط© طھطھط؛ظٹط± ط­ط³ط¨ ط§ظ„ط¯ظˆط±: ط§ظ„ظ…ط´ط±ظپ ظٹط¬ظ‡ظ‘ط² (ظ…ط­طھظˆظ‰طŒ ط¨ظ„ط§ط؛ط§طھطŒ ظ…ط±ط§ط¬ط¹ط© طھط­ظ‚ظ‚)طŒ ظˆط§ظ„ط£ط¯ظ…ظ† ظٹظ‚ط±ط± (ط§ظ„ط§طھظپط§ظ‚ظٹط§طھطŒ ط§ظ„ظ…ط§ظ„ظٹط©طŒ ط§ظ„طµظ„ط§ط­ظٹط§طھ).
- ط§ظ„ط¯ظˆط± ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ طھط£طھظٹ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¹ط¨ط± ط§ظ„طھظˆظƒظ†طŒ ظˆط§ظ„ط³ظٹط±ظپط± ظٹظپط­طµظ‡ط§ ط¨ظƒظ„ ط·ظ„ط¨ (403 ط¹ظ†ط¯ ط¹ط¯ظ… ط§ظ„طµظ„ط§ط­ظٹط©)طŒ ظˆط§ظ„ظˆط§ط¬ظ‡ط© طھط³طھط®ط¯ظ…ظ‡ط§ ظ„ظ„ط¹ط±ط¶ ظپظ‚ط·.
- ط§ظ„ط£ط¯ظ…ظ† ظٹط¹ظٹظ‘ظ† ط§ظ„ظ…ط´ط±ظپظٹظ† ظˆظٹط­ط¯ط¯ طµظ„ط§ط­ظٹط§طھظ‡ظ… ظ…ظ† ظ…طµظپظˆظپط© on/offطŒ ظˆظƒظ„ ط¥ط¬ط±ط§ط، ظ„ظ„ظ…ط´ط±ظپ ظٹظڈط³ط¬ظژظ‘ظ„ ظپظٹ audit log.

ط§ظ„ط­ط§ظ„ط©: ظ‚ظٹط¯ ط§ظ„ط¹ظ…ظ„

