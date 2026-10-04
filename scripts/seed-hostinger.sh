#!/usr/bin/env bash
# Run on Hostinger SSH from repo root (e.g. hbuilds/last-source).
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: Set DATABASE_URL first, e.g.:"
  echo "  export DATABASE_URL='mysql://USER:PASS@localhost:3306/DB'"
  exit 1
fi

export PRISMA_CLIENT_ENGINE_TYPE=binary

echo "Generating Prisma Client (binary engine)…"
npx prisma generate

echo "Syncing schema…"
npm run db:push

echo "Creating admin user…"
node prisma/seed-admin.mjs

echo "Seeding demo content (may take 1–2 minutes)…"
node --import tsx prisma/seed.ts

echo "Done."
