"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useTransform, useMotionValue } from "framer-motion";

export default function SchoolPride() {
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);

    // Calculate scroll progress based on target element position
    const updateProgress = () => {
      const element = document.querySelector(
        "[data-graduation-trigger]",
      ) as HTMLElement;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // Calculate how close element center is to viewport center
      // When elementCenter = viewportCenter, we're at perfect center (progress = 0.5)
      const elementTop = rect.top + window.scrollY;
      const elementBottom = elementTop + rect.height;
      const scrollPos = window.scrollY + viewportCenter;

      // Map scroll position to 0-1 range
      // 0 = element hasn't reached center yet
      // 0.5 = element center is at viewport center
      // 1 = element has passed center
      const totalRange = elementBottom - elementTop + viewportHeight;
      const progress = (scrollPos - elementTop + viewportHeight) / totalRange;

      scrollProgress.set(Math.max(0, Math.min(1, progress)));
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    // Initial calculation
    setTimeout(updateProgress, 200);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, [scrollProgress]);

  // Calculate when element is at 45%-55% of viewport (center)
  // Precise center trigger: Badge appears only when target is at viewport center
  const scale = useTransform(
    scrollProgress,
    [0.35, 0.45, 0.55, 0.65], // Tight window around center
    [0, 1, 1, 0],
  );

  const opacity = useTransform(
    scrollProgress,
    [0.35, 0.45, 0.55, 0.65],
    [0, 1, 1, 0],
  );

  // Backdrop blur during center appearance
  const backdropOpacity = useTransform(
    scrollProgress,
    [0.35, 0.45, 0.55, 0.65],
    [0, 0.7, 0.7, 0],
  );

  if (!isMounted || !ready) return null;

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <motion.div
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md pointer-events-none"
        style={{ opacity: backdropOpacity }}
      />

      {/* Floating Orbital Badge - Center Screen */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
        style={{
          opacity,
          scale,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer Glow Rings - Hollow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 30px 8px rgba(255,215,0,0.3), 0 0 60px 16px rgba(255,215,0,0.15)",
              "0 0 50px 12px rgba(255,215,0,0.6), 0 0 100px 24px rgba(255,215,0,0.3)",
              "0 0 30px 8px rgba(255,215,0,0.3), 0 0 60px 16px rgba(255,215,0,0.15)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Circle Container - XXXL Size */}
        <div className="relative w-96 h-96">
          {/* Dark Glassmorphism Background - Hollow/Transparent */}
          <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-xl border-[6px] border-[#FFD700]/80 shadow-[0_0_120px_rgba(255,215,0,0.9)]" />

          {/* Rotating Border Beam */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #FFD700 10%, transparent 20%, transparent 80%, #FFD700 90%, transparent 100%)",
              maskImage:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "2.5px",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Rotating Orbital Text - Unified SVG System */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{ overflow: "visible" }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: isHovered ? 15 : 20,
              repeat: Infinity,
              ease: "linear",
            }}
            initial={{ rotate: 0 }}
          >
            <defs>
              {/* Define circular path - Perfect center at 50,50 with radius 40 */}
              <path
                id="circleTextPath"
                d="M 50,10 A 40,40 0 1,1 50,90 A 40,40 0 1,1 50,10"
                fill="none"
              />
            </defs>

            {/* Orbital Text */}
            <text
              className="fill-[#FFD700] uppercase"
              style={{
                fontSize: "8px",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                textShadow: "0 0 8px rgba(255,215,0,0.8)",
                letterSpacing: "0.15em",
              }}
            >
              <textPath href="#circleTextPath" startOffset="0%">
                {t("common.graduationProject")}
              </textPath>
            </text>

            {/* Dashed Circle Guide */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,215,0,0.12)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          </motion.svg>

          {/* Center Content - Static Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Graduation Cap Icon with Light Glow */}
            <motion.div
              className="relative z-10"
              animate={{
                scale: isHovered ? [1, 1.12, 1] : [1, 1.08, 1],
                filter: [
                  "drop-shadow(0 0 8px rgba(255,215,0,0.5))",
                  "drop-shadow(0 0 16px rgba(255,215,0,0.8))",
                  "drop-shadow(0 0 8px rgba(255,215,0,0.5))",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="w-16 h-16 text-[#FFD700]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>

              {/* Inner Glow Ring - Subtle */}
              <motion.div
                className="absolute inset-0 -m-3 rounded-full border border-[#FFD700]/15"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>

            {/* Year Badge - Large */}
            <motion.div
              className="mt-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2 rounded-full shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 12px rgba(255,215,0,0.4)",
                  "0 0 20px rgba(255,215,0,0.7)",
                  "0 0 12px rgba(255,215,0,0.4)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-black font-black text-2xl tracking-wide">
                2026
              </span>
            </motion.div>
          </div>

          {/* Corner Sparkles - Compact */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 text-[#FFD700]"
              style={{
                top: "50%",
                left: "50%",
                rotate: angle,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.35, 0.7, 0.35],
                translateY: ["-45px", "-48px", "-45px"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
