export interface VSCodeAPI {
  postMessage(message: any): void;
}

declare global {
  function acquireVsCodeApi(): VSCodeAPI;
}

export interface VideoPlayerProps {
  videoId: string;
  onError: (errorCode: number) => void;
  onEnded: () => void;
}
