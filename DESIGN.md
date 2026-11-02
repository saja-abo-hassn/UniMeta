---
version: alpha
colors:
  primary: "#295255"
  secondary: "#577877"
  light: "#F0F5F7"
  dark: "#162623"
  paper: "#FBFDFD"
  muted: "#71817F"
typography:
  arabic:
    fontFamily: "Tahoma, Arial, Noto Sans Arabic, sans-serif"
    fontSize: "15px"
    lineHeight: "1.7"
rounded:
  card: "22px"
  control: "12px"
spacing:
  page: "clamp(24px, 4vw, 52px)"
  section: "28px"
components:
  card:
    radius: "22px"
    background: "rgb(255 255 255 / 78%)"
    shadow: "0 12px 36px rgb(22 38 35 / 5%), 0 1px 2px rgb(22 38 35 / 4%)"
  sidebar:
    background: "#162623"
  button:
    radius: "12px"
    primary: "#295255"
omitted:
  - section: motion
    reason: "Use restrained CSS transitions and honor reduced-motion; no motion tokens are needed for the foundation."
---

## Overview

UniMate is an Arabic-first companion for university life. The public landing page introduces the platform; student and admin areas prioritize clear wayfinding and calm, legible work surfaces. The visual reference is a university reading room: deep green-black navigation, pale daylight surfaces, and precise typographic hierarchy. The small orbit seal in the landing hero is the signature element. Keep operational pages quieter than the landing page.

The product serves Arabic-speaking students and university administrators across desktop and mobile. The interface is RTL throughout, with natural Arabic line height and locally available Arabic-capable font fallbacks. This is a product foundation, not a claim of university affiliation.

## Colors

The brand palette is normative: primary `#295255`, secondary `#577877`, light `#F0F5F7`, and dark `#162623`. Primary identifies key actions and the brand; secondary supports navigation and quiet emphasis; light is the application canvas; dark is text and the admin/student sidebar. Paper surfaces use `#FBFDFD`; muted text uses `#71817F`. Success, warning, and danger are semantic colors and never carry meaning alone.

## Typography

Use the system stack `Tahoma, Arial, Noto Sans Arabic, sans-serif` to keep the first render independent of remote font services. Arabic headings use compact, confident weights; body text retains line-height 1.7. Preserve legibility for mixed Arabic and Latin labels, codes, and numbers.

## Layout

Use a fluid content area with a 1440px maximum and responsive page padding. Student and admin shells place a 264px dark sidebar beside the light work area on wide screens; on narrow screens navigation becomes an accessible disclosure. Public pages have a quiet header and broad, asymmetric hero. Use logical CSS properties so direction remains correct in RTL.

## Elevation & Depth

Cards use a subtle two-part shadow and a translucent white surface. Reserve blur for large surfaces where content remains readable. Avoid stacked floating panels, heavy gradients, and decorative dashboard metrics without product data.

## Shapes

Cards use 22px radii; controls use 12px radii. The landing seal uses a clipped corner on its square brand mark and orbital rings as a single restrained signature. Prefer stable geometry and thin green-gray borders elsewhere.

## Components

Shared components live under `components/shared`; the palette and component rules map directly to `app/globals.css` custom properties and shared component classes. Do not add independent route-level copies of tokens. Buttons expose primary, outline, ghost, and danger emphasis; cards, fields, tables, modal dialogs, and state panels share the same radii, spacing, and focus treatment.

## Do's and Don'ts

- Keep all owned copy and accessible labels in Arabic.
- Use semantic links and buttons with visible keyboard focus.
- Keep the sidebar darker than the main area.
- Do not add calendar, notification center, community, Course Hub, standalone chatbot, 4.0 GPA, payment, or other excluded features.
- Do not present placeholder pages as implemented business workflows.
- Do not rely on remote font loading for core Arabic rendering.
