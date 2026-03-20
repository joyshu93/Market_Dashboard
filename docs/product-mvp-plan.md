# Market Dashboard MVP Plan

## Product Thesis

- 이 제품은 HTS가 아니라, 사용자가 매일 보는 시장을 한 화면에 조립하는 `market home screen`이다.
- 핵심 가치는 `30초 안에 오늘 시장 분위기를 읽히게 하는 것`이다.
- 카드의 본질은 자산별 특수 위젯이 아니라, `같은 주제를 다른 정보 밀도로 표현하는 범용 시장 카드`다.
- 한국 투자자 관점에서 국내 지수, 미국장, 환율, 금리, 원자재, 크립토를 함께 읽게 하는 것이 핵심 포지셔닝이다.

## Positioning Update

- MVP의 핵심 약속은 `실시간 시세 서비스`가 아니라 `내가 매일 여는 시장 브리핑 홈`이다.
- 실시간 데이터는 장기적으로 붙을 수 있는 고급 기능이지, 현재 MVP의 본질이 아니다.
- 제품은 `거래판`이 아니라 `시장 해석 홈화면`으로 이해되어야 한다.
- 자세한 방향 전환 배경과 검증 계획은 `docs/strategy-reset.md`를 기준으로 본다.

## Target Users

### Primary

- 장 시작 전후로 시장을 빠르게 훑는 개인투자자
- 한국장과 미국장을 함께 보는 사용자
- 환율, 금리, 유가 같은 거시지표까지 같이 보는 사용자

### Secondary

- 경제/투자 콘텐츠 소비자
- 블로그/커뮤니티 운영자
- 단기 매매보다 스윙/중기 관찰형 사용자

## Core Interaction Principles

- 대시보드 자체가 제품이어야 한다.
- 시장 자산은 모두 하나의 `market widget` 시스템 안에서 다뤄야 한다.
- 카드 크기는 정보 밀도만 바꾸고, 카드의 정체성은 바꾸지 않는다.
- 편집 모드에서는 이동, 리사이즈, 삭제가 자연스러워야 한다.
- 검색은 항상 보이면 안 되고, 사용 의도가 생겼을 때만 열려야 한다.
- 광고도 같은 카드 시스템 안에서 자연스럽게 섞일 수 있어야 한다.

## Canonical Market Card Rules

### Grid

- 데스크톱 메인 캔버스는 `16-column` 기준 타일 그리드로 본다.
- 전체 카드 시스템의 허용 크기는 아래 세 가지뿐이다.

### Sizes

- `small = 2 x 2`
- `wide = 4 x 2`
- `large = 4 x 4`
- `large`는 `small` 4개를 합친 면적이다.
- `wide`는 `large`를 가로로 절반 자른 크기다.

### Density by Size

- `small`: 자산명, 현재값, 등락 요약
- `wide`: 자산명, 현재값, 전일대비, 등락률, 스파크라인, 업데이트 시각, 짧은 상태 문구
- `large`: 자산명, 현재값, 전일대비, 등락률, 확장 차트, 보조 지표 2~4개, 요약 문구

### Supporting Cards

- `summary`, `news`, `ad` 카드는 별도 타입으로 유지한다.
- 다만 시장 카드와 같은 그리드 안에서 자연스럽게 혼합 배치되어야 하며, 크기 역시 `2x2 / 4x2 / 4x4` 세 규격 안에서만 사용한다.

## MVP Scope

- 반응형 대시보드
- 드래그 앤 드롭 배치
- 카드 리사이즈
- 편집 모드 토글
- 로컬 레이아웃 저장
- 범용 시장 카드 시스템
- summary/news/ad 카드
- mock data 렌더링
- dark theme
- context menu 기반 add-card 흐름을 확장할 수 있는 구조
- 모바일에서도 읽히는 카드 레이아웃

## Non-Goals

- 실거래/주문/브로커리지 연동
- 완성형 인증/계정 동기화
- 실시간 라이선스 데이터
- 고급 HTS 수준 분석 도구
- 백엔드 우선 구조

## Current Implementation Snapshot

### Implemented

- Next.js App Router 기반 대시보드 구조
- 범용 `market widget` 시스템
- `small / wide / large` 정보 밀도 분기
- `summary / news / ad` 카드
- drag/resize/edit mode
- `localStorage` 기반 레이아웃 저장
- hidden search modal
- desktop empty-space context menu 진입 구조
- dark-first visual system

### Recently Aligned

