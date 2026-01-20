"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Neural Link Component with glow and floating dot
const NeuralLink = ({ href, children, emoji }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative px-4 py-2 text-slate-200 hover:text-[#FFD700] transition-all duration-300 font-light text-sm"
      suppressHydrationWarning
    >
      {/* Floating Dot on Hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0 }}
          animate={{ opacity: 1, y: -8, scale: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFD700] rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        />
      )}

      {/* Text with Neural Glow */}
      <span className="relative z-10 drop-shadow-[0_0_0px_rgba(255,215,0,0)] group-hover:drop-shadow-[0_0_16px_rgba(255,215,0,0.9)] transition-all duration-300">
        {emoji} {children}
      </span>

      {/* Bottom Line */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,215,0,0.6)]"></span>
    </motion.a>
  );
};

export default function Header() {
  const { t, i18n, ready } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "ja", flag: "🇯🇵", name: "日本語" },
    { code: "en", flag: "🇺🇸", name: "English" },
    { code: "vi", flag: "🇻🇳", name: "Tiếng Việt" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  if (!isMounted || !ready) {
    return (
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-6 pointer-events-none">
        <div className="relative pointer-events-auto">
          <div className="relative bg-black/40 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-8 py-4">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-3">
                <div className="relative animate-pulse">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-lg font-light tracking-wider bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                  GiftAI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Border Beam Animation */}
      <style jsx>{`
        @keyframes border-beam {
          0% {
            transform: rotate(0deg) translateX(0px);
          }
          100% {
            transform: rotate(360deg) translateX(0px);
          }
        }

        .beam-rotating {
          animation: border-beam 6s linear infinite;
        }
      `}</style>

      <motion.div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-6 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="relative pointer-events-auto"
          animate={{
            scale: isScrolled ? 0.9 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Border Beam Effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="beam-rotating absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent blur-sm"></div>
            </div>
          </div>

          {/* Main Unified Hub Container */}
          <div className="relative bg-black/40 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-8 py-4">
            <div className="flex justify-between items-center gap-4">
              {/* Logo with Breathing Glow */}
              <motion.div
                className="flex items-center gap-3 flex-shrink-0"
                animate={{
                  filter: [
                    "drop-shadow(0 0 16px rgba(255,215,0,0.6))",
                    "drop-shadow(0 0 28px rgba(255,215,0,1))",
                    "drop-shadow(0 0 16px rgba(255,215,0,0.6))",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  <svg
                    width={isScrolled ? "24" : "28"}
                    height={isScrolled ? "24" : "28"}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#FFD700] transition-all duration-300"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  <motion.div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFD700] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span
                  className={`font-light tracking-wider bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent transition-all duration-300 ${
                    isScrolled ? "text-base" : "text-lg"
                  }`}
                  suppressHydrationWarning
                >
                  GiftAI
                </span>
              </motion.div>

              {/* Desktop Navigation - ALL IN ONE */}
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                <NeuralLink href="#home" emoji="🏠">
                  {t("header.home")}
                </NeuralLink>

                <NeuralLink href="#how-it-works" emoji="⚙️">
                  {t("header.howItWorks")}
                </NeuralLink>

                <NeuralLink href="#gift-finder" emoji="🎁">
                  {t("header.findGift")}
                </NeuralLink>

                <NeuralLink href="#blog" emoji="📝">
                  {t("header.blog")}
                </NeuralLink>

                <NeuralLink href="#about" emoji="ℹ️">
                  {t("header.about")}
                </NeuralLink>
              </div>

              {/* Language Switcher + CTA Button */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                {/* Language Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-200 text-sm font-light transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    suppressHydrationWarning
                  >
                    <span className="text-base" suppressHydrationWarning>
                      {currentLanguage.flag}
                    </span>
                    <span suppressHydrationWarning>{currentLanguage.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isLangOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.button>

                  {/* Dropdown Menu */}
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden min-w-[180px]"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/10 transition-all duration-200 ${
                            i18n.language === lang.code
                              ? "bg-[#FFD700]/10 text-[#FFD700]"
                              : "text-slate-200"
                          }`}
                          suppressHydrationWarning
                        >
                          <span className="text-lg" suppressHydrationWarning>
                            {lang.flag}
                          </span>
                          <span
                            className="text-sm font-light"
                            suppressHydrationWarning
                          >
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* CTA Button with Triple Glow */}
                <motion.a
                  href="#get-started"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full text-black font-medium text-sm overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Triple Glow Layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-70 blur-2xl transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-50 blur-3xl transition-opacity duration-300"></div>

                  <span className="relative z-10">{t("header.findGift")}</span>
                </motion.a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-200 hover:text-[#FFD700] transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-md lg:hidden"
        >
          <div className="bg-black/90 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex flex-col p-4 gap-2">
              <a
                href="#home"
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 {t("header.home")}
              </a>

              <a
                href="#how-it-works"
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚙️ {t("header.howItWorks")}
              </a>

              <a
                href="#gift-finder"
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                🎁 {t("header.findGift")}
              </a>

              <a
                href="#blog"
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                📝 {t("header.blog")}
              </a>

              <a
                href="#about"
                className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ {t("header.about")}
              </a>

              <div className="h-px bg-white/10 my-2"></div>

              {/* Mobile Language Options */}
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                    i18n.language === lang.code
                      ? "bg-[#FFD700]/10 text-[#FFD700]"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}

              <div className="h-px bg-white/10 my-2"></div>

              {/* Mobile CTA */}
              <a
                href="#get-started"
                className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl text-black font-medium text-center hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.findGift")}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
