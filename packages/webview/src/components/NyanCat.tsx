import { useState, useEffect, useRef } from "preact/hooks";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

export function NyanCat() {
  const [position, setPosition] = useState<Position>({ x: 20, y: 50 });
  const velocityRef = useRef<Velocity>({ x: 0.075, y: 0.05 });

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setPosition((prev) => {
        let newX = prev.x + velocityRef.current.x;
        let newY = prev.y + velocityRef.current.y;

        if (newX <= 0 || newX >= 90) {
          velocityRef.current.x *= -1;
          newX = Math.max(0, Math.min(90, newX));
        }
        if (newY <= 0 || newY >= 90) {
          velocityRef.current.y *= -1;
          newY = Math.max(0, Math.min(90, newY));
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      {/* Nyan Cat */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: velocityRef.current.x < 0 ? "scaleX(-1)" : "scaleX(1)",
        }}
      >
        <div className="relative">
          {/* Cat Body */}
          <div className="flex items-center">
            {/* Rainbow Body (Pop-Tart) */}
            <div
              className="relative"
              style={{
                width: "60px",
                height: "40px",
                background: "linear-gradient(90deg, #ff69b4, #ff1493, #ff69b4)",
                border: "2px solid #000",
                borderRadius: "4px",
                animation: "wiggle 0.3s infinite",
              }}
            >
              {/* Sprinkles */}
              <div
                className="absolute"
                style={{
                  width: "4px",
                  height: "4px",
                  background: "#ff0000",
                  top: "8px",
                  left: "12px",
                  borderRadius: "50%",
                }}
              />
              <div
                className="absolute"
                style={{
                  width: "4px",
                  height: "4px",
                  background: "#00ff00",
                  top: "20px",
                  left: "25px",
                  borderRadius: "50%",
                }}
              />
              <div
                className="absolute"
                style={{
                  width: "4px",
                  height: "4px",
                  background: "#0000ff",
                  top: "28px",
                  left: "40px",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Cat Head */}
            <div
              className="relative"
              style={{
                width: "40px",
                height: "40px",
                background: "#999",
                border: "2px solid #000",
                marginLeft: "-5px",
              }}
            >
              {/* Ears */}
              <div
                className="absolute"
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "12px solid #999",
                  top: "-12px",
                  left: "2px",
                }}
              />
              <div
                className="absolute"
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "12px solid #999",
                  top: "-12px",
                  right: "2px",
                }}
              />

              {/* Face */}
              <div className="absolute top-3 left-2 flex gap-4">
                {/* Eyes */}
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    background: "#000",
                  }}
                />
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    background: "#000",
                  }}
                />
              </div>

              {/* Mouth */}
              <div
                className="absolute"
                style={{
                  width: "8px",
                  height: "2px",
                  background: "#000",
                  top: "24px",
                  left: "16px",
                }}
              />

              {/* Cheeks */}
              <div
                className="absolute"
                style={{
                  width: "6px",
                  height: "4px",
                  background: "#ffb6c1",
                  borderRadius: "50%",
                  top: "20px",
                  left: "2px",
                }}
              />
              <div
                className="absolute"
                style={{
                  width: "6px",
                  height: "4px",
                  background: "#ffb6c1",
                  borderRadius: "50%",
                  top: "20px",
                  right: "2px",
                }}
              />
            </div>
          </div>

          {/* Tail */}
          <div
            className="absolute"
            style={{
              width: "20px",
              height: "6px",
              background: "#999",
              border: "2px solid #000",
              top: "10px",
              left: "-20px",
              animation: "tailWag 0.5s infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes tailWag {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </>
  );
}
