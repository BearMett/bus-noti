# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a pnpm workspace monorepo with Turborepo:

```
busnoti/
├── pnpm-workspace.yaml
├── package.json                    # Root workspace
├── turbo.json                      # Turborepo config
├── prisma/
│   └── schema.prisma               # Prisma schema (root)
└── packages/
    ├── api/                        # NestJS backend
    ├── shared/                     # Shared types/DTOs
    └── web/                        # Next.js frontend
```

## Commands

```bash
# Development (all packages)
pnpm dev                    # Run all dev servers (turbo)
pnpm dev:api                # API dev server only
pnpm dev:web                # Web dev server only

# Build
pnpm build                  # Build all packages (turbo)
pnpm --filter @busnoti/api build
pnpm --filter @busnoti/web build

# Testing
pnpm test                   # Run all tests (turbo)
pnpm --filter @busnoti/api test
pnpm --filter @busnoti/api test:watch
pnpm --filter @busnoti/api test:e2e

# Lint & Format
pnpm --filter @busnoti/api lint

# Database
pnpm db:generate            # Regenerate Prisma client
pnpm db:push                # Push schema to SQLite
```

## Architecture

버스 도착 알림 서비스 - 30초마다 구독된 노선의 도착정보를 확인하여 알림 발송

### Core Flow
```
Scheduler (30s) → BusProvider (외부 API) → NotificationsService → AlertChannel (Push/Email)
```

### Packages

**@busnoti/shared** - Shared types and DTOs
- `src/types/bus.ts` - BusProvider, StationDto, RouteDto, ArrivalInfoDto
- `src/types/notification.ts` - AlertChannel, AlertMessage, NotificationTarget
- `src/types/prisma.ts` - Re-exported Prisma types (Region, etc.)
- `src/dto/` - Shared DTOs (subscription, stop)

**@busnoti/api** - NestJS backend
- `src/providers/` - Bus API providers (Gyeonggi, Seoul)
- `src/modules/` - NestJS feature modules
- `src/prisma/` - Prisma service and module
- `src/config/` - Configuration

**@busnoti/web** - Next.js frontend

### Key Interfaces

**BusProvider** (`packages/shared/src/types/bus.ts`) - 지역별 버스 API 추상화
- `searchStations(keyword)` - 정류소 검색
- `getArrivalInfo(stationId)` - 도착정보 조회

**AlertChannel** (`packages/shared/src/types/notification.ts`) - 알림 채널 추상화
- `send(target, message)` - 알림 발송
- `isAvailable(target)` - 채널 사용 가능 여부

### Idempotency
차량번호(plateNo) + 예측도착시간으로 중복 알림 방지

## Code Style Rules

### Shared Package Imports
Import shared types from `@busnoti/shared`:

```typescript
import {
  BusProvider,
  StationDto,
  CreateSubscriptionDto,
  Region,
} from '@busnoti/shared';
```

### No Barrel Exports
Do NOT use barrel exports (index.ts re-exports) within packages. Always import directly from the source file.

```typescript
// Bad - barrel export
import { StopsModule } from './modules/stops';

// Good - direct import
import { StopsModule } from './modules/stops/stops.module';
```

### Prisma Types
Import Prisma types from `@busnoti/shared` or directly from `@prisma/client`:

```typescript
// From shared (preferred)
import { Region, Subscription } from '@busnoti/shared';

// Or directly
import { Region, Subscription } from '@prisma/client';
```

## API Keys Required

1. **경기도 GBIS API**: https://www.data.go.kr/data/15080666/openapi.do
2. **서울 버스 API**: https://www.data.go.kr/data/15000303/openapi.do
