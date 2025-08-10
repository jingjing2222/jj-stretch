# JJ Stretch - 클로저 리팩터링 계획

## 🎯 목표
클래스 기반 구조를 함수형 클로저 패턴으로 변경하여 코드를 단순화하고 가독성을 향상시킨다.

## 📋 현재 분석

### 기존 클래스들
1. **StretchTimer** (`timer.ts`) - 타이머 로직 + 상태 관리
2. **StatusBarUI** (`ui.ts`) - 상태바 UI 관리
3. **VideoOverlay** (`overlay.ts`) - 웹뷰 오버레이 관리

### 클래스 사용 패턴 분석
- **StretchTimer**: 상태를 가지고 있고, 콜백 등록 필요 → 클로저로 변경 가능
- **StatusBarUI**: VSCode 리소스 관리 필요 → 클로저로 변경 가능하지만 dispose 패턴 유지 필요
- **VideoOverlay**: 패널 상태 관리 + 콜백 → 클로저로 변경 가능

## 🚀 리팩터링 계획

### 1단계: VideoOverlay 클로저화 (우선순위 높음)
**이유**: 가장 단순한 구조, 상태가 적음

**변경 사항**:
```typescript
// 기존 클래스
export class VideoOverlay {
  private panel: vscode.WebviewPanel | undefined;
  showStretchVideo(videoUrl: string, onClose?: () => void): void
  close(): void
}

// 클로저로 변경
export function createVideoOverlay() {
  let panel: vscode.WebviewPanel | undefined;
  let onCloseCallback: (() => void) | undefined;
  
  return {
    showStretchVideo(videoUrl: string, onClose?: () => void): void,
    close(): void
  };
}
```

**영향받는 파일**:
- `src/overlay.ts` - 메인 로직 수정
- `src/extension.ts` - 생성 및 사용 방식 변경

### 2단계: StretchTimer 클로저화 (중간 우선순위)
**이유**: 복잡한 상태 관리, 콜백 패턴

**변경 사항**:
```typescript
// 클로저로 변경
export function createStretchTimer() {
  let state: TimerState = 'stopped';
  let intervalId: NodeJS.Timeout | null = null;
  let startTime: number = 0;
  let targetDurationMs: number = 0;
  let onExpiredCallback?: () => void;
  let onTickCallback?: (remainingMs: number) => void;
  
  return {
    start(): void,
    stop(): void,
    reset(): void,
    getRemainingTime(): number,
    getState(): TimerState,
    onExpired(callback: () => void): void,
    onTick(callback: (remainingMs: number) => void): void,
    formatTime(ms: number): string
  };
}
```

**영향받는 파일**:
- `src/timer.ts` - 메인 로직 수정
- `src/extension.ts` - 생성 및 사용 방식 변경

### 3단계: StatusBarUI 클로저화 (낮은 우선순위)
**이유**: VSCode 리소스 관리가 복잡함, dispose 패턴 유지 필요

**변경 사항**:
```typescript
export function createStatusBarUI() {
  const statusBarItem = vscode.window.createStatusBarItem(/*...*/);
  
  const updateStopped = () => { /*...*/ };
  const updateRunning = (remainingMs: number) => { /*...*/ };
  const updateExpired = () => { /*...*/ };
  
  return {
    updateState(state: TimerState, remainingMs?: number): void,
    dispose(): void  // VSCode 리소스 정리를 위해 유지
  };
}
```

**영향받는 파일**:
- `src/ui.ts` - 메인 로직 수정
- `src/extension.ts` - 생성 및 사용 방식 변경

## 🔄 단계별 실행 순서

### Phase 1: VideoOverlay 클로저화
- [ ] `overlay.ts` 리팩터링
- [ ] `extension.ts`에서 사용법 변경
- [ ] 테스트 및 검증

### Phase 2: StretchTimer 클로저화  
- [ ] `timer.ts` 리팩터링
- [ ] `extension.ts`에서 사용법 변경
- [ ] 테스트 및 검증

### Phase 3: StatusBarUI 클로저화
- [ ] `ui.ts` 리팩터링
- [ ] `extension.ts`에서 사용법 변경
- [ ] 테스트 및 검증

### Phase 4: 최종 정리
- [ ] `types.ts`에서 불필요한 인터페이스 제거
- [ ] 전체 테스트
- [ ] 문서 업데이트

## 🎯 기대 효과

### 장점
- **코드 단순화**: `new` 키워드 제거, 생성자 로직 불필요
- **함수형 접근**: 더 직관적인 함수 호출 패턴
- **메모리 효율**: 클래스 프로토타입 오버헤드 제거
- **디버깅 용이**: 클로저 스코프가 명확함

### 주의사항
- **dispose 패턴**: VSCode 리소스 해제는 여전히 필요
- **타입 안전성**: 반환 객체의 타입 정의 필요
- **테스트**: 각 단계별로 충분한 검증 필요

## 🧪 검증 방법
1. 각 단계 후 기존 기능 동작 확인
2. 메모리 누수 없는지 확인
3. 타이머 정확성 검증
4. 웹뷰 정상 작동 확인
5. 상태바 UI 반응성 테스트

## 📝 완료 기준
- 모든 기존 기능이 정상 작동
- 코드 가독성 향상
- 타입 에러 없음
- VSCode 리소스 정리 정상 작동