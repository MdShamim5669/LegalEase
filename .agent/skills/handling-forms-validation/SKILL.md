---
name: handling-forms-validation
description: Implements type-safe form management using react-hook-form and Zod v4 schemas, mapping backend errorSources to inline field errors. Use when creating input forms, authentication screens, or booking inputs.
---

# Handling Forms & Validation

Implement type-safe, user-friendly forms across LegalEase client applications using `react-hook-form` and `@hookform/resolvers/zod`.

## When to Use This Skill
- Creating authentication forms (login, registration, OTP verification, password reset).
- Building booking submission forms and payment options.
- Constructing profile update forms (lawyer profiles, chamber details, fees).
- Rendering inline validation errors mapped from backend validation responses.

## Core Rules
1. **Zod Schema Sync:** Client Zod validation schemas must match backend constraints (min length, email formats, positive fees).
2. **Inline Errors:** Place errors directly beneath the relevant input field.
3. **Server Error Mapping:** When the server returns `{ errorSources: [{ path, message }] }`, use `setError(path, { message })` to highlight fields.
4. **Submit Button Locking:** Disable the submit button and show a spinner/loading indicator during submission.

## Templates & Examples
For login and booking form implementations, consult:  
👉 **[`resources/form-templates.md`](resources/form-templates.md)**
