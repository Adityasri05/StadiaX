# StadiaX Operational Guidelines

## Build & Run Commands
* Build production static files: `npm run build`
* Start local development server: `npm run dev`
* Run ESLint code checks: `npm run lint`

## Test Execution
* Run unit & component test suite: `npm run test`

## Project Architecture & Standards
* **TypeScript Strictness**: Enforces absolute strict compiler parameters (`noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`).
* **Linter Compliance**: Maintain a **zero errors, zero warnings** standard on all code checks.
* **Security & CSP**: Strictly avoid inline cryptographic secrets. Content-Security-Policy must exclude `'unsafe-eval'`.
* **Aria Accessibility**: Keep interactive links annotated with `aria-label` and decorative components hidden from screen readers via `aria-hidden="true"`.
