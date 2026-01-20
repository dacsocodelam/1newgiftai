"use client";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

// Particle component for orbiting effects
const OrbitParticle = ({
  delay,
  radius,
}: {
  delay: number;
  radius: number;
}) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-[#FFD700] rounded-full shadow-[0_0_10px_#FFD700]"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{
        top: "50%",
        left: "50%",
        marginLeft: `-${radius}px`,
        marginTop: "-4px",
      }}
    >
      <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
    </motion.div>
  );
};

// Portal Card Component
const PortalCard = ({
  member,
  index,
}: {
  member: {
    name: string;
    role: string;
    imageUrl: string;
    bio: string;
    stats: { label: string; value: number; color: string }[];
  };
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <motion.div
        className="relative w-full aspect-square max-w-md mx-auto"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
      >
        {/* Glassmorphism Portal Base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-2xl border-2 border-[#FFD700]/30 shadow-[0_0_60px_rgba(255,215,0,0.3),inset_0_0_60px_rgba(255,215,0,0.1)]">
          {/* Orbiting Particles */}
          <div className="absolute inset-0 rounded-full overflow-visible">
            {[...Array(8)].map((_, i) => (
              <OrbitParticle
                key={i}
                delay={i * 1}
                radius={Math.sin((i * Math.PI) / 4) * 180 + 200}
              />
            ))}
          </div>

          {/* Neon Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0_0_20px_rgba(255,215,0,0.4),0_0_40px_rgba(255,215,0,0.3),0_0_60px_rgba(255,215,0,0.2)",
                "0_0_40px_rgba(255,215,0,0.6),0_0_80px_rgba(255,215,0,0.4),0_0_120px_rgba(255,215,0,0.3)",
                "0_0_20px_rgba(255,215,0,0.4),0_0_40px_rgba(255,215,0,0.3),0_0_60px_rgba(255,215,0,0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner Content Container */}
          <div className="absolute inset-8 rounded-full overflow-hidden">
            {/* Profile Image - Fades on hover */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              animate={{
                opacity: isHovered ? 0 : 1,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* RPG Stats Panel - Reveals on hover */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col justify-center items-center p-8 space-y-4"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-[#FFD700] mb-4">
                ⚡ Stats
              </h3>
              {member.stats.map((stat, i) => (
                <div key={i} className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{stat.label}</span>
                    <motion.span
                      className="text-[#FFD700] font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      {stat.value}%
                    </motion.span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${stat.color} rounded-full shadow-lg`}
                      initial={{ width: 0 }}
                      animate={{
                        width: isHovered ? `${stat.value}%` : 0,
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1 + 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Center Glow Effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Name & Role Badge */}
          <motion.div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.5 }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-[#FFD700]/30 rounded-2xl p-4 text-center shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              <h3 className="text-xl font-bold text-[#FFD700] mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-slate-300">{member.role}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AboutUs() {
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ready) return null;

  const teamMembers = [
    {
      name: t("about.team.0.name"),
      role: t("about.team.0.role"),
      imageUrl: "/img/bom.jpg",
      bio: t("about.team.0.bio"),
      stats: [
        {
          label: "Fullstack Coding",
          value: 96,
          color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        },
        {
          label: "AI Magic",
          value: 92,
          color: "bg-gradient-to-r from-purple-500 to-pink-500",
        },
        {
          label: "System Optimization",
          value: 89,
          color: "bg-gradient-to-r from-green-500 to-emerald-500",
        },
      ],
    },
    {
      name: t("about.team.1.name"),
      role: t("about.team.1.role"),
      imageUrl: "/img/dat.jpg",
      bio: t("about.team.1.bio"),
      stats: [
        {
          label: "UI/UX Design",
          value: 95,
          color: "bg-gradient-to-r from-orange-500 to-red-500",
        },
        {
          label: "Japanese N2",
          value: 90,
          color: "bg-gradient-to-r from-pink-500 to-rose-500",
        },
        {
          label: "Idea Generation",
          value: 98,
          color: "bg-gradient-to-r from-yellow-500 to-amber-500",
        },
      ],
    },
  ];

  return (
    <section
      id="about"
      className="py-32 text-white relative z-10 overflow-hidden"
    >
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Title Section */}
        <motion.div
          className="text-center mb-32"
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
            👥 {t("about.title")}
          </motion.h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>

          {/* Decorative Line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-auto mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Portal Cards Grid */}
        <div className="grid md:grid-cols-2 gap-24 md:gap-32 mb-20">
          {teamMembers.map((member, index) => (
            <PortalCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Shimane IT Design College Badge */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div
            id="graduation-project-badge"
            data-graduation-trigger
            className="inline-block bg-gradient-to-r from-[#FFD700]/10 via-purple-500/10 to-[#FFD700]/10 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl px-8 py-4 shadow-[0_0_40px_rgba(255,215,0,0.15)]"
          >
            <p className="text-slate-300 text-lg">
              🎓 Graduation Project at{" "}
              <span className="text-[#FFD700] font-semibold">
                Shimane IT Design College
              </span>
            </p>
          </div>
        </motion.div>
      </div>
      {/* End marker for SchoolPride badge trigger */}
      <div id="aboutus-end" className="h-1"></div>
    </section>
  );
}
