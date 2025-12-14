import { useState, useEffect } from "preact/hooks";
import { MatrixBackground } from "./MatrixBackground";
import { VideoPlayer } from "./VideoPlayer";
import { ErrorMessage } from "./ErrorMessage";
import { locales, matrixChars } from "../i18n/locales";
import { getRandomMeme } from "../utils/memes";
import type { VSCodeAPI } from "../types";

interface AppProps {
  videoId: string;
  language: string;
}

export function App({ videoId, language }: AppProps) {
  const locale = locales[language] || locales.en;
  const meme = getRandomMeme(language);
  const chars = matrixChars[language] || matrixChars.en;

  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [skipCountdown, setSkipCountdown] = useState<number | null>(null);

  const vscode: VSCodeAPI | undefined =
    typeof acquireVsCodeApi !== "undefined" ? acquireVsCodeApi() : undefined;

  useEffect(() => {
    if (skipCountdown === null) return;

    if (skipCountdown === 0) {
      closeVideo();
      return;
    }

    const timer = setTimeout(() => {
      setSkipCountdown(skipCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [skipCountdown]);

  const handleVideoError = (code: number) => {
    setErrorCode(code);
    vscode?.postMessage({
      command: "videoError",
      error: code,
    });
  };

  const handleVideoEnded = () => {
    closeVideo();
  };

  const closeVideo = () => {
    vscode?.postMessage({
      command: "closeOverlay",
    });
  };

  const handleSkip = () => {
    if (errorCode) {
      closeVideo();
    } else {
      setSkipCountdown(3);
    }
  };

  const getSkipButtonText = () => {
    if (errorCode) {
      return "$ Close --now";
    }
    if (skipCountdown !== null) {
      return `$ ${locale.skip} --wait ${skipCountdown}s`;
    }
    return `$ ${locale.skip} --wait 3s`;
  };

  return (
    <div className="m-0 p-0 overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] flex justify-center items-center h-screen font-mono relative">
      <MatrixBackground chars={chars} />

      <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px),repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] z-1" />

      <div className="text-center w-full h-full flex flex-col justify-center items-center relative z-2">
        <h1 className="text-[#00ff00] text-[2.5rem] mb-3.75 drop-shadow-[0_0_10px_rgba(0,255,0,0.5),0_0_20px_rgba(0,255,0,0.3)] font-bold animate-glow">
          &gt; {locale.stretchingTime} _
        </h1>

        <div className="text-[#00d9ff] text-[1.1rem] mb-6.25 font-mono px-5 py-2.5 bg-[rgba(0,217,255,0.1)] border-l-[3px] border-[#00d9ff] rounded-[3px] max-w-150">
          {meme}
        </div>

        <div className={errorCode ? "opacity-30" : ""}>
          <VideoPlayer
            videoId={videoId}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
          />
        </div>

        <ErrorMessage errorCode={errorCode} locale={locale} />

        {!errorCode && (
          <p className="text-[#00ff00] mt-6.25 text-[1.3rem] drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
            {locale.takeMomentToStretch} 💪
          </p>
        )}

        <button
          onClick={handleSkip}
          disabled={skipCountdown !== null && skipCountdown > 0}
          className="mt-5 bg-linear-to-br from-[#1e3a5f] to-[#2d5a88] text-[#00ff00] border-2 border-[#00ff00] px-7.5 py-3 rounded-lg cursor-pointer font-mono text-base font-bold transition-all duration-300 shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:bg-linear-to-br hover:from-[#2d5a88] hover:to-[#1e3a5f] hover:shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {getSkipButtonText()}
        </button>
      </div>
    </div>
  );
}
