export interface TimerConfig {
  intervalMinutes: number;
  videoUrl: string;
  autoStart: boolean;
}

export interface TimerData {
  remainingMs: number;
  startTime: number;
  intervalMs: number;
}

export type TimerState = "stopped" | "running" | "expired";

export interface TimerManager {
  start(): void;
  stop(): void;
  reset(): void;
  getRemainingTime(): number;
  getState(): TimerState;
  onExpired(callback: () => void): void;
  onTick(callback: (remainingMs: number) => void): void;
}
