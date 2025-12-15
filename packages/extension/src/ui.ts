import * as vscode from "vscode";
import { TimerState } from "./types";

export function createStatusBarUI() {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100 // 우선순위 (높을수록 왼쪽에 배치)
  );

  statusBarItem.command = "jj-stretch.startTimer";
  statusBarItem.show();

  const updateRunning = (remainingMs: number): void => {
    const minutes = Math.floor(remainingMs / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    const timeText = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    statusBarItem.text = `⏱️ ${timeText}`;
    statusBarItem.tooltip = `Stretch Timer: ${timeText} remaining`;
    statusBarItem.command = "jj-stretch.stopTimer";
  };

  const updateStopped = (): void => {
    statusBarItem.text = "⏸️ Stretch Timer";
    statusBarItem.tooltip = "Click to start stretch timer";
    statusBarItem.command = "jj-stretch.startTimer";
  };

  const updateExpired = (): void => {
    statusBarItem.text = "🏃‍♂️ Time to Stretch!";
    statusBarItem.tooltip = "Stretch time! Click to reset timer";
    statusBarItem.command = "jj-stretch.resetTimer";

    // 시각적 강조를 위해 색상 변경
    statusBarItem.color = new vscode.ThemeColor(
      "statusBarItem.errorForeground"
    );
  };

  const updateState = (state: TimerState, remainingMs?: number): void => {
    // 색상 초기화
    statusBarItem.color = undefined;

    switch (state) {
      case "running":
        if (remainingMs !== undefined) {
          updateRunning(remainingMs);
        }
        break;
      case "stopped":
        updateStopped();
        break;
      case "expired":
        updateExpired();
        break;
    }
  };

  const dispose = (): void => {
    statusBarItem.dispose();
  };

  // 초기 상태 설정
  updateStopped();

  return {
    updateState,
    dispose,
  };
}
