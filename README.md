# EBP-Landing-page

Landing page for English Boarding Pass: Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and `next-intl` (English, Sinhala, Tamil).

## Getting started

Requires Node.js 20.9+ (see `.nvmrc`).

```sh
npm install      # also turns on the git hooks
npm run dev      # http://localhost:3000
```

| Script               | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Start the dev server                                     |
| `npm run build`      | Production build                                         |
| `npm run lint`       | ESLint                                                   |
| `npm run typecheck`  | TypeScript check (`tsc --noEmit`)                        |
| `npm run format`     | Format everything with Prettier                          |
| `npm run check:i18n` | Check `en.json`, `si.json` and `ta.json` share every key |

## Git hooks & CI

### Local git hooks

The hooks live in `.githooks/` and are turned on automatically by `npm install`. If they don't run, turn them on manually once per clone:

```sh
git config core.hooksPath .githooks
```

| Hook         | When         | What it does                                                                          |
| ------------ | ------------ | ------------------------------------------------------------------------------------- |
| `pre-commit` | `git commit` | ESLint + Prettier on staged files, plus the locale key check when `messages/` changes |
| `pre-push`   | `git push`   | `npm run lint` and `npm run typecheck`; the push is blocked if either fails           |

The hooks work in the terminal, VS Code and GitHub Desktop (Node.js must be installed). In an emergency, skip them with `--no-verify`; CI still runs on the PR.

No API key is needed locally, and commit messages are free text.

### Branches and merging

- Branch from `develop`, open PRs into `develop`, and release by opening a PR from `develop` into `main`.
- PRs are **squash merged**, so the **PR title becomes the commit message** on `develop` and `main`.
- PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`

  Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

  ```text
  feat(hero): add sinhala signup button
  fix(nav): correct tamil menu link
  docs: update readme
  ```

### GitHub Actions

| Workflow                                                  | Runs on                                 | What it does                                                                                                      |
| --------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [PR Check](.github/workflows/pr-check.yml)                | PRs and pushes to `develop` / `main`    | Lint, Prettier check, type check, locale key check, build, then Lighthouse on `/en`, `/si`, `/ta`, `/en/check-in` |
| [PR title & summary](.github/workflows/pr-ai-summary.yml) | PR opened / reopened / edited / updated | On open, Gemini writes a summary and sets a Conventional Commit title. On every update, checks the title format   |
| [Dependabot](.github/dependabot.yml)                      | Monthly                                 | One grouped PR each for npm and GitHub Actions minor/patch updates; major versions are ignored                    |

Lighthouse thresholds live in [lighthouserc.json](lighthouserc.json): accessibility and SEO must be at least 0.9 (failure), and performance and best practices at least 0.9 (warning only). Each run's report link is printed in the job log.

### One-time repository setup (maintainers)

1. **Gemini API key.** Create a key at <https://aistudio.google.com/apikey>, then add it under **Settings → Secrets and variables → Actions → New repository secret** with the name `GEMINI_API_KEY`. Only this repository secret is needed; contributors don't need their own key. Without it, the AI summary is replaced by a short note and everything else still works.
2. **Squash merge.** In **Settings → General → Pull Requests**, allow only **Squash merging** and set the default message to **Pull request title and description**.
3. **Branch protection.** In **Settings → Rules → Rulesets** (or **Branches**), protect `develop` and `main`: require a pull request, and require these status checks to pass:
   - `Lint, type check & build`
   - `Lighthouse`
   - `PR title format`
4. **Preview deploys.** Connect the repository to [Vercel](https://vercel.com/new) so every PR gets a preview URL. Vercel supports the `next-intl` middleware (`proxy.ts`) with no extra setup. Netlify and Cloudflare Pages also work, but need their Next.js adapters.
