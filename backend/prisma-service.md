# PrismaService Implementation

The generated backend must provide a NestJS injectable service that wraps PrismaClient. This document defines the **only** supported implementation for Prisma 5+.

---

# Correct Implementation

```typescript
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Why this pattern

- **OnModuleInit:** NestJS lifecycle hook; `onModuleInit()` runs when the module is initialized, ensuring the database connection is established before handling requests.
- **$connect():** Explicitly connects the Prisma client. Required for reliable connection handling in serverless or long-running apps.

---

# Deprecated: Do NOT Use

The following pattern is **deprecated** in Prisma 5 and must **not** be generated:

```typescript
// WRONG — do not generate
this.$on("beforeExit", async () => {
  await this.$disconnect();
});
```

- `beforeExit` is not supported in Prisma 5.
- Using it will cause runtime errors or warnings.

## Rule for generators

Generated `PrismaService` (or equivalent) must:

1. Extend `PrismaClient`.
2. Implement `OnModuleInit`.
3. Call `await this.$connect()` in `onModuleInit()`.
4. **Not** use `this.$on('beforeExit', ...)` or any `beforeExit` hook.

---

# Module Registration

Register the service in a dedicated Prisma module (or in `AppModule`) so it can be injected into other services:

```typescript
// prisma.module.ts (or app.module.ts)
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Using `@Global()` allows injecting `PrismaService` in any module without re-importing.

---

# File location

Generated file:

- `src/prisma.prisma.service.ts` or `src/prisma.service.ts`

Class name: `PrismaService`.
