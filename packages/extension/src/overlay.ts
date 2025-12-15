import * as vscode from "vscode";
import * as path from "path";
import { resolveLocale } from "./language";

export function createVideoOverlay() {
  let panel: vscode.WebviewPanel | undefined;
  let onCloseCallback: (() => void) | undefined;

  const showStretchOverlay = (onClose?: () => void): void => {
    onCloseCallback = onClose;

    if (panel) {
      panel.reveal();
      return;
    }

    // webview 패키지의 dist 폴더 경로
    const webviewPackagePath = require.resolve("webview/package.json");
    const webviewDistPath = path.join(path.dirname(webviewPackagePath), "dist");

    panel = vscode.window.createWebviewPanel(
      "stretchOverlay",
      "Time to Stretch!",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(webviewDistPath)],
      }
    );

    panel.webview.html = getWebviewContent(panel.webview);

    // 웹뷰에서 메시지 수신
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "closeOverlay":
          console.log("Closing stretch overlay");
          close();
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

  const getWebviewContent = (webview: vscode.Webview): string => {
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
        window.language = '${language}';
      </script>
      <script type="module"`
    );

    console.log("Final HTML preview:", html.substring(0, 5000));
    return html;
  };

  return {
    showStretchOverlay,
    close,
  };
}
