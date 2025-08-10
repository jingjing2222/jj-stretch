# JJ Stretch - VSCode 확장 프로그램 개발 계획

## 🎯 프로젝트 개요
개발자의 건강한 코딩 습관을 강제하는 VSCode 확장 프로그램. 60분 타이머가 돌아가며, 시간이 만료되면 스트레칭 영상을 강제로 시청하게 함.

## 🏗️ 아키텍처 설계

### 핵심 컴포넌트
1. **타이머 관리자** (`src/timer.ts`)
   - 설정 가능한 간격의 카운트다운 타이머
   - 상태 지속성 관리
   - 백그라운드 실행

2. **오버레이 관리자** (`src/overlay.ts`)
   - 유튜브 영상용 전체화면 웹뷰
   - 사용자 친화적 영상 재생 (닫기 가능)
   - 영상 완료 시 자동 닫기

3. **UI 컨트롤러** (`src/ui.ts`)
   - 상태바 통합
   - 명령 팔레트 명령어
   - 사용자 알림

4. **타입 정의** (`src/types.ts`)
   - TypeScript 인터페이스 정의
   - 타입 안전성 보장

### 파일 구조
```
jj-stretch/
├── src/
│   ├── extension.ts      # 메인 진입점
│   ├── timer.ts          # 타이머 로직
│   ├── overlay.ts        # 영상 오버레이
│   ├── ui.ts             # UI 컴포넌트
│   └── types.ts          # 타입 정의
├── media/                # 정적 자산
└── package.json          # 확장 매니페스트
```

## 🚀 기능 로드맵

### 1단계: 핵심 기능 ✅ 완료
- [x] 프로젝트 스캐폴딩
- [x] 설정 가능한 타이머 (분 단위, 기본값: 60분)
- [x] 상태바 타이머 표시
- [x] 기본 명령어 (시작/정지/리셋)
- [x] 유튜브 영상 오버레이

### 2단계: UX 개선
- [ ] VSCode 재시작 시 타이머 상태 유지
- [x] 커스텀 영상 URL 설정
- [ ] 일시정지/재시작 기능

### 3단계: 고급 기능
- [ ] 다중 타이머 프로필
- [ ] 스트레칭 루틴 커스터마이징
- [ ] 사용량 분석
- [ ] 팀/워크스페이스 공유

## 📋 설정 스키마

```json
{
  "jj-stretch.timerIntervalMinutes": {
    "type": "number",
    "default": 60,
    "minimum": 1,
    "maximum": 480,
    "description": "타이머 간격 (분 단위)"
  },
  "jj-stretch.stretchVideoUrl": {
    "type": "string",
    "default": "https://www.youtube.com/embed/RqcOCBb4arc?autoplay=1&controls=0",
    "description": "유튜브 스트레칭 영상 URL (embed 형식)"
  },
  "jj-stretch.autoStart": {
    "type": "boolean",
    "default": true,
    "description": "VSCode 열 때 자동으로 타이머 시작"
  }
}
```

## 🎮 명령어
- `jj-stretch.startTimer`: 스트레치 타이머 시작
- `jj-stretch.stopTimer`: 타이머 정지/일시정지
- `jj-stretch.resetTimer`: 설정된 간격으로 타이머 리셋
- `jj-stretch.openSettings`: 확장 설정 열기

## 🔄 타이머 플로우
1. **시작**: 설정된 분에서 카운트다운 시작
2. **표시**: 상태바에 남은 시간 표시 (MM:SS)
3. **만료**: 스트레칭 영상으로 전체화면 오버레이
4. **완료**: 오버레이 자동 닫기, 타이머 리셋
5. **반복**: 자동으로 사이클 계속

## 🎥 영상 오버레이 사양
- 전체화면 웹뷰 패널
- 자동재생되는 유튜브 embed
- 일반 컨트롤 제공 (사용자 친화적)
- 사용자가 언제든 닫기 가능
- 영상 종료 자동 감지 및 닫기
- YouTube API를 통한 영상 상태 추적

## 🧪 테스트 전략
- 타이머 로직 단위 테스트
- VSCode API 통합 테스트
- UX 플로우 수동 테스트
- 장시간 실행 타이머 성능 테스트

## 📦 배포
- VSCode 마켓플레이스 출시
- 자동화된 CI/CD 파이프라인
- 버전 관리 및 변경 로그