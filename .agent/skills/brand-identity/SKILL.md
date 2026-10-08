---
name: brand-identity
description: Provides the single source of truth for LegalEase brand guidelines, design tokens, technology choices, and voice/tone. Use when generating UI components, styling applications, writing copy, or creating user-facing assets to ensure brand consistency.
---

# LegalEase Brand Identity & Guidelines

**Brand Name:** LegalEase  
**Tagline:** Talk to a verified lawyer, from anywhere.  
**Platform Scope:** Online lawyer-consultation platform connecting verified Bangladeshi lawyers with clients for scheduled consultations (video, phone, chamber visit), document sharing, advice notes, and reviews.

This skill defines the core visual, architectural, and communicative constraints for LegalEase. Adhere to these guidelines strictly across both frontend and backend client interactions.

## Reference Documentation

Depending on the task you are performing, consult the specific resource files below:

### For Visual Design & UI Styling
For exact colors (including legal status colors), typography, border radii, spacing values, and token names:
👉 **[`resources/design-tokens.json`](resources/design-tokens.json)**

### For Coding & Component Implementation
For framework constraints (Next.js App Router, Tailwind CSS, shadcn/ui, Express 5, TypeScript strict, Prisma 7):
👉 **[`resources/tech-stack.md`](resources/tech-stack.md)**

### For Copywriting, Disclaimers & Content Generation
For voice, tone, bilingual (English/Bangla) rules, terminology guide, and mandatory legal disclaimers:
👉 **[`resources/voice-tone.md`](resources/voice-tone.md)**

## Core Workflows

### 1. Generating UI Components
1. Read [`resources/tech-stack.md`](resources/tech-stack.md) for allowed component patterns and libraries.
2. Read [`resources/design-tokens.json`](resources/design-tokens.json) to map styling to tokens (never hardcode arbitrary hex values).
3. Validate that buttons, status chips, and form layouts comply with LegalEase design constraints.

### 2. Authoring User-Facing Text or Error Messages
1. Read [`resources/voice-tone.md`](resources/voice-tone.md).
2. Ensure the mandatory legal disclaimer (`BR-20`) is displayed on booking and profile screens:
   > *"This is a preliminary consultation, not formal legal representation."*
3. Provide English interface copy with clean translation keys for Bangla localization.
