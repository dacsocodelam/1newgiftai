"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// Neural Path component - Energy pulse flowing through steps
const NeuralPath = ({
  delay = 0,
  isActive = false,
}: {
  delay?: number;
  isActive?: boolean;
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Neural path line */}
        <motion.path
          d="M100,180 Q150,150 180,100"
          stroke="rgba(255,215,0,0.2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 1, delay }}
        />

        {/* Energy pulse */}
        {isActive && (
          <motion.circle r="4" fill="#FFD700" filter="url(#glow)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M100,180 Q150,150 180,100"
            />
          </motion.circle>
        )}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

// Hologram Node component
const HologramNode = ({
  step,
  icon,
  isActive,
  inView,
}: {
  step: string;
  icon: string;
  isActive: boolean;
  inView: boolean;
}) => {
  return (
    <motion.div
      className="relative w-32 h-32 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: inView ? 1 : 0,
        opacity: inView ? 1 : 0,
      }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Rotating hologram ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#FFD700]/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Glass morphism center */}
      <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
        {/* Icon with neon glow */}
        <motion.div
          className="text-5xl"
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
            filter: isActive
              ? [
                  "drop-shadow(0 0 8px rgba(255,215,0,0.8))",
                  "drop-shadow(0 0 20px rgba(255,215,0,1))",
                  "drop-shadow(0 0 8px rgba(255,215,0,0.8))",
                ]
              : "drop-shadow(0 0 4px rgba(255,215,0,0.3))",
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Step number badge */}
      <motion.div
        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg"
        animate={{
          y: isActive ? [-2, 2, -2] : 0,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {step}
      </motion.div>
    </motion.div>
  );
};

// Glassmorphism Card with typing effect
const StepCard = ({
  step,
  title,
  description,
  details,
  isActive,
  inView,
}: {
  step: string;
  title: string;
  description: string;
  details: string[];
  isActive: boolean;
  inView: boolean;
}) => {
  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 overflow-hidden"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Border beam effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD700, transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "200% 50%"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-[1px] rounded-3xl bg-black/90 backdrop-blur-3xl" />
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Title */}
        <motion.h3
          className="text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-slate-300 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {description}
        </motion.p>

        {/* Details with typing effect */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#FFD700] mb-3">
            ステップ{step}の詳細：
          </h4>
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-sm text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: inView && isActive ? 1 : inView ? 0.6 : 0,
                  x: inView ? 0 : -20,
                }}
                transition={{
                  duration: 0.4,
                  delay: inView && isActive ? 0.6 + index * 0.1 : 0.6,
                }}
              >
                <motion.div
                  className="w-2 h-2 bg-[#FFD700] rounded-full mt-1.5 flex-shrink-0"
                  animate={{
                    scale: isActive ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <span>{detail}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Step Item Component (to avoid hooks in map)
const StepItem = ({
  step,
  index,
  activeStep,
}: {
  step: {
    step: string;
    title: string;
    description: string;
    icon: string;
    details: string[];
  };
  index: number;
  activeStep: number;
}) => {
  const stepRef = useRef(null);
  const stepInView = useInView(stepRef, { margin: "-30%" });

  return (
    <motion.div
      ref={stepRef}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      {/* Hologram Node */}
      <div className="flex justify-center mb-8">
        <HologramNode
          step={step.step}
          icon={step.icon}
          isActive={activeStep === index}
          inView={stepInView}
        />
      </div>

      {/* Step Card */}
      <StepCard
        step={step.step}
        title={step.title}
        description={step.description}
        details={step.details}
        isActive={activeStep === index}
        inView={stepInView}
      />

      {/* Neural path connector (except last item) */}
      {index < 3 && (
        <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-1">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFD700]/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: stepInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default function HowItWorks() {
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-20%" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  if (!isMounted || !ready) return null;

  const steps = [
    {
      step: "01",
      title: t("howItWorks.steps.step1.title"),
      description: t("howItWorks.steps.step1.description"),
      icon: "📝",
      details: [
        t("howItWorks.steps.step1.details.0"),
        t("howItWorks.steps.step1.details.1"),
        t("howItWorks.steps.step1.details.2"),
        t("howItWorks.steps.step1.details.3"),
        t("howItWorks.steps.step1.details.4"),
      ],
    },
    {
      step: "02",
      title: t("howItWorks.steps.step2.title"),
      description: t("howItWorks.steps.step2.description"),
      icon: "🤖",
      details: [
        t("howItWorks.steps.step2.details.0"),
        t("howItWorks.steps.step2.details.1"),
        t("howItWorks.steps.step2.details.2"),
        t("howItWorks.steps.step2.details.3"),
        t("howItWorks.steps.step2.details.4"),
      ],
    },
    {
      step: "03",
      title: t("howItWorks.steps.step3.title"),
      description: t("howItWorks.steps.step3.description"),
      icon: "🎁",
      details: [
        t("howItWorks.steps.step3.details.0"),
        t("howItWorks.steps.step3.details.1"),
        t("howItWorks.steps.step3.details.2"),
        t("howItWorks.steps.step3.details.3"),
        t("howItWorks.steps.step3.details.4"),
      ],
    },
    {
      step: "04",
      title: t("howItWorks.steps.step4.title"),
      description: t("howItWorks.steps.step4.description"),
      icon: "✨",
      details: [
        t("howItWorks.steps.step4.details.0"),
        t("howItWorks.steps.step4.details.1"),
        t("howItWorks.steps.step4.details.2"),
        t("howItWorks.steps.step4.details.3"),
        t("howItWorks.steps.step4.details.4"),
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-32 relative z-10 overflow-hidden"
    >
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            ⚙️ {t("howItWorks.title")}
          </motion.h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("howItWorks.subtitle")}
          </p>

          {/* Decorative line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-auto mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Neural Flow Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {steps.map((step, index) => (
            <StepItem
              key={index}
              step={step}
              index={index}
              activeStep={activeStep}
            />
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          className="mt-32 bg-white/5 backdrop-blur-3xl rounded-3xl p-12 border border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-white">
                🏆 {t("howItWorks.benefits.title")}
              </h3>
              <p className="text-slate-300 text-lg">
                {t("howItWorks.benefits.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚡",
                  title: t("howItWorks.benefits.speed.title"),
                  description: t("howItWorks.benefits.speed.description"),
                },
                {
                  icon: "🧠",
                  title: t("howItWorks.benefits.intelligent.title"),
                  description: t("howItWorks.benefits.intelligent.description"),
                },
                {
                  icon: "💝",
                  title: t("howItWorks.benefits.personalized.title"),
                  description: t(
                    "howItWorks.benefits.personalized.description",
                  ),
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <h4 className="font-bold text-xl mb-3 text-white group-hover:text-[#FFD700] transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-white">
            {t("howItWorks.cta.title")}
          </h3>
          <motion.a
            href="#gift-finder"
            className="inline-block relative px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full font-bold text-lg text-black overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ transform: "skewX(-20deg)" }}
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <span className="relative z-10">{t("howItWorks.cta.button")}</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
