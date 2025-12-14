import { render } from "preact";
import "./index.css";
import { App } from "./components/App";

declare global {
  interface Window {
    videoId?: string;
    language?: string;
  }
}

// Get video ID and language from window (injected by extension)
const videoId = window.videoId || "z-FI2mni_Nk";
const language = window.language || "en";

render(
  <App videoId={videoId} language={language} />,
  document.getElementById("app")!
);
