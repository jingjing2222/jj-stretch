import * as vscode from 'vscode';
import { TimerState } from './types';

export class StatusBarUI {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100 // 우선순위 (높을수록 왼쪽에 배치)
    );
    
    this.statusBarItem.command = 'jj-stretch.startTimer';
    this.statusBarItem.show();
    this.updateStopped();
  }

  updateRunning(remainingMs: number): void {
    const minutes = Math.floor(remainingMs / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    this.statusBarItem.text = `⏱️ ${timeText}`;
    this.statusBarItem.tooltip = `Stretch Timer: ${timeText} remaining`;
    this.statusBarItem.command = 'jj-stretch.stopTimer';
  }

  updateStopped(): void {
    this.statusBarItem.text = '⏸️ Stretch Timer';
    this.statusBarItem.tooltip = 'Click to start stretch timer';
    this.statusBarItem.command = 'jj-stretch.startTimer';
  }

  updateExpired(): void {
    this.statusBarItem.text = '🏃‍♂️ Time to Stretch!';
    this.statusBarItem.tooltip = 'Stretch time! Click to reset timer';
    this.statusBarItem.command = 'jj-stretch.resetTimer';
    
    // 시각적 강조를 위해 색상 변경
    this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
  }

  updateState(state: TimerState, remainingMs?: number): void {
    // 색상 초기화
    this.statusBarItem.color = undefined;
    
    switch (state) {
      case 'running':
        if (remainingMs !== undefined) {
          this.updateRunning(remainingMs);
        }
        break;
      case 'stopped':
        this.updateStopped();
        break;
      case 'expired':
        this.updateExpired();
        break;
    }
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}