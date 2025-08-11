import * as vscode from "vscode";
import { TimerState, TimerConfig } from "./types";

interface GlobalTimerState {
  state: TimerState;
  startTime: number;
  targetDurationMs: number;
  lastUpdate: number;
  activeInstanceId?: string;
}

let instance: ReturnType<typeof createStretchTimerInstance> | null = null;

function createStretchTimerInstance(context: vscode.ExtensionContext) {
  const GLOBAL_STATE_KEY = "jj-stretch-timer-state";
  const instanceId = Math.random().toString(36).substring(7);
  
  let timeoutId: NodeJS.Timeout | null = null;
  let onExpiredCallback: (() => void) | undefined;
  let onTickCallback: ((remainingMs: number) => void) | undefined;

  // 초기화 시 기존 타이머 상태 복원
  const initializeTimer = (): void => {
    const globalState = getGlobalState();
    if (globalState.state === "running") {
      const now = Date.now();
      const elapsed = now - globalState.startTime;
      const remaining = Math.max(0, globalState.targetDurationMs - elapsed);
      
      if (remaining <= 0) {
        // 이미 만료된 경우
        setGlobalState({ state: "expired" });
      } else {
        // 아직 시간이 남은 경우 타이머 재시작
        tick();
      }
    }
  };

  const getGlobalState = (): GlobalTimerState => {
    return context.globalState.get(GLOBAL_STATE_KEY, {
      state: "stopped" as TimerState,
      startTime: 0,
      targetDurationMs: 0,
      lastUpdate: Date.now()
    });
  };

  const setGlobalState = (newState: Partial<GlobalTimerState>): void => {
    const currentState = getGlobalState();
    const updatedState = { 
      ...currentState, 
      ...newState, 
      lastUpdate: Date.now() 
    };
    context.globalState.update(GLOBAL_STATE_KEY, updatedState);
  };

  const loadConfig = (): TimerConfig => {
    const config = vscode.workspace.getConfiguration("jj-stretch");
    const intervalMinutes = config.get<number>("timerIntervalMinutes", 60);
    const videoUrl = config.get<string>("stretchVideoUrl", "");
    const autoStart = config.get<boolean>("autoStart", true);

    return {
      intervalMinutes,
      videoUrl,
      autoStart,
    };
  };

  const tick = (): void => {
    const globalState = getGlobalState();
    
    if (globalState.state !== "running") {
      return;
    }

    const now = Date.now();
    const elapsed = now - globalState.startTime;
    const remaining = Math.max(0, globalState.targetDurationMs - elapsed);

    if (remaining <= 0) {
      setGlobalState({ 
        state: "expired",
        activeInstanceId: instanceId 
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      console.log("Timer expired!");

      // 현재 인스턴스가 활성 인스턴스인 경우에만 콜백 실행
      const currentGlobalState = getGlobalState();
      if (currentGlobalState.activeInstanceId === instanceId && onExpiredCallback) {
        onExpiredCallback();
      }
    } else {
      if (onTickCallback) {
        onTickCallback(remaining);
      }

      // 다음 초까지의 정확한 시간 계산
      const nextSecond = Math.ceil(elapsed / 1000) * 1000;
      const delay = Math.max(100, nextSecond - elapsed); // 최소 100ms

      timeoutId = setTimeout(tick, delay);
    }
  };

  const start = (): void => {
    const globalState = getGlobalState();
    if (globalState.state === "running") {
      return;
    }

    const config = loadConfig();
    const targetDurationMs = config.intervalMinutes * 60 * 1000;
    const startTime = Date.now();

    setGlobalState({
      state: "running",
      startTime,
      targetDurationMs,
      activeInstanceId: instanceId
    });

    // 첫 번째 tick을 즉시 호출하고 다음 스케줄링
    tick();

    console.log(`Timer started for ${config.intervalMinutes} minutes`);
  };

  const stop = (): void => {
    const globalState = getGlobalState();
    if (globalState.state === "stopped") {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    setGlobalState({ state: "stopped" });
    console.log("Timer stopped");
  };

  const reset = (): void => {
    stop();
    setGlobalState({
      state: "stopped",
      startTime: 0,
      targetDurationMs: 0
    });
    console.log("Timer reset");
  };

  const getRemainingTime = (): number => {
    const globalState = getGlobalState();
    if (globalState.state === "stopped" || globalState.state === "expired") {
      return 0;
    }

    const elapsed = Date.now() - globalState.startTime;
    return Math.max(0, globalState.targetDurationMs - elapsed);
  };

  const getState = (): TimerState => {
    return getGlobalState().state;
  };

  const onExpired = (callback: () => void): void => {
    onExpiredCallback = callback;
  };

  const onTick = (callback: (remainingMs: number) => void): void => {
    onTickCallback = callback;
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isActiveInstance = (): boolean => {
    const globalState = getGlobalState();
    return globalState.activeInstanceId === instanceId;
  };

  const claimActiveInstance = (): void => {
    const globalState = getGlobalState();
    setGlobalState({
      ...globalState,
      activeInstanceId: instanceId
    });
  };

  // 인스턴스 생성 시 타이머 상태 복원
  initializeTimer();

  return {
    start,
    stop,
    reset,
    getRemainingTime,
    getState,
    onExpired,
    onTick,
    formatTime,
    isActiveInstance,
    claimActiveInstance,
  };
}

export function createStretchTimer(context: vscode.ExtensionContext) {
  if (!instance) {
    instance = createStretchTimerInstance(context);
  }
  return instance;
}
