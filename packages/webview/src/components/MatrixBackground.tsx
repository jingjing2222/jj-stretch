import { useEffect, useRef } from 'preact/hooks';

interface MatrixBackgroundProps {
  chars: string;
}

export function MatrixBackground({ chars }: MatrixBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const matrix = containerRef.current;
    const columnCount = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement('div');
      column.className = 'absolute top-[-100%] text-sm text-[#0f0] whitespace-pre drop-shadow-[0_0_5px_#0f0]';
      column.style.left = `${i * 20}px`;
      column.style.animation = 'fall linear infinite';
      column.style.animationDuration = `${Math.random() * 3 + 2}s`;
      column.style.animationDelay = `${Math.random() * 2}s`;

      let text = '';
      const charCount = Math.floor(Math.random() * 20) + 10;
      for (let j = 0; j < charCount; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '\n';
      }
      column.textContent = text;
      matrix.appendChild(column);
    }

    return () => {
      matrix.innerHTML = '';
    };
  }, [chars]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 z-0"
    />
  );
}
