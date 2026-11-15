# Tasks: UniMeta Foundation

**Input**: Design documents from `/specs/001-unimeta-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: No test-writing tasks are included because the specification does not request tests. Implementation verification is listed in the final phase and `quickstart.md`.

**Organization**: Tasks are grouped by user story to support incremental implementation and review.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can be completed in parallel with other marked tasks in the same phase because it targets separate files and has no unmet dependency.
- **[Story]**: User story from `spec.md`.
- Every task identifies its target file path(s).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing Next.js project baseline and prepare the documented frontend configuration.

- [X] T001 Review the existing app scripts and strict TypeScript settings in `package.json` and `tsconfig.json`; retain Next.js App Router, TypeScript strict mode, Tailwind CSS v4, and npm.
- [X] T002 [P] Document mock-mode default and the separate Laravel base URL variable in `.env.example`, with no credentials or private values.
- [X] T003 [P] Add the self-hosted Arabic font asset and its source/license note in `public/fonts/NotoSansArabic-Variable.woff2` and `public/fonts/README.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared document, visual foundation, and reusable component contracts needed by every story.

**Checkpoint**: Complete this phase before implementing any user story.

- [X] T004 Set Arabic language and RTL direction on the root document in `app/layout.tsx`.
- [X] T005 [P] Define the four brand colors, Arabic font stack, focus styles, and responsive RTL logical-property primitives in `app/globals.css`.
- [X] T006 [P] Add shared TypeScript UI primitives for area identifiers, destination metadata, and service-state categories in `src/types/ui.ts`.
- [X] T007 Implement the reusable brand Button with keyboard focus and disabled states in `components/shared/button.tsx`.
- [X] T008 [P] Implement the calm translucent Card component in `components/shared/card.tsx`.
- [X] T009 [P] Implement the semantic responsive Table component in `components/shared/table.tsx`.
- [X] T010 [P] Implement labeled RTL form controls and field error presentation in `components/shared/form-fields.tsx`.
- [X] T011 Implement the accessible keyboard-operable Modal component in `components/shared/modal.tsx`.
- [X] T012 Implement shared Navbar and Sidebar components with selected-destination semantics and dark sidebar styling in `components/shared/navbar.tsx` and `components/shared/sidebar.tsx`.
- [X] T013 [P] Export the shared components through `components/shared/index.ts`.
- [X] T014 Implement responsive public, student, and admin shell components using the shared navigation in `components/layout/public-shell.tsx`, `components/layout/student-shell.tsx`, and `components/layout/admin-shell.tsx`.

---

## Phase 3: User Story 1 - Understand UniMeta and choose a starting point (Priority: P1) 🎯 MVP

**Goal**: Introduce UniMeta in Arabic and let visitors reach clear sign-in and registration placeholders.

**Independent Test**: Open `/`, identify UniMeta's purpose, and reach `/login` or `/register` in one selection; each destination clearly says the service is not available yet and claims no account action succeeded.

### Implementation for User Story 1

- [X] T015 [P] [US1] Add the public route-group layout and wrap its pages in the public shell in `app/(public)/layout.tsx`.
- [X] T016 [P] [US1] Create the Arabic public landing page with links to both account-entry placeholders in `app/(public)/page.tsx`.
- [X] T017 [P] [US1] Create an unavailable sign-in placeholder that does not accept credentials or imply authentication in `app/(public)/login/page.tsx`.
- [X] T018 [P] [US1] Create an unavailable registration placeholder that does not submit or imply account creation in `app/(public)/register/page.tsx`.
- [X] T019 [US1] Add shared placeholder page content for title, Arabic description, and service-not-ready notice in `components/placeholders/page-placeholder.tsx`.

**Checkpoint**: The public journey works independently with both entry links and honest placeholder messaging.

---

## Phase 4: User Story 2 - Find student services (Priority: P1)

**Goal**: Provide all ten student destinations in a responsive student shell with the current destination identified.

**Independent Test**: Open each student path directly and through student navigation at desktop and 360px widths; confirm the same page, selected navigation item, Arabic title, and honest placeholder notice appear without horizontal page scrolling.

### Implementation for User Story 2

- [X] T020 [P] [US2] Create the student layout using the student shell and define the ten student navigation destinations in `app/student/layout.tsx` and `src/lib/navigation/student.ts`.
- [X] T021 [P] [US2] Create the student overview placeholder at `/student` in `app/student/page.tsx`.
- [X] T022 [P] [US2] Create the academic placeholder at `/student/academic` in `app/student/academic/page.tsx`.
- [X] T023 [P] [US2] Create the library placeholder at `/student/library` in `app/student/library/page.tsx`.
- [X] T024 [P] [US2] Create the productivity placeholder at `/student/productivity` in `app/student/productivity/page.tsx`.
- [X] T025 [P] [US2] Create the interests placeholder at `/student/interests` in `app/student/interests/page.tsx`.
- [X] T026 [P] [US2] Create the teams placeholder at `/student/teams` in `app/student/teams/page.tsx`.
- [X] T027 [P] [US2] Create the book-exchange placeholder at `/student/exchange/books` in `app/student/exchange/books/page.tsx`.
- [X] T028 [P] [US2] Create the device-exchange placeholder at `/student/exchange/devices` in `app/student/exchange/devices/page.tsx`.
- [X] T029 [P] [US2] Create the agreements placeholder at `/student/agreements` in `app/student/agreements/page.tsx`.
- [X] T030 [P] [US2] Create the settings placeholder at `/student/settings` in `app/student/settings/page.tsx`.

