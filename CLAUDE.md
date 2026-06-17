# NEET AI Mentor Project Guidelines

## Build & Run
- \`pnpm dev\`: Start local development server
- \`pnpm build\`: Production build
- \`pnpm start\`: Start production server
- \`npx tsx scripts/seed_syllabus.ts\`: Seed database

## Tech Stack
- Next.js App Router
- PostgreSQL + Prisma
- Google Gemini API (gemini-flash-latest)
- Tailwind CSS

## Architecture
- Layered services in \`src/lib/services\`
- API routes in \`src/app/api\`
- Shared types and utils in \`src/lib\`

## Coding Standards
- Use functional components with React
- Use Tailwind for styling
- Ensure API routes follow Next.js conventions (e.g., Suspense for client-side search params)
