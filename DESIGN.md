# UniMeta Design System

## Direction

UniMeta uses a clear academic interface for Arabic-speaking university students. Keep layouts calm and readable, with the existing blue identity carrying navigation and emphasis. Preserve RTL reading order and keep important page content visible without waiting for animation.

## Color tokens

The runtime owner is `app/globals.css` (`@theme` and `:root`). Tailwind utility classes use the `brand-*` names below.

| Token | Value | Use |
| --- | --- | --- |
| `brand-primary` | `#0057C8` | Primary actions, links, selected controls |
| `brand-primary-hover` | `#0045A5` | Primary hover and pressed emphasis |
| `brand-secondary` | `#4DB7F2` | Secondary accents and focus rings |
| `brand-light` | `#F0F6FA` | Page background |
| `brand-dark` | `#0B192C` | Main text and dark surfaces |
| `brand-ink` | `#16324A` | Headings and form labels |
| `brand-muted` | `#66788A` | Supporting text and icons |
| `brand-subtle` | `#8297A8` | Low emphasis supporting details |
| `brand-border-soft` | `#D7EAF7` | Dividers and control borders |
| `brand-surface-muted` | `#F8FBFE` | Quiet card and field surfaces |
| `brand-surface-blue` | `#EAF4FD` | Selected and lightly emphasized surfaces |
| `brand-surface-soft` | `#F0F7FD` | Secondary tinted surfaces |
| `brand-hover-medium` | `#2D78B7` | Secondary hover state |

Use semantic red, amber, and green only for destructive/error, warning/pending, and success states. Do not use them as general decoration or category accents.

## Type and layout

- Arabic body text uses the self-hosted Noto Sans Arabic variable font through `--font-arabic` with system fallbacks.
- Keep the document `lang="ar"` and `dir="rtl"`; use logical spacing and positioning utilities.
- Form fields align in a responsive grid, use consistent control heights, and keep labels associated with their inputs.

## Motion and loading

- Essential page content is server-rendered and visible before motion begins.
- Keep motion subtle, limited to the relevant interaction or section, and respect `prefers-reduced-motion`.
- Reserve image dimensions and lazy-load below-the-fold imagery; prioritize only the page's actual first-screen image.
