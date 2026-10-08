---
name: building-ui-components
description: Builds accessible, responsive React components using Next.js App Router, Tailwind CSS, and shadcn/ui primitives. Use when creating UI elements, pages, layouts, or styling interfaces for LegalEase.
---

# Building UI Components

Construct high-quality, accessible, and responsive user interface components for the LegalEase Next.js web application following brand guidelines and PRD requirements.

## When to Use This Skill
- Creating new components in `src/components/ui/` or `src/components/common/`.
- Building page layouts under `src/app/`.
- Adding interactive states, skeletons, or dialogs.
- Ensuring compliance with WCAG 2.1 AA accessibility guidelines.

## Workflow & Checklists

```markdown
### UI Component Checklist
- [ ] 1. Primitives: Base new components on shadcn/ui or Radix UI primitives.
- [ ] 2. Design Tokens: Apply colors, typography, and border radii from design-tokens.json.
- [ ] 3. Responsive Layout: Design mobile-first (e.g. slot pickers become bottom sheets <768px).
- [ ] 4. Loading States: Provide skeleton loaders (never solitary spinners).
- [ ] 5. Accessibility: Keyboard navigable, aria-live for toasts/status updates, color not the sole status indicator.
- [ ] 6. Mandatory Disclaimer: Render BR-20 disclaimer on booking and profile pages.
```

## Component Reference & Templates
For button styles, status badge variants, cards, and modal dialogs, consult:  
👉 **[`resources/component-patterns.md`](resources/component-patterns.md)**

## Core Rules
- **No Plain CSS:** Use Tailwind utility classes directly in JSX.
- **Button Conventions:** Primary actions use solid navy (`bg-primary`); secondary actions use 'ghost' or 'outline'. Destructive actions require confirmation dialogs with consequence explanation.
- **Labels:** Always position `<label>` elements *above* input fields.
