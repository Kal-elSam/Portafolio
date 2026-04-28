# apps/devSam

Main Next.js application for the Sam Gomez portfolio.

## Purpose

This app presents professional experience, selected case studies, product work, project archives, resume access, and contact entry points for the public portfolio at [portfolio-devsam.vercel.app](https://portfolio-devsam.vercel.app/).

## Stack

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `MDX`

## Local Development

From the repository root:

```bash
pnpm install
pnpm dev
```

For app-only commands:

```bash
pnpm --filter sam.dev dev
pnpm --filter sam.dev build
pnpm --filter sam.dev lint:types
```

## Notes

- Public resume asset: `/public/assets/docs/SamuelGomezDevResume.pdf`
- Project content and case-study data live under `src/contents`
- Homepage sections and hero content live under `src/contents/index`
