"use client";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();
  
  const teamMembers = [
    {
      name: t('about.team.0.name'),
      role: t('about.team.0.role'),
      imageUrl: "/img/bom.jpg",
      bio: t('about.team.0.bio'),
      emoji: "💻"
    },
    {
      name: t('about.team.1.name'),
      role: t('about.team.1.role'),
      imageUrl: "/img/dat.jpg",
      bio: t('about.team.1.bio'),
      emoji: "🎨"
    },
  ];

  return (
    <section id="about" className="py-16 bg-[#001f3f] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            👥 {t("about.title")}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-[#003366]/50 p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-40 h-40 mx-auto mb-6">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="w-full h-full rounded-full object-cover border-4 border-[#FFD700]"
                />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#FFD700] rounded-full animate-pulse flex items-center justify-center text-lg">
                  {member.emoji}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
                {member.name}
              </h3>
              <p className="font-semibold text-white mb-4">{member.role}</p>
              <p className="text-gray-300">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
