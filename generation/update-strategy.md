# Update Strategy

When DSL changes:

1. Regenerate prisma.schema
2. Run prisma migrate dev
3. Regenerate Nest modules
4. Regenerate React Admin resources