import * as vscode from 'vscode';
import { createStretchTimer } from './timer';
import { createStatusBarUI } from './ui';
import { createVideoOverlay } from './overlay';

let timer: ReturnType<typeof createStretchTimer>;
let statusBar: ReturnType<typeof createStatusBarUI>;
let overlay: ReturnType<typeof createVideoOverlay>;

export function activate(context: vscode.ExtensionContext) {
	console.log('🎉 JJ Stretch extension is now active!');
	
	timer = createStretchTimer(context);
	statusBar = createStatusBarUI();
	overlay = createVideoOverlay();

	timer.onTick((remainingMs) => {
		statusBar.updateState('running', remainingMs);
	});

	timer.onExpired(() => {
		statusBar.updateState('expired');
		
		// 현재 인스턴스가 활성 인스턴스인 경우에만 overlay 표시
		if (timer.isActiveInstance()) {
			const config = vscode.workspace.getConfiguration('jj-stretch');
			const videoUrl = config.get<string>('stretchVideoUrl', 'https://www.youtube.com/embed/mnrKTIa1hZ0?autoplay=1&controls=1');
			
			overlay.showStretchVideo(videoUrl, () => {
				// 웹뷰가 닫히면 타이머 재시작
				timer.reset();
				const autoStart = config.get<boolean>('autoStart', true);
				if (autoStart) {
					timer.start();
					statusBar.updateState('running', timer.getRemainingTime());
				} else {
					statusBar.updateState('stopped');
				}
			});
		}
	});

	const startTimerCommand = vscode.commands.registerCommand('jj-stretch.startTimer', () => {
		timer.start();
		statusBar.updateState('running', timer.getRemainingTime());
		vscode.window.showInformationMessage('🏃‍♂️ Stretch timer started!');
	});

	const stopTimerCommand = vscode.commands.registerCommand('jj-stretch.stopTimer', () => {
		timer.stop();
		statusBar.updateState('stopped');
		vscode.window.showInformationMessage('⏸️ Stretch timer stopped');
	});

	const resetTimerCommand = vscode.commands.registerCommand('jj-stretch.resetTimer', () => {
		timer.reset();
		statusBar.updateState('stopped');
		overlay.close();
		vscode.window.showInformationMessage('🔄 Stretch timer reset');
	});

	const setTimerIntervalCommand = vscode.commands.registerCommand('jj-stretch.setTimerInterval', async () => {
		const config = vscode.workspace.getConfiguration('jj-stretch');
		const currentInterval = config.get<number>('timerIntervalMinutes', 60);
		
		const input = await vscode.window.showInputBox({
			prompt: 'Enter timer interval in minutes (1-480)',
			value: currentInterval.toString(),
			validateInput: (value: string) => {
				const num = parseInt(value);
				if (isNaN(num) || num < 1 || num > 480) {
					return 'Please enter a number between 1 and 480';
				}
				return null;
			}
		});

		if (input) {
			const minutes = parseInt(input);
			await config.update('timerIntervalMinutes', minutes, vscode.ConfigurationTarget.Global);
			
			// 현재 실행 중이면 새 설정으로 재시작
			if (timer.getState() === 'running') {
				timer.stop();
				timer.start();
				statusBar.updateState('running', timer.getRemainingTime());
			}
			
			vscode.window.showInformationMessage(`⏱️ Timer interval set to ${minutes} minutes`);
		}
	});

	// 윈도우 포커스 시 활성 인스턴스로 설정
	const onDidChangeWindowState = vscode.window.onDidChangeWindowState(state => {
		if (state.focused) {
			timer.claimActiveInstance();
		}
	});

	context.subscriptions.push(
		startTimerCommand,
		stopTimerCommand, 
		resetTimerCommand,
		setTimerIntervalCommand,
		statusBar,
		onDidChangeWindowState
	);

	// 기존 타이머 상태에 따라 UI 초기화
	const currentState = timer.getState();
	const remainingTime = timer.getRemainingTime();
	
	if (currentState === 'running') {
		statusBar.updateState('running', remainingTime);
		console.log('🔄 Restored running timer');
	} else if (currentState === 'expired') {
		statusBar.updateState('expired');
		console.log('⏰ Restored expired timer');
		
		// expired 상태에서 활성 인스턴스인 경우 overlay 표시
		if (timer.isActiveInstance()) {
			const config = vscode.workspace.getConfiguration('jj-stretch');
			const videoUrl = config.get<string>('stretchVideoUrl', 'https://www.youtube.com/embed/mnrKTIa1hZ0?autoplay=1&controls=1');
			
			overlay.showStretchVideo(videoUrl, () => {
				timer.reset();
				const autoStart = config.get<boolean>('autoStart', true);
				if (autoStart) {
					timer.start();
					statusBar.updateState('running', timer.getRemainingTime());
				} else {
					statusBar.updateState('stopped');
				}
			});
		}
	} else {
		// stopped 상태이고 autoStart가 활성화된 경우에만 새로 시작
		const config = vscode.workspace.getConfiguration('jj-stretch');
		const autoStart = config.get<boolean>('autoStart', true);
		if (autoStart) {
			timer.start();
			statusBar.updateState('running', timer.getRemainingTime());
			vscode.window.showInformationMessage('🎉 JJ Stretch auto-started!');
		} else {
			statusBar.updateState('stopped');
		}
	}
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