**Checkpoint**: All ten student destinations render directly and through the same responsive student navigation.

---

## Phase 5: User Story 3 - Find administrator areas (Priority: P2)

**Goal**: Provide five administrator destinations in a separate responsive shell, with no real administrative actions or records.

**Independent Test**: Open each admin path directly and from admin navigation at desktop and 360px widths; confirm the admin shell, current destination, Arabic placeholder, and open prototype access with no real records or actions.

### Implementation for User Story 3

- [X] T031 [P] [US3] Create the admin layout using the admin shell and define the five administrator navigation destinations in `app/admin/layout.tsx` and `src/lib/navigation/admin.ts`.
- [X] T032 [P] [US3] Create the administrator overview placeholder at `/admin` in `app/admin/page.tsx`.
- [X] T033 [P] [US3] Create the student-management placeholder with no real records or management actions in `app/admin/students/page.tsx`.
- [X] T034 [P] [US3] Create the administrator library placeholder with no real library records or actions in `app/admin/library/page.tsx`.
- [X] T035 [P] [US3] Create the agreements placeholder with no real records or actions in `app/admin/agreements/page.tsx`.
- [X] T036 [P] [US3] Create the reports placeholder with no real report data or actions in `app/admin/reports/page.tsx`.

**Checkpoint**: All five administrator destinations are directly reachable in prototype mode and clearly remain placeholders.

---

## Phase 6: User Story 4 - Understand service and connection states (Priority: P2)

**Goal**: Distinguish loading, empty, error, unauthorized, forbidden, not-found, conflict, validation, and offline states with Arabic guidance and keyboard-accessible recovery controls where appropriate.

**Independent Test**: Present every state and confirm its meaning is distinguishable, restricted information is not shown, and retry or field guidance appears only when applicable; navigate and operate controls using only the keyboard.

### Implementation for User Story 4

- [ ] T037 [US4] Implement the reusable Arabic StatePanel for loading, empty, error, unauthorized, forbidden, not-found, conflict, validation, and offline outcomes in `components/shared/state-panel.tsx`.
- [ ] T038 [P] [US4] Add route-segment loading presentation while retaining the student shell in `app/student/loading.tsx`.
- [ ] T039 [P] [US4] Add route-segment loading presentation while retaining the admin shell in `app/admin/loading.tsx`.
- [ ] T040 [P] [US4] Add the unknown-route not-found state in `app/not-found.tsx`.
- [ ] T041 [P] [US4] Add an unexpected rendering error boundary with a safe recovery action in `app/error.tsx`.
- [ ] T042 [US4] Ensure shared navigation, buttons, form controls, and modal expose semantic labels, keyboard operation, and visible focus using `components/shared/navbar.tsx`, `components/shared/sidebar.tsx`, `components/shared/button.tsx`, `components/shared/form-fields.tsx`, and `components/shared/modal.tsx`.

**Checkpoint**: Each required service state is distinct and accessible independently of backend readiness.

---

## Phase 7: User Story 5 - Explore the early sample experience (Priority: P2)

**Goal**: Use clearly marked synthetic sample content behind one typed API client mode switch, without coupling sample fixtures to the future Laravel transport.

**Independent Test**: Run in mock mode, confirm sample content is visibly labeled and synthetic, and switch the single mode setting to real without changing page imports or component contracts; verify the real transport has no mock imports and clearly reports unconfigured API/network conditions.

### Implementation for User Story 5

- [ ] T043 [P] [US5] Define generic API request, response envelope, metadata, issue, failure, and normalized error types in `src/types/api.ts`.
- [ ] T044 [P] [US5] Define the single `NEXT_PUBLIC_API_MODE` selector defaulting to `mock` and the separate API base URL in `src/lib/api/config.ts`.
- [ ] T045 [P] [US5] Add clearly synthetic destination/sample records marked with `source: "sample"` in `src/mocks/data.ts`.
- [ ] T046 [US5] Implement mock transport handlers that import only `src/mocks/data.ts` and return the shared typed envelope in `src/mocks/transport.ts`.
- [ ] T047 [US5] Implement the real fetch transport and normalize response, network, and Laravel-style validation shapes without importing `src/mocks/` in `src/lib/api/real-transport.ts`.
- [ ] T048 [US5] Implement status mapping for 401, 403, 404, 409, 422, and offline/network failures in `src/lib/api/errors.ts`.
- [ ] T049 [US5] Implement the typed API client that delegates to exactly one configured transport in `src/lib/api/client.ts`.
- [ ] T050 [US5] Add a sample-content disclosure to student and admin placeholder views in `components/placeholders/page-placeholder.tsx`.

