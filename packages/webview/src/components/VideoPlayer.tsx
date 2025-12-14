import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoId: string;
  onError: (errorCode: number) => void;
  onEnded: () => void;
}

export function VideoPlayer({ videoId, onError, onEnded }: VideoPlayerProps) {
  const handleError = (error: any) => {
    console.error("ReactPlayer error:", error);
    // YouTube error codes: 2, 5, 100, 101, 150
    onError(150); // Default to embedding restriction error
  };

  return (
    <div className="w-[80%] max-w-[900px] aspect-video relative shadow-[0_0_30px_rgba(0,255,0,0.3),0_0_60px_rgba(0,217,255,0.2)] rounded-[15px] overflow-hidden border-2 border-[rgba(0,255,0,0.3)]">
      <ReactPlayer
        oEmbedUrl={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        playing
        muted
        controls
        onEnded={onEnded}
        onError={handleError}
      />
    </div>
  );
}
