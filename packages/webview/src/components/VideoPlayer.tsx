import { useEffect, useRef } from 'preact/hooks';

interface VideoPlayerProps {
  videoId: string;
  onError: (errorCode: number) => void;
  onEnded: () => void;
}

export function VideoPlayer({ videoId, onError, onEnded }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        events: {
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              onEnded();
            }
          },
          onError: (event: any) => {
            onError(event.data);
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onError, onEnded]);

  return (
    <div className="w-[80%] max-w-[900px] aspect-video relative shadow-[0_0_30px_rgba(0,255,0,0.3),0_0_60px_rgba(0,217,255,0.2)] rounded-[15px] overflow-hidden border-2 border-[rgba(0,255,0,0.3)]">
      <iframe
        id="youtube-player"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&enablejsapi=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full border-none"
      />
    </div>
  );
}
