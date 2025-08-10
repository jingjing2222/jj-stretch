import * as vscode from 'vscode';

export function createVideoOverlay() {
  let panel: vscode.WebviewPanel | undefined;
  let onCloseCallback: (() => void) | undefined;

  const showStretchVideo = (videoUrl: string, onClose?: () => void): void => {
    onCloseCallback = onClose;
    
    if (panel) {
      panel.reveal();
      return;
    }

    panel = vscode.window.createWebviewPanel(
      'stretchVideo',
      'Time to Stretch!',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.webview.html = getWebviewContent(videoUrl);

    // 웹뷰에서 메시지 수신
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'videoEnded':
            console.log('Stretch video ended');
            break;
          case 'closeOverlay':
            console.log('Auto-closing stretch overlay');
            close();
            break;
          case 'videoError':
            console.error('Video error:', message.error);
            vscode.window.showErrorMessage('스트레칭 영상을 로드할 수 없습니다.');
            break;
        }
      }
    );

    // 패널이 닫힐 때 정리
    panel.onDidDispose(() => {
      panel = undefined;
      if (onCloseCallback) {
        onCloseCallback();
      }
    });

    // 전체화면으로 표시
    vscode.commands.executeCommand('workbench.action.maximizeEditor');
  };

  const close = (): void => {
    if (panel) {
      panel.dispose();
      panel = undefined;
    }
  };

  const getWebviewContent = (videoUrl: string): string => {
    // YouTube URL에서 video ID 추출
    const videoId = extractVideoId(videoUrl);
    
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stretch Time!</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
            }
            .container {
                text-align: center;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .title {
                color: white;
                font-size: 2rem;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .video-wrapper {
                width: 80%;
                max-width: 800px;
                aspect-ratio: 16/9;
                position: relative;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 10px;
            }
            .message {
                color: white;
                margin-top: 20px;
                font-size: 1.2rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">🏃‍♂️ 스트레칭 타임!</h1>
            <div class="video-wrapper">
                <iframe 
                    id="youtube-player"
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&enablejsapi=1"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>
            </div>
            <p class="message">건강한 코딩을 위해 잠시 스트레칭하세요! 💪</p>
            <div style="margin-top: 20px;">
                <button onclick="skipVideo()" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">건너뛰기 (5초)</button>
            </div>
        </div>

        <script>
            var player;

            // YouTube API 로드
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            function skipVideo() {
                let countdown = 5;
                const button = event.target;
                const originalText = button.textContent;
                
                button.disabled = true;
                button.textContent = '건너뛰기 (' + countdown + ')';
                
                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        button.textContent = '건너뛰기 (' + countdown + ')';
                    } else {
                        clearInterval(countdownInterval);
                        closeVideo();
                    }
                }, 1000);
            }

            function closeVideo() {
                if (typeof acquireVsCodeApi !== 'undefined') {
                    const vscode = acquireVsCodeApi();
                    vscode.postMessage({
                        command: 'closeOverlay'
                    });
                }
            }

            window.onYouTubeIframeAPIReady = function() {
                player = new YT.Player('youtube-player', {
                    events: {
                        'onStateChange': onPlayerStateChange,
                        'onError': onPlayerError
                    }
                });
            }
            

            function onPlayerStateChange(event) {
                if (event.data == YT.PlayerState.ENDED) {
                    console.log('Video ended');
                    setTimeout(closeVideo, 2000);
                }
            }

            function onPlayerError(event) {
                console.error('Player error:', event.data);
                if (typeof acquireVsCodeApi !== 'undefined') {
                    const vscode = acquireVsCodeApi();
                    vscode.postMessage({
                        command: 'videoError',
                        error: event.data
                    });
                }
            }
        </script>
    </body>
    </html>`;
  };

  const extractVideoId = (url: string): string => {
    // YouTube URL에서 video ID 추출
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : 'mnrKTIa1hZ0'; // 기본값
  };

  return {
    showStretchVideo,
    close
  };
}