# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug with --inspect

# Build & Production
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled (node dist/main)

# Testing
npm test                   # Unit tests
npm run test:watch         # Watch mode
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage
npx jest path/to/file.spec.ts  # Single test

# Lint & Format
npm run lint               # ESLint with auto-fix
npm run format             # Prettier

# Database
npx prisma generate        # Regenerate client after schema change
npx prisma db push         # Push schema to SQLite
```

## Architecture

버스 도착 알림 서비스 - 30초마다 구독된 노선의 도착정보를 확인하여 알림 발송

### Core Flow
```
Scheduler (30s) → BusProvider (외부 API) → NotificationsService → AlertChannel (Push/Email)
```

### Key Interfaces

**BusProvider** (`src/providers/bus-provider.interface.ts`) - 지역별 버스 API 추상화
- `searchStations(keyword)` - 정류소 검색
- `getArrivalInfo(stationId)` - 도착정보 조회

**AlertChannel** (`src/modules/notifications/channels/alert-channel.interface.ts`) - 알림 채널 추상화
- `send(target, message)` - 알림 발송
- `isAvailable(target)` - 채널 사용 가능 여부

### Idempotency
차량번호(plateNo) + 예측도착시간으로 중복 알림 방지

## Code Style Rules

### No Barrel Exports
Do NOT use barrel exports (index.ts re-exports). Always import directly from the source file.

```typescript
// Bad - barrel export
import { StopsModule } from './modules/stops';

// Good - direct import
import { StopsModule } from './modules/stops/stops.module';
```

### Prisma Types
Import Prisma types directly from `@prisma/client`:

```typescript
// Good
import { Region, Subscription } from '@prisma/client';
```

## Project Structure

- `src/prisma/` - Prisma service and module
- `src/providers/` - External API providers (Gyeonggi, Seoul)
- `src/modules/` - NestJS feature modules
- `src/config/` - Configuration

## API Keys Required

1. **경기도 GBIS API**: https://www.data.go.kr/data/15080666/openapi.do
2. **서울 버스 API**: https://www.data.go.kr/data/15000303/openapi.do
