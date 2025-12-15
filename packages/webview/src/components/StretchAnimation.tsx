import { useState, useEffect } from "preact/hooks";
import type { Locale } from "../i18n/locales";

interface StretchAnimationProps {
  isSkipped: boolean;
  locale: Locale;
}

export function StretchAnimation({ isSkipped, locale }: StretchAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  const normalFrames = [
    // 좌측 스트레칭 1
    `  \\(^o^)/
   \\  |
    \\ |
     \\|
     / \\`,
    // 좌측 스트레칭 2
    ` \\(^o^)/
  \\  |
   \\ |
    \\|
    / \\`,
    // 좌측 스트레칭 3
    `\\(^o^)/
 \\  |
  \\ |
   \\|
   / \\`,
    // 우측 스트레칭 1
    `  \\(^o^)/
   |  /
   | /
   |/
   / \\`,
    // 우측 스트레칭 2
    `   \\(^o^)/
    |  /
    | /
    |/
    / \\`,
    // 우측 스트레칭 3
    `    \\(^o^)/
     |  /
     | /
     |/
     / \\`,
  ];

  const sadFrame = `  (T_T)
   |  |
   |  |
  / \\`;

  const getMessage = () => {
    if (isSkipped) {
      return locale.skippedMessage;
    }

    const step = Math.floor(currentFrame / 1) % 6;
    const messages = [
      locale.stretchLeft1,
      locale.stretchLeft2,
      locale.stretchLeft3,
      locale.stretchRight1,
      locale.stretchRight2,
      locale.stretchRight3,
    ];
    return messages[step];
  };

  useEffect(() => {
    if (isSkipped) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % normalFrames.length);
    }, 1000); // 1초마다 프레임 변경

    return () => clearInterval(interval);
  }, [isSkipped]);

  return (
    <div className="flex flex-col items-center">
      <pre className="text-[#00ff00] text-[2rem] leading-tight font-mono whitespace-pre text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.7)]">
        {isSkipped ? sadFrame : normalFrames[currentFrame]}
      </pre>
      <p className="text-[#00d9ff] text-[1.2rem] mt-4 font-mono">
        {getMessage()}
      </p>
    </div>
  );
}
