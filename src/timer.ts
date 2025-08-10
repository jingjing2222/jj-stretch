import * as vscode from 'vscode';
import { TimerState, TimerConfig, TimerManager } from './types';

export class StretchTimer implements TimerManager {
  private state: TimerState = 'stopped';
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private targetDurationMs: number = 0;
  
  private onExpiredCallback?: () => void;
  private onTickCallback?: (remainingMs: number) => void;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): TimerConfig {
    const config = vscode.workspace.getConfiguration('jj-stretch');
    const intervalMinutes = config.get<number>('timerIntervalMinutes', 60);
    const videoUrl = config.get<string>('stretchVideoUrl', '');
    const autoStart = config.get<boolean>('autoStart', true);

    return {
      intervalMinutes,
      videoUrl,
      autoStart
    };
  }

  start(): void {
    if (this.state === 'running') {
      return;
    }

    const config = this.loadConfig();
    this.targetDurationMs = config.intervalMinutes * 60 * 1000;
    this.startTime = Date.now();
    this.state = 'running';

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    console.log(`Timer started for ${config.intervalMinutes} minutes`);
  }

  stop(): void {
    if (this.state === 'stopped') {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.state = 'stopped';
    console.log('Timer stopped');
  }

  reset(): void {
    this.stop();
    this.startTime = 0;
    this.targetDurationMs = 0;
    console.log('Timer reset');
  }

  private tick(): void {
    if (this.state !== 'running') {
      return;
    }

    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.targetDurationMs - elapsed);

    if (remaining <= 0) {
      this.state = 'expired';
      this.stop();
      console.log('Timer expired!');
      
      if (this.onExpiredCallback) {
        this.onExpiredCallback();
      }
    } else {
      if (this.onTickCallback) {
        this.onTickCallback(remaining);
      }
    }
  }

  getRemainingTime(): number {
    if (this.state === 'stopped' || this.state === 'expired') {
      return 0;
    }

    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.targetDurationMs - elapsed);
  }

  getState(): TimerState {
    return this.state;
  }

  onExpired(callback: () => void): void {
    this.onExpiredCallback = callback;
  }

  onTick(callback: (remainingMs: number) => void): void {
    this.onTickCallback = callback;
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}