import * as vscode from "vscode";
import * as path from "path";
import { resolveLocale } from "./language";

export function createVideoOverlay(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined;
  let onCloseCallback: (() => void) | undefined;

  const showStretchVideo = (videoUrl: string, onClose?: () => void): void => {
    onCloseCallback = onClose;

    if (panel) {
      panel.reveal();
      return;
    }

    // webview 패키지의 dist 폴더 경로
    const webviewPackagePath = require.resolve("webview/package.json");
    const webviewDistPath = path.join(path.dirname(webviewPackagePath), "dist");

    panel = vscode.window.createWebviewPanel(
      "stretchVideo",
      "Time to Stretch!",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(webviewDistPath)],
      }
    );

    panel.webview.html = getWebviewContent(panel.webview, videoUrl);

    // 웹뷰에서 메시지 수신
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "videoEnded":
          console.log("Stretch video ended");
          break;
        case "closeOverlay":
          console.log("Auto-closing stretch overlay");
          close();
          break;
        case "videoError":
          console.error("Video error:", message.error);
          const errorCode = message.error;
          let errorMsg = "스트레칭 영상을 로드할 수 없습니다.";

          if (errorCode === 150 || errorCode === 101 || errorCode === 100) {
            errorMsg =
              '이 영상은 임베딩이 제한되어 있습니다. VSCode 설정에서 "jj-stretch.stretchVideoUrl"을 임베딩 가능한 다른 영상으로 변경해주세요.';
          }

          vscode.window
            .showWarningMessage(errorMsg, "설정 열기")
            .then((selection) => {
              if (selection === "설정 열기") {
                vscode.commands.executeCommand(
                  "workbench.action.openSettings",
                  "jj-stretch.stretchVideoUrl"
                );
              }
            });
          break;
      }
    });

    // 패널이 닫힐 때 정리
    panel.onDidDispose(() => {
      panel = undefined;
      if (onCloseCallback) {
        onCloseCallback();
      }
    });

    // 전체화면으로 표시
    vscode.commands.executeCommand("workbench.action.maximizeEditor").then(
      () => {},
      () => {
        // Ignore if command doesn't exist
      }
    );
  };

  const close = (): void => {
    if (panel) {
      panel.dispose();
      panel = undefined;
    }
  };

  const getWebviewContent = (
    webview: vscode.Webview,
    videoUrl: string
  ): string => {
    // YouTube URL에서 video ID 추출
    const videoId = extractVideoId(videoUrl);
    const { language } = resolveLocale();

    // webview 패키지의 dist 폴더 찾기
    const webviewPackagePath = require.resolve("webview/package.json");
    const webviewPath = path.join(path.dirname(webviewPackagePath), "dist");
    const indexHtmlPath = path.join(webviewPath, "index.html");

    console.log("Webview path:", webviewPath);
    console.log("Index HTML path:", indexHtmlPath);

    // Read the built HTML file
    const fs = require("fs");
    let html = fs.readFileSync(indexHtmlPath, "utf8");
    console.log("HTML loaded, length:", html.length);

    // Get URIs for assets
    const getUri = (filePath: string) => {
      const fullPath = path.join(webviewPath, filePath);
      return webview.asWebviewUri(vscode.Uri.file(fullPath)).toString();
    };

    // Replace asset paths with webview URIs
    html = html.replace(
      /((?:href|src)=")(\/[^"]*)"/g,
      (_match: string, prefix: string, path: string) => {
        const assetPath = path.substring(1); // Remove leading slash
        const uri = getUri(assetPath);
        return `${prefix}${uri}"`;
      }
    );

    // Add query parameters for videoId and language
    html = html.replace(
      '<script type="module"',
      `<script>
        window.videoId = '${videoId}';
        window.language = '${language}';
      </script>
      <script type="module"`
    );

    console.log("Final HTML preview:", html.substring(0, 500));
    return html;
  };

  const extractVideoId = (url: string): string => {
    // YouTube URL에서 video ID 추출
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : "mnrKTIa1hZ0"; // 기본값
  };

  return {
    showStretchVideo,
    close,
  };
}
