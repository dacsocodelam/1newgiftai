"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// Loading Fallback Component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">🎁</div>
        <p className="text-amber-800 text-lg font-bold">ギフトを準備中...</p>
        <p className="text-amber-600 text-sm mt-2">Loading your gift...</p>
      </div>
    </div>
  );
}

// Theme configurations
const themeConfig = {
  emotional: {
    icon: "💖",
    iconAlt: "❤️",
  },
  funny: {
    icon: "😂",
    iconAlt: "🤣",
  },
  formal: {
    icon: "🎊",
    iconAlt: "✨",
  },
};

// Main Content Component
function CardContent() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  // Get params directly
  const messageParam = searchParams.get("m");
  const toneParam = searchParams.get("t") || "emotional";

  // Decode message
  let message = "素敵なメッセージをお届けします";
  try {
    if (messageParam) {
      message = decodeURIComponent(messageParam);
    }
  } catch {
    message = messageParam || "素敵なメッセージをお届けします";
  }

  const tone = toneParam as keyof typeof themeConfig;
  const theme = themeConfig[tone] || themeConfig.emotional;

  // Background always yellow
  const bgGradient =
    "linear-gradient(to bottom right, #fef3c7, #fde68a, #fed7aa)";

  const getBorderColor = () => {
    if (tone === "emotional") return "#fbcfe8";
    if (tone === "funny") return "#fde047";
    return "#bfdbfe";
  };

  // Fire confetti based on tone
  const fireConfetti = useCallback(async () => {
    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default;

      if (tone === "funny") {
        const defaults = { origin: { y: 0.7 } };
        const colors = ["#ffeb3b", "#ff9800", "#4caf50", "#2196f3", "#9c27b0"];
        confetti({
          ...defaults,
          particleCount: 50,
          spread: 26,
          startVelocity: 55,
          colors,
        });
        confetti({ ...defaults, particleCount: 40, spread: 60, colors });
        confetti({
          ...defaults,
          particleCount: 70,
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors,
        });
      } else if (tone === "formal") {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const colors = ["#001f3f", "#FFD700", "#ffffff", "#4169e1", "#87ceeb"];
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 40 * (timeLeft / duration);
          confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random() * 0.6 + 0.2,
              y: Math.random() * 0.3 + 0.2,
            },
            colors,
          });
        }, 400);
      } else {
        const heartShape = confetti.shapeFromPath({
          path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        });
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const colors = ["#ff69b4", "#ff1493", "#ff6b9d", "#ffc0cb", "#ffffff"];
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 40 * (timeLeft / duration);
          confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() - 0.2 },
            colors,
            shapes: [heartShape],
            scalar: 1.5,
          });
        }, 300);
      }
    } catch (err) {
      console.error("Confetti error:", err);
    }
  }, [tone]);

  useEffect(() => {
    setIsVisible(true);
    const confettiTimer = setTimeout(() => {
      fireConfetti();
    }, 500);
    return () => clearTimeout(confettiTimer);
  }, [fireConfetti]);

  return (
    <>
      <style jsx>{`
        @keyframes bounceAnim {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulseAnim {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes spinAnim {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <style jsx global>{`
        .bounce-icon {
          animation: bounceAnim 1s ease-in-out infinite;
        }
        .pulse-icon {
          animation: pulseAnim 2s ease-in-out infinite;
        }
        .spin-icon {
          animation: spinAnim 3s linear infinite;
        }
        .scale-in {
          animation: scaleIn 1s ease-out forwards;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: bgGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          position: "relative",
        }}
      >
        {/* Floating decorations */}
        <div
          style={{
            position: "fixed",
            inset: "0",
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {tone === "emotional" && (
            <>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  left: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                💕
              </div>
              <div
                className="bounce-icon"
                style={{
                  position: "absolute",
                  top: "5rem",
                  right: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                💗
              </div>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  bottom: "5rem",
                  left: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                💖
              </div>
              <div
                className="bounce-icon"
                style={{
                  position: "absolute",
                  bottom: "2.5rem",
                  right: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                💝
              </div>
            </>
          )}
          {tone === "funny" && (
            <>
              <div
                className="spin-icon"
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  left: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                🎉
              </div>
              <div
                className="bounce-icon"
                style={{
                  position: "absolute",
                  top: "5rem",
                  right: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                🥳
              </div>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  bottom: "5rem",
                  left: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                ✨
              </div>
              <div
                className="bounce-icon"
                style={{
                  position: "absolute",
                  bottom: "2.5rem",
                  right: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                🎈
              </div>
            </>
          )}
          {tone === "formal" && (
            <>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  left: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                ⭐
              </div>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  top: "5rem",
                  right: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                ✨
              </div>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  bottom: "5rem",
                  left: "5rem",
                  fontSize: "1.875rem",
                }}
              >
                🌟
              </div>
              <div
                className="pulse-icon"
                style={{
                  position: "absolute",
                  bottom: "2.5rem",
                  right: "2.5rem",
                  fontSize: "2.25rem",
                }}
              >
                💫
              </div>
            </>
          )}
        </div>

        {/* Main card */}
        <div
          className={isVisible ? "scale-in" : ""}
          style={{
            maxWidth: "32rem",
            width: "90%",
            position: "relative",
            zIndex: 10,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1.5rem",
              border: `3px solid ${getBorderColor()}`,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              padding: "2rem",
              position: "relative",
              overflow: "visible",
              minHeight: "20rem",
            }}
          >
            {/* Decorative corners */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "5rem",
                height: "5rem",
                borderTop: "4px solid #000",
                borderLeft: "4px solid #000",
                opacity: 0.2,
                borderTopLeftRadius: "1.5rem",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "5rem",
                height: "5rem",
                borderBottom: "4px solid #000",
                borderRight: "4px solid #000",
                opacity: 0.2,
                borderBottomRightRadius: "1.5rem",
              }}
            />

            {/* Top icon */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div className="bounce-icon" style={{ display: "inline-block" }}>
                <span style={{ fontSize: "3.75rem", display: "block" }}>
                  {theme.icon}
                </span>
              </div>
            </div>

            {/* Message */}
            <div
              style={{
                textAlign: "center",
                padding: "1rem",
                background: "#f8f9fa",
                borderRadius: "0.5rem",
                margin: "1rem 0",
              }}
            >
              <p
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "1.8",
                  color: "#000000",
                  margin: 0,
                  fontWeight: 600,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {message || "テストメッセージ"}
              </p>
            </div>

            {/* Bottom icon */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <div className="pulse-icon" style={{ display: "inline-block" }}>
                <span style={{ fontSize: "2.25rem", display: "block" }}>
                  {theme.iconAlt}
                </span>
              </div>
            </div>

            {/* GiftAI branding */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Powered by{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    background: "linear-gradient(to right, #001f3f, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GiftAI
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Page with Suspense
export default function CardViewPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CardContent />
    </Suspense>
  );
}
