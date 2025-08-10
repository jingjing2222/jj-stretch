import * as vscode from 'vscode';
import { StretchTimer } from './timer';
import { StatusBarUI } from './ui';
import { VideoOverlay } from './overlay';

let timer: StretchTimer;
let statusBar: StatusBarUI;
let overlay: VideoOverlay;

export function activate(context: vscode.ExtensionContext) {
	console.log('🎉 JJ Stretch extension is now active!');
	
	timer = new StretchTimer();
	statusBar = new StatusBarUI();
	overlay = new VideoOverlay();

	timer.onTick((remainingMs) => {
		statusBar.updateState('running', remainingMs);
	});

	timer.onExpired(() => {
		statusBar.updateState('expired');
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

	context.subscriptions.push(
		startTimerCommand,
		stopTimerCommand, 
		resetTimerCommand,
		statusBar
	);

	const config = vscode.workspace.getConfiguration('jj-stretch');
	const autoStart = config.get<boolean>('autoStart', true);
	if (autoStart) {
		timer.start();
		statusBar.updateState('running', timer.getRemainingTime());
		vscode.window.showInformationMessage('🎉 JJ Stretch auto-started!');
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
