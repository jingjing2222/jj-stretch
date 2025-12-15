import * as vscode from "vscode";
import { createStretchTimer } from "./timer";
import { createStatusBarUI } from "./ui";
import { createVideoOverlay } from "./overlay";

let timer: ReturnType<typeof createStretchTimer>;
let statusBar: ReturnType<typeof createStatusBarUI>;
let overlay: ReturnType<typeof createVideoOverlay>;

export function activate(context: vscode.ExtensionContext) {
  timer = createStretchTimer(context);
  statusBar = createStatusBarUI();
  overlay = createVideoOverlay();

  timer.onTick((remainingMs) => {
    statusBar.updateState("running", remainingMs);
  });

  timer.onExpired(() => {
    statusBar.updateState("expired");

    // 현재 인스턴스가 활성 인스턴스인 경우에만 overlay 표시
    if (timer.isActiveInstance()) {
      const config = vscode.workspace.getConfiguration("jj-stretch");

      overlay.showStretchOverlay(() => {
        // 웹뷰가 닫히면 타이머 재시작
        timer.reset();
        const autoStart = config.get<boolean>("autoStart", true);
        if (autoStart) {
          timer.start();
          statusBar.updateState("running", timer.getRemainingTime());
        } else {
          statusBar.updateState("stopped");
        }
      });
    }
  });

  // 콜백 설정 완료 후 현재 인스턴스를 활성으로 클레임하고 타이머 상태 초기화
  timer.claimActiveInstance();
  timer.initializeTimer(
    (state, remainingMs) => statusBar.updateState(state, remainingMs),
    () => {
      // expired 상태에서 overlay 표시
      const config = vscode.workspace.getConfiguration("jj-stretch");

      overlay.showStretchOverlay(() => {
        timer.reset();
        const autoStart = config.get<boolean>("autoStart", true);
        if (autoStart) {
          timer.start();
          statusBar.updateState("running", timer.getRemainingTime());
        } else {
          statusBar.updateState("stopped");
        }
      });
    },
    (message) => vscode.window.showInformationMessage(message)
  );

  const startTimerCommand = vscode.commands.registerCommand(
    "jj-stretch.startTimer",
    () => {
      timer.claimActiveInstance();
      timer.start();
      statusBar.updateState("running", timer.getRemainingTime());
      vscode.window.showInformationMessage("🏃‍♂️ Stretch timer started!");
    }
  );

  const stopTimerCommand = vscode.commands.registerCommand(
    "jj-stretch.stopTimer",
    () => {
      timer.claimActiveInstance();
      timer.stop();
      statusBar.updateState("stopped");
      vscode.window.showInformationMessage("⏸️ Stretch timer stopped");
    }
  );

  const resetTimerCommand = vscode.commands.registerCommand(
    "jj-stretch.resetTimer",
    () => {
      timer.claimActiveInstance();
      timer.reset();
      statusBar.updateState("stopped");
      overlay.close();
      vscode.window.showInformationMessage("🔄 Stretch timer reset");
    }
  );

  const setTimerIntervalCommand = vscode.commands.registerCommand(
    "jj-stretch.setTimerInterval",
    async () => {
      const config = vscode.workspace.getConfiguration("jj-stretch");
      const currentInterval = config.get<number>("timerIntervalMinutes", 60);

      const input = await vscode.window.showInputBox({
        prompt: "Enter timer interval in minutes (1-480)",
        value: currentInterval.toString(),
        validateInput: (value: string) => {
          const num = parseInt(value);
          if (isNaN(num) || num < 1 || num > 480) {
            return "Please enter a number between 1 and 480";
          }
          return null;
        },
      });

      if (input) {
        const minutes = parseInt(input);
        await config.update(
          "timerIntervalMinutes",
          minutes,
          vscode.ConfigurationTarget.Global
        );

        // 현재 실행 중이면 새 설정으로 재시작
        if (timer.getState() === "running") {
          timer.stop();
          timer.start();
          statusBar.updateState("running", timer.getRemainingTime());
        }

        vscode.window.showInformationMessage(
          `⏱️ Timer interval set to ${minutes} minutes`
        );
      }
    }
  );

  const claimTimerCommand = vscode.commands.registerCommand(
    "jj-stretch.claimTimer",
    () => {
      timer.claimActiveInstance();
      const currentState = timer.getState();
      const remainingTime = timer.getRemainingTime();

      if (currentState === "running") {
        statusBar.updateState("running", remainingTime);
        vscode.window.showInformationMessage("🎯 Timer control claimed!");
      }
    }
  );

  // 윈도우 포커스 시 활성 인스턴스로 설정
  const onDidChangeWindowState = vscode.window.onDidChangeWindowState(
    (state) => {
      if (state.focused) {
        timer.claimActiveInstance();
        // UI 상태 즉시 업데이트
        const currentState = timer.getState();
        const remainingTime = timer.getRemainingTime();
        if (currentState === "running") {
          statusBar.updateState("running", remainingTime);
        }
      }
    }
  );

  context.subscriptions.push(
    startTimerCommand,
    stopTimerCommand,
    resetTimerCommand,
    setTimerIntervalCommand,
    claimTimerCommand,
    statusBar,
    onDidChangeWindowState
  );
}

export function deactivate() {
  if (timer) {
    timer.stop();
  }
  if (statusBar) {
    statusBar.dispose();
  }
  if (overlay) {
    overlay.close();
  }
}
