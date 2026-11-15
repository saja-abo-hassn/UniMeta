# UniMeta Constitution

Project: UniMeta, an Arabic RTL university student platform (Landing, Student Dashboard, Admin Dashboard).
Stack: Next.js + React + TypeScript frontend; Laravel/PHP REST API backend; Figma is the final design reference, accessed through the Figma MCP.

## Core Principles

### I. Arabic-First, RTL, and Design Palette
- Arabic-first, RTL layout, responsive down to mobile.
- Brand Palette: `#295255` (primary), `#577877` (secondary), `#F0F5F7` (light), `#162623` (dark).
- Calm glass-style cards, sidebar darker than main content area.

### II. Role-Based Access Control
- Roles are strictly `Student` and `Admin`.
- Authorization is enforced on the server for every request; the frontend only hides UI elements.

### III. UI States and Form Safety
- Every data screen must handle: loading, empty, error, and unauthorized (401/403) states.
- Duplicate form submissions must be prevented.

### IV. Architecture & Separation of Concerns
- Mock data lives in a separate layer from real API data and is swapped via a single API client configuration switch.
- Typed request/response contracts (TypeScript).

### V. Academic Rules & Fee Estimations
- GPA is calculated out of 100, weighted by credit hours (no 4.0 scale).
- Fees are non-binding estimates in JOD with no online payment processing.

### VI. Out of Scope (Strictly Forbidden)
- Never build: academic calendar, global notification center, discussion community, standalone Course Hub, standalone chatbot page, team-leader admin role, admin intervention in team acceptance, auto-expulsion / public shaming.

### VII. Data Privacy and Sensitive Attributes
- Sensitive data (national ID, signatures) is masked by default, access is audit-logged, and never loaded in list views.

### VIII. API Contracts
- API paths in the reference document are proposals; the API contract is documented in `specs/` and agreed upon before integration.

### IX. Figma as Visual Source of Truth
- Figma is the absolute visual source of truth.
- Before implementing any page, read its frame via the Figma MCP and match layout, spacing, typography, colors, icons, and responsive behavior.
- All styles come from shared design tokens; no hardcoded values in pages.
- Visual conflict: Figma wins.
- Business rule / scope conflict: Constitution wins (raise conflict in clarify).

### X. Security & Secret Management
- Never commit secrets, credentials, or API keys, including Figma tokens.

## Quality Gates
- TypeScript strict mode
- ESLint clean
- Component tests for key flows
- Visual comparison against Figma for every page

**Version**: 1.0.0 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-05