- 데스크톱 market card 기준을 `16-column` 그리드로 정리
- 카드 전체 시스템 크기를 `2x2 / 4x2 / 4x4`만 허용하도록 정규화
- 저장된 레이아웃도 같은 규칙으로 로드 시 정리되도록 반영

### Still Missing or Partial

- light mode
- 상단 날짜/업데이트 시각 강화
- 로그인/프로필 구조
- auto-refresh
- 상세 패널 또는 상세 화면 진입
- 모바일 편집 UX 단순화
- 실제 광고 카드 정책

## Live Data Decision

- 실시간 데이터는 `정확한 원자산 유지`를 우선 원칙으로 둔다.
- 그래서 일부 자산은 더 빠른 프록시 가격보다 공식/공공 소스를 우선 사용한다.
- 현재 구조는 `server aggregation -> normalized MarketSnapshot -> widget render` 흐름으로 붙인다.
- 공급자 실패 시 카드 시스템을 깨지 않고 해당 자산만 mock snapshot으로 fallback 한다.
- 다음 고도화 단계에서 필요한 경우에만 프록시 ETF 또는 상용 intraday provider 도입 여부를 별도 결정한다.

## Product Gaps vs Brief

- `light mode`는 brief에 있지만 아직 구현되지 않았다.
- “오늘 시장 한줄 요약”은 summary card로 방향은 맞지만, 상단에서 30초 판단을 돕는 핵심 서피스로 더 강화할 여지가 있다.
- add-card 흐름은 이미 존재하지만, header 버튼 중심에서 `empty-space context menu` 중심 UX로 더 다듬을 수 있다.
- mock data 기반 구조는 갖춰졌지만, `아침 / 장중 / 마감` 맥락을 보여주는 업데이트 레이어는 다음 단계다.
- 모바일은 읽기 중심으로는 usable하지만, 편집은 아직 desktop-first 감각이 남아 있다.

## Priority Backlog

### P1

- market card 스냅 규칙을 모든 breakpoint에서 시각적으로도 일관되게 보이도록 다듬기
- 저장 레이아웃 정규화가 실제 사용자 플로우에서 흔들리지 않는지 검증하기
- summary card를 `today market brief` 역할에 맞게 더 선명하게 다듬기

### P2

- dark/light theme 토글 및 persistence 추가
- 상단에 날짜/업데이트 시각 추가
- add-card UX를 context-menu 중심으로 다듬기

### P3

- mock auto-refresh
- 카드 클릭 시 detail drawer 또는 확장 패널
- 모바일 편집 UX 단순화
- 광고 카드 정책 정리

## Open Decisions

- light mode를 MVP 첫 공개 범위에 포함할지
- 카드 클릭 시 detail drawer로 갈지, 별도 상세 페이지로 갈지
- 모바일 편집 UX를 long-press 중심으로 갈지, plus-button 중심으로 갈지
- 광고 슬롯을 고정 배치로 둘지, 동적 삽입으로 둘지
- 실제 시장 데이터 연동 시점을 언제 가져갈지

## Next 5 Acceptance Criteria

- market 카드는 `2x2`, `4x2`, `4x4` 세 규격으로만 동작한다.
- 저장된 레이아웃을 다시 불러와도 같은 규격으로 유지된다.
- 검색 UI는 `empty-space right-click` 또는 add-card 진입 시에만 열린다.
- summary/news/ad 카드가 market 카드와 같은 그리드 안에서 자연스럽게 섞인다.
- 모바일에서도 카드 읽기와 기본 조작이 깨지지 않는다.

## Planning Workflow

- 이 문서를 현재 MVP의 기획 기준 문서로 사용한다.
- 새로운 기능 요청은 먼저 이 문서의 `Core Interaction Principles`와 `Canonical Market Card Rules`에 맞는지 검토한다.
- 구현 우선순위는 `Priority Backlog`와 `Acceptance Criteria`를 기준으로 갱신한다.

## Change Governance

- 개발 요청이 기존 기획을 더 구체화하거나 모호한 부분을 정리하는 수준이면, 코드와 기획 문서를 함께 바로 갱신한다.
- 개발 요청이 제품 방향, 핵심 UX 원칙, 카드 규격, 주요 우선순위를 바꾸는 수준이면, 기획 변경으로 간주하고 사용자 확인 후 반영한다.
- 문구 정리, 정보 구조 개선, 상태 문구 보정, 예시 보강처럼 제품 철학을 바꾸지 않는 수정은 별도 승인 없이 기획 문서에 반영한다.
