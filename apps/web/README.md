# Monorepo Slack Web

Next.js app for the Slack-style channel chat UI. Data is backed by Convex Cloud
only; there is no local database or mock runtime fallback.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-issuer.clerk.accounts.dev
```

`NEXT_PUBLIC_CONVEX_URL` must point to a Convex Cloud deployment, not localhost
or a self-hosted Convex URL.

## Development

From the repository root:

```bash
pnpm --filter web dev
```

Open [http://localhost:4200](http://localhost:4200).

## Convex

Push Convex functions and seed the Cloud deployment:

```bash
pnpm --filter web convex:dev
pnpm --filter web convex:seed
```

Use `convex:deploy` for deployment flows.

## Verification

```bash
pnpm --filter web typecheck
pnpm --filter web lint
pnpm --filter web build
```
