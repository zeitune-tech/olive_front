# Repository Guidelines

## Project Structure & Module Organization
- `src/app/modules`: Feature modules (e.g., `pricing`, `attestations`, `settings`, `dashboard`).
- `src/app/shared`: Reusable components, pipes, and enums.
- `src/app/core`: Singletons (auth, config, services, navigation, permissions, i18n).
- `src/assets` and `public`: Static assets bundled at build time.
- `src/environments`: Environment configs (`environment.*.ts`) used by Angular file replacements.
- Styles live under `src/@lhacksrt/styles` and `src/styles` (SCSS + Tailwind).

## Build, Test, and Development Commands
- `npm start` or `npm run local`: Serve with `local` env (file replace to `environment.local.ts`).
- `npm run dev`: Serve with `development` env (`environment.dev.ts`).
- `npm run dev-local`: Serve with `development-local` env.
- `npm run build`: Production-ready build with Angular CLI output to `dist/olive_front`.
- `npm test`: Run unit tests with Karma + Jasmine.
- `npm run watch`: Rebuild on file changes (development config).

## Coding Style & Naming Conventions
- Language: TypeScript (Angular 18), SCSS, Tailwind CSS.
- Indentation: 2 spaces; follow Angular style guide.
- File names: kebab-case (e.g., `user-profile.component.ts`).
- Class names: PascalCase; selectors use `app-` prefix (project prefix).
- Components/Services: generate with Angular CLI (`ng g c`, `ng g s`) to keep structure consistent.

## Testing Guidelines
- Frameworks: Jasmine + Karma; specs colocated as `*.spec.ts` (see `app.component.spec.ts`).
- Run tests locally: `npm test`.
- Aim for meaningful coverage in feature modules and shared utilities; include edge cases and inputs/outputs.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat: ...`, `fix: ...`, `chore: ...`). This pattern is already used in history.
- PRs: Include a concise description, linked issue, and screenshots/GIFs for UI changes. Note affected routes/modules and any breaking changes.
- Checks: Ensure `npm test` passes and app starts in your target config (`local`/`development`).

## Security & Configuration Tips
- Do not hardcode secrets. Use `src/environments` files; configs are swapped via `angular.json` `fileReplacements`.
- External URLs live in environment files (e.g., `auth_url`, `pricing_url`). Update per environment variant rather than inline in code.
