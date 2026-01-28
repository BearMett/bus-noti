# BusNoti 미니멀 클린 테마 디자인

> 브루탈리스트 다크 테마에서 미니멀 클린 라이트 테마로 전환

## 개요

### 변경 목적
- 브루탈리스트 미학(CRT, LED, 경고 줄무늬)에서 벗어나 현대적인 미니멀 디자인으로 전환
- 사용자 선호에 맞는 테마 커스터마이징 지원
- 라이트/다크 모드 모두 지원

### 핵심 결정사항
- **테마 시스템**: 5종 프리셋 테마 선택
- **다크 모드**: 라이트/다크 모두 지원 (시스템 설정 + 수동 전환)
- **기존 효과**: 스캔라인, 노이즈, LED 글로우 등 전부 제거
- **컴포넌트 스타일**: 플랫 + 미세 그림자 (토스/카카오T 스타일)
- **상태 색상**: 신호등 체계 유지 (빨강/노랑/초록)

---

## 색상 시스템

### 프리셋 테마 (5종)

| 테마명 | Primary | 설명 |
|--------|---------|------|
| **Sky** (기본) | `#0EA5E9` | 밝고 경쾌한 스카이 블루 |
| **Royal** | `#2563EB` | 신뢰감 있는 로얄 블루 |
| **Teal** | `#0891B2` | 모던한 청록색 |
| **Emerald** | `#10B981` | 친환경 그린 |
| **Violet** | `#8B5CF6` | 독특한 바이올렛 |

### 라이트 모드 기본 색상

```css
--background: #FFFFFF;
--surface: #F8FAFC;
--surface-elevated: #FFFFFF;
--border: #E2E8F0;
--border-accent: var(--primary);

--text-primary: #0F172A;
--text-secondary: #64748B;
--text-muted: #94A3B8;
```

### 다크 모드 기본 색상

```css
--background: #0F172A;
--surface: #1E293B;
--surface-elevated: #334155;
--border: #334155;
--border-accent: var(--primary);

--text-primary: #F8FAFC;
--text-secondary: #94A3B8;
--text-muted: #64748B;
```

### 상태 색상

#### 라이트 모드
```css
--status-arriving-bg: #FEE2E2;
--status-arriving-text: #DC2626;

--status-soon-bg: #FEF3C7;
--status-soon-text: #D97706;

--status-normal-bg: #DCFCE7;
--status-normal-text: #16A34A;
```

#### 다크 모드
```css
--status-arriving-bg: #7F1D1D;
--status-arriving-text: #FCA5A5;

--status-soon-bg: #78350F;
--status-soon-text: #FCD34D;

--status-normal-bg: #14532D;
--status-normal-text: #86EFAC;
```

---

## 컴포넌트 스타일

### 카드

```css
/* 라이트 모드 */
.card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 다크 모드 */
.card {
  background: #1E293B;
  border: 1px solid #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
```

### 버튼

| 종류 | 라이트 모드 | 다크 모드 |
|------|-------------|-----------|
| **Primary** | 배경: Primary색, 텍스트: 흰색 | 동일 |
| **Secondary** | 배경: #F1F5F9, 텍스트: #334155 | 배경: #334155, 텍스트: #F8FAFC |
| **Ghost** | 배경: 투명, 텍스트: Primary색 | 동일 |
| **Danger** | 배경: #EF4444, 텍스트: 흰색 | 동일 |

### 입력 필드

```css
/* 라이트 모드 */
input {
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
}
input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

/* 다크 모드 */
input {
  background: #1E293B;
  border: 1px solid #475569;
}
```

### 배지 (상태 표시)

- 도착 임박 (≤3분): 빨강 계열
- 곧 도착 (4-7분): 노랑/주황 계열
- 여유 (8분+): 초록 계열

---

## 타이포그래피

### 폰트

| 용도 | 현재 | 변경 |
|------|------|------|
| 헤딩/본문 | Oswald | Pretendard (한글) + Inter (영문) |
| 숫자/시간 | JetBrains Mono | 유지 |

### 텍스트 스타일

| 항목 | 현재 | 변경 |
|------|------|------|
| 대소문자 | UPPERCASE | Sentence case |
| 자간 | 넓음 (0.1em+) | 기본 |
| 레이블 | 경고/터미널 스타일 | 일반 텍스트 |

---

## 레이아웃

### 제거할 요소
- 스캔라인 오버레이 (`.scanline-overlay`)
- 노이즈 텍스처 (`.noise-bg`)
- 그리드 패턴 배경 (`.grid-pattern`)
- 경고 줄무늬 (`.warning-stripes`)
- LED 글로우 효과 (`.led-glow`)
- 깜빡임 애니메이션 (`.animate-blink`, `.animate-flicker`)

### 유지할 요소
- 슬라이드 업 애니메이션 (카드 등장)
- 부드러운 트랜지션 효과

---

## 테마 설정 UI

### 헤더 레이아웃

```
┌─────────────────────────────────────────────────┐
│  🚌 BusNoti          [테마] [🌙/☀️] [로그아웃]  │
└─────────────────────────────────────────────────┘
```

### 테마 선택 팝오버

```
┌─────────────────────────┐
│  테마 선택              │
├─────────────────────────┤
│  ● Sky      ○ Royal    │
│  ○ Teal     ○ Emerald  │
│  ○ Violet               │
├─────────────────────────┤
│  다크 모드              │
│  ○ 시스템 설정 따르기   │
│  ○ 라이트              │
│  ○ 다크                │
└─────────────────────────┘
```

### 저장 방식
- `localStorage`에 `theme` (프리셋명) 및 `colorMode` (system/light/dark) 저장
- 페이지 로드 시 저장된 설정 적용
- 시스템 설정: `prefers-color-scheme` 미디어 쿼리 활용

---

## 구현 계획

### 변경 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `globals.css` | 색상 변수 전면 교체, 브루탈리스트 효과 제거 |
| `layout.tsx` | 폰트 변경, ThemeProvider 추가 |
| `Button.tsx` | 새 스타일 적용 |
| `Input.tsx` | 새 스타일 적용 |
| `Card.tsx` | 그림자/둥근모서리, scanline/noise 옵션 제거 |
| `Badge.tsx` | 상태 색상 라이트/다크 대응 |
| `Logo.tsx` | 심플한 디자인으로 변경 |
| `Divider.tsx` | warning stripe 제거, 단순 선으로 |
| `LEDDisplay.tsx` | 제거 또는 단순 텍스트로 대체 |
| `login/page.tsx` | 브루탈리스트 요소 제거 |
| `register/page.tsx` | 동일 |
| `page.tsx` | 그리드 패턴 제거, 클린 UI |
| `DashboardHeader.tsx` | 테마 토글 추가 |

### 신규 파일

| 파일 | 설명 |
|------|------|
| `ThemeProvider.tsx` | 테마 상태 관리 Context |
| `ThemeSelector.tsx` | 테마 선택 UI 컴포넌트 |
| `useTheme.ts` | 테마 훅 |

### 삭제 대상
- `LEDDisplay.tsx` 내 `LEDCountdown` 컴포넌트 (또는 단순화)
- 브루탈리스트 관련 CSS 클래스 전체

---

## 참고

- 색상 팔레트 기반: Tailwind CSS 색상 시스템
- 디자인 참고: 토스, 카카오T, 네이버지도
