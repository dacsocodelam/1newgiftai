"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function BlogSection() {
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ready) return null;
  const blogPosts = [
    {
      title: t("blog.posts.0.title"),
      excerpt: t("blog.posts.0.excerpt"),
      image:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.0.category"),
      readTime: t("blog.posts.0.readTime"),
      date: t("blog.posts.0.date"),
    },
    {
      title: t("blog.posts.1.title"),
      excerpt: t("blog.posts.1.excerpt"),
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.1.category"),
      readTime: t("blog.posts.1.readTime"),
      date: t("blog.posts.1.date"),
    },
    {
      title: t("blog.posts.2.title"),
      excerpt: t("blog.posts.2.excerpt"),
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.2.category"),
      readTime: t("blog.posts.2.readTime"),
      date: t("blog.posts.2.date"),
    },
    {
      title: t("blog.posts.3.title"),
      excerpt: t("blog.posts.3.excerpt"),
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.3.category"),
      readTime: t("blog.posts.3.readTime"),
      date: t("blog.posts.3.date"),
    },
    {
      title: t("blog.posts.4.title"),
      excerpt: t("blog.posts.4.excerpt"),
      image:
        "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.4.category"),
      readTime: t("blog.posts.4.readTime"),
      date: t("blog.posts.4.date"),
    },
    {
      title: t("blog.posts.5.title"),
      excerpt: t("blog.posts.5.excerpt"),
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: t("blog.posts.5.category"),
      readTime: t("blog.posts.5.readTime"),
      date: t("blog.posts.5.date"),
    },
  ];

  return (
    <section id="blog" className="py-16 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            📚 {t("blog.title")}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#FFD700]/10 overflow-hidden hover:shadow-3xl hover:shadow-[#FFD700]/20 transition-all duration-300 border border-white/10">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ {t("blog.featured")}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-slate-400 text-sm">•</span>
                  <span className="text-slate-400 text-sm">
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white hover:text-[#FFD700] transition-colors cursor-pointer">
                  {blogPosts[0].title}
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    {blogPosts[0].date}
                  </span>
                  <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#020617] px-6 py-2 rounded-full font-bold hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all duration-300">
                    {t("blog.readMore")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <article
              key={index}
              className="bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-lg shadow-[#FFD700]/10 hover:shadow-2xl hover:shadow-[#FFD700]/20 hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer border border-white/10"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold mb-3 text-white hover:text-[#FFD700] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="text-[#FFD700] hover:text-[#001f3f] font-medium text-sm transition-colors">
                  {t("blog.readMore")}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#020617] px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all duration-300 transform hover:scale-105">
            {t("blog.viewAll")}
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 text-center text-white border border-white/10 shadow-lg shadow-[#FFD700]/10">
          <h3 className="text-2xl font-bold mb-4">
            {t("blog.newsletter.title")}
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            {t("blog.newsletter.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("blog.newsletter.placeholder")}
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md rounded-full text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
            />
            <button className="bg-[#FFD700] text-[#020617] px-6 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all duration-300">
              {t("blog.newsletter.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
