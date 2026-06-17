# NEET AI Mentor Platform

A full-stack, AI-native educational platform for Indian medical aspirants (NEET).

## Architecture
Built on a 7-layer architecture:
1. **Student Profile Store**: Identity & School Timetable
2. **Master Template Engine**: Macro Phase & Pacing Logic
3. **Dynamic Plan Generator**: Personalized Day-by-Day Planning
4. **Daily Plan Atom**: Atomic JSON Unit of Study
5. **Event Reactor**: Real-time mutation based on performance/events
6. **AI Mentor Interface**: Claude/Gemini powered conversational intelligence
7. **Persistence & Audit**: Versioned history of all plan changes

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: Google Gemini Flash
- **Styling**: Tailwind CSS

## Deployment
Deployed on Render.
- Build Command: \`pnpm install && pnpm build\`
- Start Command: \`pnpm start\`

## Scripts
- \`pnpm postinstall\`: Generates Prisma client
- \`scripts/seed_syllabus.ts\`: Seeds representative NEET syllabus