**Checkpoint**: Prototype pages can consume sample content through the typed API interface; real transport remains isolated and endpoint-neutral until Laravel is ready.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verify the finished route skeleton, accessibility, responsive behavior, data separation, and implementation quickstart.

- [ ] T051 [P] Add mobile route-by-route and state-verification steps for all 18 paths to `specs/001-unimeta-foundation/quickstart.md`.
- [ ] T052 Verify RTL direction, Arabic labels, the four exact brand token values, translucent cards, darker sidebar, visible keyboard focus, and 360px usability across `app/`, `components/`, and `src/`.
- [ ] T053 Verify the mode switch selects mock or real transport, mock fixtures are only imported by mock transport, and no `NEXT_PUBLIC_*` secret is documented in `.env.example` or `src/lib/api/config.ts`.
- [ ] T054 Run the documented implementation checks from `specs/001-unimeta-foundation/quickstart.md` (`npm run lint`, `npx tsc --noEmit`, and `npm run build`) and resolve any failures.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately; confirms the existing project and font/config inputs.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user-story work because every story relies on the root RTL document and shared visual components.
- **User Stories (Phases 3-7)**: Depend on Phase 2. They can be delivered incrementally; independent pages within a story can proceed in parallel after that story's shell/navigation task is complete.
- **Polish (Phase 8)**: Depends on the desired user stories and API foundation being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only; independent public MVP.
- **US2 (P1)**: Depends on Phase 2; student route shell and destination registry precede route pages.
- **US3 (P2)**: Depends on Phase 2; admin route shell and destination registry precede route pages. Independent of US1 and US2.
- **US4 (P2)**: Depends on Phase 2; state panel and route boundaries are independent of backend transport. Shared accessibility review touches controls created in Phase 2.
- **US5 (P2)**: Depends on Phase 2 types/components. Mock and real transport files can be developed separately; the client selection depends on both transports and configuration.

### Parallel Opportunities

- In Phase 1, T002 and T003 can run in parallel.
- In Phase 2, T005-T006 and independent component files T008-T011 can proceed in parallel after T004; T012 depends on the shared visual primitives, while T014 depends on T012.
- In US1, the landing, login, and register pages (T016-T018) can proceed in parallel once the public layout exists; T019 is a shared placeholder dependency.
- In US2, T021-T030 are separate route files and can proceed in parallel after T020.
- In US3, T032-T036 are separate route files and can proceed in parallel after T031.
- In US4, T038-T041 target separate route boundary files and can proceed in parallel after T037.
- In US5, T043-T045 can proceed in parallel; T046 and T047 can proceed in parallel after T043; T049 depends on T044, T046, and T047; T048 integrates into the real transport/client path.
- After Phase 2, US1, US2, US3, US4, and initial US5 type/fixture work can be assigned independently, subject to shared file ownership noted above.

## Parallel Examples

### User Story 1

```text
T016 landing page in app/(public)/page.tsx
T017 sign-in placeholder in app/(public)/login/page.tsx
T018 registration placeholder in app/(public)/register/page.tsx
```

### User Story 2

```text
T022 academic page in app/student/academic/page.tsx
T023 library page in app/student/library/page.tsx
T024 productivity page in app/student/productivity/page.tsx
T025 interests page in app/student/interests/page.tsx
```

### User Story 3

```text
T033 students page in app/admin/students/page.tsx
T034 library page in app/admin/library/page.tsx
T035 agreements page in app/admin/agreements/page.tsx
T036 reports page in app/admin/reports/page.tsx
```

### User Story 4

```text
T038 student loading boundary in app/student/loading.tsx
T039 admin loading boundary in app/admin/loading.tsx
T040 not-found boundary in app/not-found.tsx
T041 error boundary in app/error.tsx
```

### User Story 5

```text
T045 synthetic fixtures in src/mocks/data.ts
T047 real transport adapter in src/lib/api/real-transport.ts
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Complete US1 and independently review the public introduction and account-entry placeholders.
3. Deliver the public MVP while student, admin, and backend-ready surfaces continue incrementally.

### Incremental Delivery

1. Setup + Foundational → shared Arabic RTL and design foundation.
2. US1 → public landing and honest account-entry placeholders.
3. US2 → student navigation and all student destinations.
4. US3 → admin navigation and all admin destinations.
5. US4 → consistent service, access, and connection states.
6. US5 → isolated sample content and typed mock/real transport selection.
7. Polish → complete route, responsive, accessibility, and transport verification.

### Notes

- `[P]` marks tasks that target separate files and have no incomplete prerequisite.
- `[US#]` maps implementation tasks to the corresponding story in `spec.md`.
- Sample data remains synthetic and separate from real transport; real private data remains blocked on approved auth, role, and privacy rules.
- Backend endpoints and authentication behavior are intentionally not invented in these tasks.

