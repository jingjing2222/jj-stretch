import * as vscode from 'vscode';
import { TimerState, TimerConfig } from './types';

export function createStretchTimer() {
  let state: TimerState = 'stopped';
  let timeoutId: NodeJS.Timeout | null = null;
  let startTime: number = 0;
  let targetDurationMs: number = 0;
  let lastTickTime: number = 0;
  
  let onExpiredCallback: (() => void) | undefined;
  let onTickCallback: ((remainingMs: number) => void) | undefined;

  const loadConfig = (): TimerConfig => {
    const config = vscode.workspace.getConfiguration('jj-stretch');
    const intervalMinutes = config.get<number>('timerIntervalMinutes', 60);
    const videoUrl = config.get<string>('stretchVideoUrl', '');
    const autoStart = config.get<boolean>('autoStart', true);

    return {
      intervalMinutes,
      videoUrl,
      autoStart
    };
  };

  const tick = (): void => {
    if (state !== 'running') {
      return;
    }

    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, targetDurationMs - elapsed);

    if (remaining <= 0) {
      state = 'expired';
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      console.log('Timer expired!');
      
      if (onExpiredCallback) {
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
      lastTickTime = now;
    }
  };

  const start = (): void => {
    if (state === 'running') {
      return;
    }

    const config = loadConfig();
    targetDurationMs = config.intervalMinutes * 60 * 1000;
    startTime = Date.now();
    lastTickTime = startTime;
    state = 'running';

    // 첫 번째 tick을 즉시 호출하고 다음 스케줄링
    tick();

    console.log(`Timer started for ${config.intervalMinutes} minutes`);
  };

  const stop = (): void => {
    if (state === 'stopped') {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    state = 'stopped';
    console.log('Timer stopped');
  };

  const reset = (): void => {
    stop();
    startTime = 0;
    targetDurationMs = 0;
    console.log('Timer reset');
  };

  const getRemainingTime = (): number => {
    if (state === 'stopped' || state === 'expired') {
      return 0;
    }

    const elapsed = Date.now() - startTime;
    return Math.max(0, targetDurationMs - elapsed);
  };

  const getState = (): TimerState => {
    return state;
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    start,
    stop,
    reset,
    getRemainingTime,
    getState,
    onExpired,
    onTick,
    formatTime
  };
}