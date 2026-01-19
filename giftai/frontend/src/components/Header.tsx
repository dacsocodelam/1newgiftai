"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-[#FFD700]/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFD700]"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              GiftAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium"
            >
              🏠 {t('header.home')}
            </a>
            <a
              href="#how-it-works"
              className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium"
            >
              ⚙️ {t('header.howItWorks')}
            </a>
            <a
              href="#blog"
              className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium"
            >
              📝 {t('header.blog')}
            </a>
            <a
              href="#about"
              className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium"
            >
              👥 {t('header.about')}
            </a>
            <a
              href="#gift-finder"
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] px-6 py-2 rounded-full font-bold hover:from-[#001f3f] hover:to-[#003366] hover:text-white transition-all duration-300"
            >
              🎯 今すぐギフト検索
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#001f3f] hover:text-[#FFD700] transition-colors"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FFD700]/20">
            <div className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium py-2"
              >
                🏠 {t('header.home')}
              </a>
              <a
                href="#how-it-works"
                className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium py-2"
              >
                ⚙️ {t('header.howItWorks')}
              </a>
              <a
                href="#blog"
                className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium py-2"
              >
                📝 {t('header.blog')}
              </a>
              <a
                href="#about"
                className="text-[#001f3f] hover:text-[#FFD700] transition-colors font-medium py-2"
              >
                👥 {t('header.about')}
              </a>
              <a
                href="#gift-finder"
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] px-6 py-3 rounded-full font-bold hover:from-[#001f3f] hover:to-[#003366] hover:text-white transition-all duration-300 text-left"
              >
                🎯 {t('header.findGift')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
