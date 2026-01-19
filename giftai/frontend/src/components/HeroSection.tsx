"use client";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

// Dynamically import AIMascot to avoid SSR issues with Three.js
const AIMascot = dynamic(() => import("./AIMascot"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-[#001f3f] via-[#003366] to-[#001f3f] overflow-hidden"
    >
      {/* 3D AI Mascot Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <AIMascot />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Animation */}
          <div className="flex justify-center items-center gap-4 mb-6 animate-float-up-down">
            <div className="relative">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFD700] animate-spin-slow"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD700] rounded-full animate-heartbeat"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent animate-neon-glow">
              {t("hero.title")}
            </h1>
          </div>
          <h2
            className="text-2xl md:text-3xl font-semibold mb-4 text-[#FFD700] animate-blur-in"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.subtitle")}
          </h2>
          <p
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-text-reveal"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="inline-block animate-wave">🎁</span>{" "}
            <strong>{t("hero.description")}</strong>
            <br />
            {t("hero.withAI")}
            <span className="text-[#FFD700] font-bold animate-pulsate mx-2">
              {t("hero.seconds")}
            </span>
            {t("hero.findPerfect")}
          </p>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8 animate-slide-in-left"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center justify-center gap-4 text-sm md:text-base flex-wrap">
              <div
                className="flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-3 h-3 bg-green-400 rounded-full animate-heartbeat"></div>
                <span>{t("hero.features.busy")}</span>
              </div>
              <div
                className="flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: "1s" }}
              >
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-heartbeat"></div>
                <span>{t("hero.features.aiUnderstands")}</span>
              </div>
              <div
                className="flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-heartbeat"></div>
                <span>{t("hero.features.perfect")}</span>
              </div>
            </div>
          </div>
          <a
            href="#gift-finder"
            className="inline-block bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] px-8 py-4 rounded-full font-bold text-lg hover:from-[#FFA500] hover:to-[#FFD700] hover:scale-110 transition-all duration-300 animate-float-up-down shadow-2xl"
            style={{ animationDelay: "1.4s" }}
          >
            🎯 {t("header.findGift")}
          </a>
        </div>
      </div>
    </section>
  );
}
