## Language
- Always respond in Korean by default.
- Use English only when the user explicitly requests it.

## Deployment Stack
- This codebase is managed with Git.
- Web deployment is handled by Vercel.
- Authentication is handled by Clerk.
- The database is Convex Cloud production only.

## Deployment URL
- Production web app: https://slack.ubot.site/

## Deployment Flow
- When asked to deploy, first verify the web app builds successfully.
- After a successful build, push the Git branch. Vercel deploys automatically through the configured webhook.
- Do not look for or run a separate manual web deploy command unless the user explicitly asks for one.

## Database Policy
- Do not add or use a local database.
- Local development connects to the same Convex production database as the deployed app.
- Localhost should therefore show the same production-backed data environment, assuming the same environment variables are configured.
