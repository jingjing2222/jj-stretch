import * as vscode from 'vscode';

export class VideoOverlay {
  private panel: vscode.WebviewPanel | undefined;
  private onCloseCallback?: () => void;

  showStretchVideo(videoUrl: string, onClose?: () => void): void {
    this.onCloseCallback = onClose;
    if (this.panel) {
      this.panel.reveal();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'stretchVideo',
      'Time to Stretch!',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.webview.html = this.getWebviewContent(videoUrl);

    // 웹뷰에서 메시지 수신
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'videoEnded':
            console.log('Stretch video ended');
            break;
          case 'closeOverlay':
            console.log('Auto-closing stretch overlay');
            this.close();
            break;
          case 'videoError':
            console.error('Video error:', message.error);
            vscode.window.showErrorMessage('스트레칭 영상을 로드할 수 없습니다.');
            break;
        }
      }
    );

    // 패널이 닫힐 때 정리
    this.panel.onDidDispose(() => {
      this.panel = undefined;
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    });

    // 전체화면으로 표시
    vscode.commands.executeCommand('workbench.action.maximizeEditor');
  }

  close(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
  }

  private getWebviewContent(videoUrl: string): string {
    // YouTube URL에서 video ID 추출
    const videoId = this.extractVideoId(videoUrl);
    
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
                <div class="play-button" id="playButton" style="display: block;">
                    <button onclick="startVideo()" style="
                        background: #ff0000;
                        color: white;
                        border: none;
                        padding: 20px 40px;
                        font-size: 18px;
                        border-radius: 10px;
                        cursor: pointer;
                        margin-bottom: 20px;
                    ">▶️ 스트레칭 영상 시작</button>
                </div>
                <iframe 
                    id="youtube-player"
                    src="https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&enablejsapi=1"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    style="display: none;">
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
            var skipTimer;
            var videoStarted = false;

            function startVideo() {
                document.getElementById('playButton').style.display = 'none';
                document.getElementById('youtube-player').style.display = 'block';
                videoStarted = true;
                
                // YouTube API 로드
                if (!window.YT) {
                    var tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                } else {
                    onYouTubeIframeAPIReady();
                }
            }

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
                if (videoStarted) {
                    player = new YT.Player('youtube-player', {
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange,
                            'onError': onPlayerError
                        }
                    });
                }
            }
            
            function onPlayerReady(event) {
                event.target.playVideo();
                console.log('Player ready and playing');
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
  }

  private extractVideoId(url: string): string {
    // YouTube URL에서 video ID 추출
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : 'mnrKTIa1hZ0'; // 기본값
  }
}