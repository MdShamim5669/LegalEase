---
description: Accessibility and usability rules for LegalEase frontend
globs: ["src/**/*.{ts,tsx}"]
---

# Accessibility Guidelines (WCAG 2.1 AA)

- Keyboard navigation: All interactive slot items, cards, and modal dialogs must be fully keyboard operable (`Tab`, `Enter`, `Escape`).
- Screen readers: Use `aria-live` regions for toast messages and countdown updates.
- Status indications: Never rely on color alone to communicate status; always provide text or icons alongside color badges.
- Form inputs: Ensure `<label>` is explicitly associated with inputs via `htmlFor` / `id`.
