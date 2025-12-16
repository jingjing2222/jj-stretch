import { render } from "preact";
import "./index.css";
import { App } from "./components/App";
import type { VSCodeAPI } from "./types";

declare global {
  interface Window {
    language?: string;
  }
}

// VSCode API는 한 번만 호출
const vscode: VSCodeAPI | undefined =
  typeof acquireVsCodeApi !== "undefined" ? acquireVsCodeApi() : undefined;

const language = window.language || "en";

render(
  <App language={language} vscode={vscode} />,
  document.getElementById("app")!
);
